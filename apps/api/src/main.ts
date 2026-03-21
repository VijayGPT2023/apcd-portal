import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Early startup logging for debugging deployment issues
console.log('=== APCD Portal API Starting ===');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`DATABASE_URL set: ${!!process.env.DATABASE_URL}`);

if (!process.env.NODE_ENV) {
  console.warn(
    'WARNING: NODE_ENV is not set. Defaulting to development mode. ' +
      'Swagger API docs will be publicly accessible. Set NODE_ENV=production in your deployment.',
  );
}

// BigInt cannot be serialized to JSON by default — this polyfill converts to Number
// Safe for fileSizeBytes which won't exceed Number.MAX_SAFE_INTEGER
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  console.log('Creating NestJS application...');

  // Timeout guard: if NestFactory.create hangs (e.g. DB connection), force-log after 30s
  const startupTimer = setTimeout(() => {
    console.error(
      'WARNING: NestFactory.create() is taking longer than 30s - possible hang in module initialization',
    );
  }, 30000);

  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  clearTimeout(startupTimer);
  console.log('NestJS application created successfully');
  const configService = app.get(ConfigService);

  // Validate critical secrets in production
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  if (isProduction) {
    const jwtSecret = configService.get<string>('JWT_SECRET', '');
    const jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET', '');
    const placeholderPatterns = ['change-in-production', 'your-super-secret', 'your-very-long'];
    const isPlaceholder = (val: string) =>
      !val || placeholderPatterns.some((p) => val.toLowerCase().includes(p));

    if (isPlaceholder(jwtSecret) || isPlaceholder(jwtRefreshSecret)) {
      console.error(
        'FATAL: JWT_SECRET and/or JWT_REFRESH_SECRET contain placeholder values. ' +
          'Generate secure secrets with: openssl rand -base64 64',
      );
      process.exit(1);
    }
  }

  // CORS
  const appUrl = configService.get<string>('APP_URL', 'http://localhost:3000');
  const allowedOrigins = appUrl
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Gzip compression for all responses
  app.use(compression());

  // JSON body size limit (1MB) — prevents payload-based DoS
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const express = require('express');
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(express.json({ limit: '1mb' }));
  expressApp.use(express.urlencoded({ limit: '1mb', extended: true }));

  // Graceful shutdown — close DB connections cleanly on SIGTERM
  app.enableShutdownHooks();

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      // HSTS: enforce HTTPS for 1 year in production
      hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true } : false,
      // Content Security Policy
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: ["'self'", 'https:'],
              fontSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameSrc: ["'none'"],
              upgradeInsecureRequests: [],
            },
          }
        : false,
      // Prevent MIME-type sniffing
      noSniff: true,
      // XSS filter
      xssFilter: true,
      // Prevent clickjacking
      frameguard: { action: 'deny' },
      // Referrer policy
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new PerformanceInterceptor(), new TransformInterceptor());

  // Swagger API docs (dev only)
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('APCD Empanelment Portal API')
      .setDescription(
        'API for the OEM Empanelment Portal - National Productivity Council (NPC) / CPCB',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Authentication & registration')
      .addTag('OEM Profile', 'OEM company profile management')
      .addTag('Applications', 'Application lifecycle management')
      .addTag('APCD Types', 'APCD master data')
      .addTag('Attachments', 'Document upload & management')
      .addTag('Verification', 'Officer document verification & queries')
      .addTag('Committee', 'Committee evaluation & scoring')
      .addTag('Field Verification', 'Field reports & site inspections')
      .addTag('Payments', 'Payment processing (Razorpay + NEFT)')
      .addTag('Certificates', 'Certificate generation & QR verification')
      .addTag('Dashboard', 'Role-specific dashboard data')
      .addTag('Admin', 'System administration')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get<number>('PORT', 4000);
  // Listen on 0.0.0.0 to accept connections from outside container (required for Railway)
  await app.listen(port, '0.0.0.0');
  console.log(`APCD Portal API running on http://0.0.0.0:${port}`);
  console.log(`Health check: http://0.0.0.0:${port}/api/health`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
  if (configService.get<string>('NODE_ENV') !== 'production') {
    console.log(`Swagger docs: http://0.0.0.0:${port}/api/docs`);
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
