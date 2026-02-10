import { PrismaClient } from '@apcd/database';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      this.logger.warn('DATABASE_URL not set - database operations will fail until configured');
      return;
    }

    try {
      // Timeout after 15s to prevent hanging during startup
      await Promise.race([
        this.$connect(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Database connection timed out after 15s')), 15000),
        ),
      ]);
      this.connected = true;
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error(
        `Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Don't throw - allow app to start for health checks
      // Database operations will fail individually
    }
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.$disconnect();
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
