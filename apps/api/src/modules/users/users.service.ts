import * as crypto from 'crypto';

import { Role } from '@apcd/database';
import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { MinioService } from '../../infrastructure/storage/minio.service';

import { AddMobileDto } from './dto/add-mobile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyMobileDto } from './dto/verify-mobile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private minio: MinioService,
  ) {}

  async findAll(pagination: PaginationDto, role?: Role): Promise<PaginatedResult<any>> {
    const where = role ? { role } : {};
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          isVerified: true,
          lastLoginAt: true,
          createdAt: true,
        },
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 20,
        totalPages: Math.ceil(total / (pagination.limit ?? 20)),
      },
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        isVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createInternalUser(data: {
    email: string;
    password: string;
    role: Role;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isActive: true,
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async toggleActive(id: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, email: true, isActive: true },
    });
  }

  /**
   * Get full profile for current user
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        mobile: true,
        mobileVerified: true,
        profilePhotoUrl: true,
        isActive: true,
        isVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Update profile (name and optional photo upload)
   */
  async updateProfile(userId: string, dto: UpdateProfileDto, photo?: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: Record<string, any> = {};
    if (dto.firstName) updateData.firstName = dto.firstName;
    if (dto.lastName) updateData.lastName = dto.lastName;

    if (photo) {
      const objectKey = `profile-photos/${userId}/${Date.now()}_${photo.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await this.minio.uploadFile(objectKey, photo.buffer, photo.mimetype);
      updateData.profilePhotoUrl = objectKey;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePhotoUrl: true,
      },
    });

    return updated;
  }

  /**
   * Add mobile number — send OTP via Fast2SMS
   */
  async addMobile(userId: string, dto: AddMobileDto) {
    // Invalidate previous OTPs for this user
    await this.prisma.mobileOtp.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.mobileOtp.create({
      data: {
        userId,
        mobile: dto.mobile,
        otp,
        expiresAt,
      },
    });

    // Store mobile on user (unverified)
    await this.prisma.user.update({
      where: { id: userId },
      data: { mobile: dto.mobile, mobileVerified: false },
    });

    // Send OTP via Fast2SMS
    const fast2smsKey = this.configService.get<string>('FAST2SMS_API_KEY');

    if (fast2smsKey) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: fast2smsKey,
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otp,
            numbers: dto.mobile,
          }),
        });

        if (!response.ok) {
          this.logger.error(`Fast2SMS error: ${response.status} ${await response.text()}`);
        }
      } catch (error) {
        this.logger.error(`Failed to send OTP: ${error.message}`);
      }
    } else {
      this.logger.warn('FAST2SMS_API_KEY not configured — OTP not sent via SMS');
      this.logger.log(`OTP (dev): ${otp} for mobile ${dto.mobile}`);
    }

    return { message: 'OTP has been sent to your mobile number.' };
  }

  /**
   * Verify mobile OTP
   */
  async verifyMobile(userId: string, dto: VerifyMobileDto) {
    const otpRecord = await this.prisma.mobileOtp.findFirst({
      where: {
        userId,
        otp: dto.otp,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      // Increment attempt count on the latest OTP for this user
      const latest = await this.prisma.mobileOtp.findFirst({
        where: { userId, usedAt: null },
        orderBy: { createdAt: 'desc' },
      });
      if (latest) {
        await this.prisma.mobileOtp.update({
          where: { id: latest.id },
          data: { attempts: { increment: 1 } },
        });

        if (latest.attempts >= 4) {
          // 5th attempt — invalidate
          await this.prisma.mobileOtp.update({
            where: { id: latest.id },
            data: { usedAt: new Date() },
          });
          throw new BadRequestException('Too many failed attempts. Please request a new OTP.');
        }
      }

      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.$transaction([
      this.prisma.mobileOtp.update({
        where: { id: otpRecord.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { mobileVerified: true },
      }),
    ]);

    return { message: 'Mobile number verified successfully.' };
  }
}
