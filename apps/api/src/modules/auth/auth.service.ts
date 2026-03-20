import * as crypto from 'crypto';

import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../infrastructure/database/prisma.service';

import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Register a new OEM user
   */
  async register(dto: RegisterDto) {
    // Check existing
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        role: Role.OEM,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        isVerified: false,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        token: refreshToken,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old refresh token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const { user } = storedToken;
    return this.generateTokens(user.id, user.email, user.role);
  }

  /**
   * Get current user info
   */
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Logout - revoke refresh token
   */
  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Forgot password — generate reset token and send email via Resend
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user || !user.isActive) {
      return { message: 'If the email is registered, a reset link has been sent.' };
    }

    // Invalidate any existing unused reset tokens for this user
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send email via Resend
    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
    const resetLink = `${appUrl}/reset-password?token=${token}`;
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: this.configService.get<string>(
              'RESEND_FROM_EMAIL',
              'APCD Portal <noreply@apcd.npc.gov.in>',
            ),
            to: [user.email],
            subject: 'APCD Portal — Password Reset',
            html: `
              <p>Dear ${user.firstName},</p>
              <p>You requested a password reset for your APCD Portal account.</p>
              <p><a href="${resetLink}">Click here to reset your password</a></p>
              <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
              <p>Regards,<br/>APCD Empanelment Portal</p>
            `,
          }),
        });

        if (!response.ok) {
          this.logger.error(`Resend API error: ${response.status} ${await response.text()}`);
        }
      } catch (error) {
        this.logger.error(`Failed to send reset email: ${error.message}`);
      }
    } else {
      this.logger.warn('RESEND_API_KEY not configured — password reset email not sent');
      this.logger.log(`Reset link (dev): ${resetLink}`);
    }

    return { message: 'If the email is registered, a reset link has been sent.' };
  }

  /**
   * Reset password using token
   */
  async resetPassword(dto: ResetPasswordDto) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      // Revoke all existing refresh tokens (force re-login)
      this.prisma.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return {
      message: 'Password has been reset successfully. Please login with your new password.',
    };
  }

  /**
   * Change password (authenticated)
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Change email — send verification link to new email
   */
  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const newEmailLower = dto.newEmail.toLowerCase();

    // Check if new email is already in use
    const existing = await this.prisma.user.findUnique({
      where: { email: newEmailLower },
    });
    if (existing) {
      throw new ConflictException('Email is already in use by another account');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Invalidate previous change tokens
    await this.prisma.emailChangeToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.prisma.emailChangeToken.create({
      data: {
        userId,
        newEmail: newEmailLower,
        token,
        expiresAt,
      },
    });

    // Send verification email to the NEW address via Resend
    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
    const verifyLink = `${appUrl}/verify-email-change?token=${token}`;
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: this.configService.get<string>(
              'RESEND_FROM_EMAIL',
              'APCD Portal <noreply@apcd.npc.gov.in>',
            ),
            to: [newEmailLower],
            subject: 'APCD Portal — Verify Your New Email',
            html: `
              <p>Dear ${user.firstName},</p>
              <p>You requested to change your APCD Portal email to this address.</p>
              <p><a href="${verifyLink}">Click here to confirm</a></p>
              <p>This link is valid for 24 hours. If you did not request this, please ignore this email.</p>
              <p>Regards,<br/>APCD Empanelment Portal</p>
            `,
          }),
        });

        if (!response.ok) {
          this.logger.error(`Resend API error: ${response.status} ${await response.text()}`);
        }
      } catch (error) {
        this.logger.error(`Failed to send email verification: ${error.message}`);
      }
    } else {
      this.logger.warn('RESEND_API_KEY not configured — email verification not sent');
      this.logger.log(`Verify link (dev): ${verifyLink}`);
    }

    return { message: 'A verification link has been sent to your new email address.' };
  }

  /**
   * Confirm email change using token
   */
  async confirmEmailChange(token: string) {
    const changeToken = await this.prisma.emailChangeToken.findUnique({
      where: { token },
    });

    if (!changeToken || changeToken.usedAt || changeToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Re-check that new email is still available
    const existing = await this.prisma.user.findUnique({
      where: { email: changeToken.newEmail },
    });
    if (existing) {
      throw new ConflictException('Email is already in use by another account');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: changeToken.userId },
        data: { email: changeToken.newEmail },
      }),
      this.prisma.emailChangeToken.update({
        where: { id: changeToken.id },
        data: { usedAt: new Date() },
      }),
      // Revoke all refresh tokens (force re-login with new email)
      this.prisma.refreshToken.updateMany({
        where: { userId: changeToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Email updated successfully. Please login with your new email.' };
  }

  /**
   * Reset test user passwords (for CI/CD integration testing).
   * Protected by SEED_SECRET environment variable.
   * Disabled entirely in production.
   */
  async resetTestPasswords(secret: string) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (nodeEnv === 'production') {
      throw new ForbiddenException('This endpoint is disabled in production');
    }

    const seedSecret = this.configService.get<string>('SEED_SECRET');
    if (!seedSecret) {
      throw new ForbiddenException('SEED_SECRET environment variable is not configured');
    }
    if (secret !== seedSecret) {
      throw new ForbiddenException('Invalid seed secret');
    }

    const testUsers: {
      email: string;
      password: string;
      role: Role;
      firstName: string;
      lastName: string;
    }[] = [
      {
        email: 'admin@npcindia.gov.in',
        password: 'Admin@APCD2025!',
        role: Role.SUPER_ADMIN,
        firstName: 'System',
        lastName: 'Administrator',
      },
      {
        email: 'officer@npcindia.gov.in',
        password: 'Officer@APCD2025!',
        role: Role.OFFICER,
        firstName: 'Test',
        lastName: 'Officer',
      },
      {
        email: 'head@npcindia.gov.in',
        password: 'Head@APCD2025!',
        role: Role.ADMIN,
        firstName: 'Head',
        lastName: 'Officer',
      },
      {
        email: 'committee@npcindia.gov.in',
        password: 'Committee@APCD2025!',
        role: Role.COMMITTEE,
        firstName: 'Committee',
        lastName: 'Member',
      },
      {
        email: 'fieldverifier@npcindia.gov.in',
        password: 'Field@APCD2025!',
        role: Role.FIELD_VERIFIER,
        firstName: 'Field',
        lastName: 'Verifier',
      },
      {
        email: 'dealinghand@npcindia.gov.in',
        password: 'Dealing@APCD2025!',
        role: Role.DEALING_HAND,
        firstName: 'Dealing',
        lastName: 'Hand',
      },
      {
        email: 'oem@testcompany.com',
        password: 'Oem@APCD2025!',
        role: Role.OEM,
        firstName: 'Test',
        lastName: 'OEM',
      },
    ];

    const results: { email: string; action: string }[] = [];
    for (const u of testUsers) {
      const hash = await bcrypt.hash(u.password, 12);
      await this.prisma.user.upsert({
        where: { email: u.email },
        update: { passwordHash: hash },
        create: {
          email: u.email,
          passwordHash: hash,
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
          isActive: true,
          isVerified: true,
        },
      });
      results.push({ email: u.email, action: 'upserted' });
    }

    // Ensure OEM profile exists for test OEM
    const oemUser = await this.prisma.user.findUnique({
      where: { email: 'oem@testcompany.com' },
    });
    if (oemUser) {
      await this.prisma.oemProfile.upsert({
        where: { userId: oemUser.id },
        update: {},
        create: {
          userId: oemUser.id,
          companyName: 'Test APCD Manufacturing Pvt Ltd',
          fullAddress: '123, Industrial Area, Phase-II, New Delhi, Delhi - 110020',
          state: 'Delhi',
          pinCode: '110020',
          contactNo: '9876543210',
          gstRegistrationNo: '07AABCT1234F1ZP',
          panNo: 'AABCT1234F',
          firmType: 'PRIVATE_LIMITED',
        },
      });
    }

    return { message: 'Test passwords reset', count: results.length, results };
  }

  /**
   * Generate access + refresh token pair
   */
  private async generateTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m'),
    });

    const refreshTokenValue = uuidv4();
    const refreshExpiryDays = 7;
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + refreshExpiryDays);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
