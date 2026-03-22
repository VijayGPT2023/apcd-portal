# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing security@npc.gov.in.

**Please do not report security vulnerabilities through public GitHub issues.**

Include the following information in your report:

- Type of vulnerability
- Full path to the affected source code
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Measures

### Authentication & Authorization

- JWT-based authentication with refresh tokens
- JWT secret validation: API refuses to start in production if JWT_SECRET or JWT_REFRESH_SECRET contain placeholder values
- NODE_ENV warning: Logs warning if NODE_ENV not set (Swagger docs exposed)
- Role-based access control (RBAC)
- Password hashing using bcrypt (cost factor 12)
- Session management with token rotation
- Password reset tokens: 1-hour expiry, single use, invalidates all refresh tokens on use
- Mobile OTP: 10-minute expiry, max 5 attempts, auto-invalidation
- Token cleanup: Daily cron removes expired RefreshTokens, PasswordResetTokens, EmailChangeTokens, MobileOtps

### Data Protection

- All sensitive data encrypted at rest
- HTTPS enforced in production
- SQL injection prevention via Prisma ORM
- XSS protection via input sanitization
- CSRF protection enabled

### API Security

- Rate limiting (100 requests/minute)
- Rate limiting per endpoint: login 10/min, register 5/min, forgot-password 3/min, reset-password 5/min, add-mobile 3/min, verify-mobile 5/min, submit 5/min, withdraw 3/min, payment create 5/min, file upload 20/min, admin user create 10/min
- Request size limits
- Body size limit: 1MB for JSON payloads
- Helmet.js security headers
- Content-Security-Policy: Added to Next.js frontend (script-src, style-src, img-src, connect-src, frame-src for Razorpay)
- CORS configured for specific origins
- Gzip compression: All API responses compressed
- Performance monitoring: Slow request logging (>2s)

### File Upload Security

- File type validation
- File size limits (10MB per file, 100MB total)
- Malware scanning (to be implemented)
- Secure storage with MinIO

### Infrastructure

- Non-root container execution
- Secret management via environment variables
- Network isolation via Docker networks
- Regular security updates
- Graceful shutdown: enableShutdownHooks() for clean DB/Redis disconnection
- GoI compliance: No foreign SaaS in runtime (Resend -> SMTP, Fast2SMS -> SMS_PROVIDER pattern)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Checklist for Deployment

- [ ] Change all default passwords
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up log monitoring
- [ ] Enable database encryption
- [ ] Configure backup encryption
- [ ] Review CORS settings
- [ ] Enable audit logging
- [ ] Set up intrusion detection
