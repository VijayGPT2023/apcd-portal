import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../../infrastructure/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ScheduledTasksService {
  private readonly logger = new Logger(ScheduledTasksService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /**
   * Daily at 8 AM — send certificate expiry reminders (60 days window)
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendCertificateExpiryReminders() {
    this.logger.log('Running certificate expiry reminder job...');
    try {
      const count = await this.notifications.sendExpiryReminders();
      this.logger.log(`Certificate expiry reminders sent: ${count}`);
    } catch (error) {
      this.logger.error(`Certificate expiry reminder job failed: ${error.message}`);
    }
  }

  /**
   * Daily at 2 AM — clean up expired tokens and OTPs
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupExpiredTokens() {
    this.logger.log('Running expired token cleanup...');
    try {
      const now = new Date();

      // Clean expired refresh tokens (older than 30 days)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const refreshResult = await this.prisma.refreshToken.deleteMany({
        where: {
          OR: [{ expiresAt: { lt: thirtyDaysAgo } }, { revokedAt: { lt: thirtyDaysAgo } }],
        },
      });

      // Clean expired password reset tokens (older than 24 hours)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const resetResult = await this.prisma.passwordResetToken.deleteMany({
        where: {
          OR: [{ expiresAt: { lt: oneDayAgo } }, { usedAt: { not: null } }],
        },
      });

      // Clean expired email change tokens (older than 48 hours)
      const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      const emailResult = await this.prisma.emailChangeToken.deleteMany({
        where: {
          OR: [{ expiresAt: { lt: twoDaysAgo } }, { usedAt: { not: null } }],
        },
      });

      // Clean expired mobile OTPs (older than 1 hour)
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const otpResult = await this.prisma.mobileOtp.deleteMany({
        where: {
          OR: [{ expiresAt: { lt: oneHourAgo } }, { usedAt: { not: null } }],
        },
      });

      this.logger.log(
        `Cleanup complete: ${refreshResult.count} refresh tokens, ` +
          `${resetResult.count} reset tokens, ${emailResult.count} email tokens, ` +
          `${otpResult.count} OTPs removed`,
      );
    } catch (error) {
      this.logger.error(`Token cleanup failed: ${error.message}`);
    }
  }
}
