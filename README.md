# APCD OEM Empanelment Portal

Air Pollution Control Devices (APCD) OEM Empanelment Portal developed by National Productivity Council (NPC) for Central Pollution Control Board (CPCB).

This portal facilitates the empanelment of Original Equipment Manufacturers (OEMs) of Air Pollution Control Devices for industrial units in Delhi-NCR region. The system handles the complete workflow from application submission to certificate issuance.

---

## Test Accounts (Handover)

All seeded accounts use these credentials on the staging environment.

| Role           | Email                         | Password            |
| -------------- | ----------------------------- | ------------------- |
| Super Admin    | admin@npcindia.gov.in         | Admin@APCD2025!     |
| Admin (Head)   | head@npcindia.gov.in          | Head@APCD2025!      |
| Officer        | officer@npcindia.gov.in       | Officer@APCD2025!   |
| Committee      | committee@npcindia.gov.in     | Committee@APCD2025! |
| Field Verifier | fieldverifier@npcindia.gov.in | Field@APCD2025!     |
| Dealing Hand   | dealinghand@npcindia.gov.in   | Dealing@APCD2025!   |
| OEM            | oem@testcompany.com           | Oem@APCD2025!       |

> These accounts are created by `pnpm db:seed`. Never use these credentials in production -- run the seed only in development/staging.

---

## Tech Stack

| Layer          | Technology                                                             |
| -------------- | ---------------------------------------------------------------------- |
| Frontend       | Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui             |
| Backend        | NestJS 10, Node.js 20                                                  |
| Database       | PostgreSQL 15 with Prisma ORM                                          |
| Object Storage | MinIO (S3-compatible) for NICSI VM; Railway Volume for staging         |
| Cache          | Redis 7 (rate limiting, APCD type caching)                             |
| Auth           | JWT with refresh tokens, bcryptjs                                      |
| Payments       | Razorpay (online) + NEFT/RTGS (manual)                                 |
| Email          | Nodemailer / SMTP (GoI-compliant, no foreign SaaS)                     |
| SMS            | Switchable provider via `SMS_PROVIDER` env var (`msg91` or `fast2sms`) |
| i18n           | Hindi/English bilingual (language switcher, `useTranslation` hook)     |
| Monorepo       | Turborepo with pnpm                                                    |

---

## Project Structure

```
apcd-portal/
├── apps/
│   ├── api/                 # NestJS backend (port 4000)
│   │   ├── Dockerfile
│   │   └── src/
│   │       ├── modules/     # Feature modules
│   │       ├── infrastructure/
│   │       └── common/      # Guards, decorators, filters, interceptors
│   └── web/                 # Next.js frontend (port 3000)
│       ├── Dockerfile
│       └── src/
│           ├── app/         # App Router pages
│           ├── components/  # React components
│           ├── lib/         # Utilities, hooks
│           └── i18n/        # en.json, hi.json translation files
├── packages/
│   ├── database/            # Prisma schema, migrations, seed
│   ├── shared/              # Shared types, constants, Zod validators
│   └── eslint-config/       # Shared ESLint rules
├── e2e/                     # Playwright E2E tests (by role journey)
├── Dockerfile               # Root multi-stage Dockerfile
├── docker-compose.yml       # Development environment
└── .github/workflows/       # CI/CD pipelines
```

---

## User Roles

| Role               | Responsibility                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **OEM**            | Submits empanelment applications, uploads documents, pays fees, responds to queries       |
| **Officer**        | Reviews submitted applications, verifies documents, raises queries, forwards to committee |
| **Committee**      | Evaluates applications on 8 criteria (100 marks, 60 passing threshold)                    |
| **Field Verifier** | Conducts on-site inspections at 3 installation sites per application                      |
| **Dealing Hand**   | Manages lab testing bills, verifies manual NEFT/RTGS payments                             |
| **Admin**          | Manages APCD master data, fee configuration, certificates, system reports                 |
| **Super Admin**    | Full system administration including user management                                      |

---

## Features

### Core Workflow

- Multi-step application form with 26 fields
- 26 document types with geo-tagged photo validation (GPS EXIF within India bounds)
- Razorpay + NEFT/RTGS payment support with webhook verification
- 8-criteria committee evaluation (100 marks, 60 passing)
- On-site field verification at 3 installation sites
- QR-coded empanelment certificates with public verification
- 15% discount for MSE/Startup/Local Suppliers

### Authentication and User Management

- Forgot password / reset password flow (`POST /auth/forgot-password`, `POST /auth/reset-password`)
- Change password (`POST /auth/change-password`)
- Change email with verification (`POST /auth/change-email`, `GET /auth/confirm-email-change`)
- Mobile number with OTP verification (`POST /users/add-mobile`, `POST /users/verify-mobile`)
- User profile API (`GET /users/profile`, `PATCH /users/profile` with photo upload)

### Internationalization

- Hindi/English bilingual support with language switcher
- `useTranslation` hook with `en.json` and `hi.json` translation files

### Scheduled Tasks

- Daily certificate expiry reminders (8:00 AM)
- Token cleanup (2:00 AM)

### Payments

- Razorpay online payments with webhook (`POST /payments/razorpay/webhook`)
- Manual NEFT/RTGS with officer verification

### Reporting

- CSV export for audit reports
- Dashboard analytics per role

### GoI / GIGW Compliance

- Privacy Policy and Terms of Use pages
- Sitemap for GIGW compliance
- No foreign SaaS dependencies in runtime code
- Email via SMTP/Nodemailer (not Resend or other foreign services)
- SMS via GoI-approved providers (MSG91 / Fast2SMS)
- All config via env vars -- zero code changes between Railway staging and NICSI VM production

---

## Security Hardening

| Feature                 | Details                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| JWT secret validation   | Rejects placeholder secrets at startup in production                   |
| NODE_ENV warning        | Logs warning if `NODE_ENV` is not explicitly set                       |
| Content-Security-Policy | Configured on the Next.js frontend                                     |
| Gzip compression        | Enabled on API responses                                               |
| Body size limit         | 1 MB JSON body size limit                                              |
| Performance logging     | Logs slow requests exceeding 2 seconds                                 |
| Graceful shutdown       | Shutdown hooks for clean connection teardown                           |
| API response caching    | APCD types cached with 5-minute TTL                                    |
| Password policy         | 8+ chars, uppercase, lowercase, number, special char, bcryptjs salt=12 |

### Per-Endpoint Rate Limiting

| Endpoint           | Limit           |
| ------------------ | --------------- |
| Login              | 10 requests/min |
| Register           | 5 requests/min  |
| Forgot password    | 3 requests/min  |
| Application submit | 5 requests/min  |
| File upload        | 20 requests/min |

---

## Fee Structure

| Fee Type                   | Amount    | GST (18%) | Total     |
| -------------------------- | --------- | --------- | --------- |
| Application Fee            | Rs 25,000 | Rs 4,500  | Rs 29,500 |
| Empanelment Fee (per APCD) | Rs 65,000 | Rs 11,700 | Rs 76,700 |
| Field Verification         | Rs 57,000 | Rs 10,260 | Rs 67,260 |
| Renewal                    | Rs 35,000 | Rs 6,300  | Rs 41,300 |

_15% discount applicable for MSE, DPIIT Startups, and Class-I/II Local Suppliers_

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker and Docker Compose

### Development Setup

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd apcd-portal
pnpm install
```

2. Copy environment file:

```bash
cp .env.example .env
# Fill in required values (see .env.example for documentation)
```

3. Start development services:

```bash
docker-compose up -d postgres minio redis
```

4. Setup database:

```bash
pnpm db:generate
pnpm --filter @apcd/database db:push
pnpm db:seed
```

5. Start development servers:

```bash
pnpm dev
```

Access:

- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Docs (Swagger): http://localhost:4000/api/docs
- MinIO Console: http://localhost:9001

### Docker Development

Run everything in Docker:

```bash
docker-compose up --build
```

---

## Deployment

### Railway (Current Staging)

| Service | URL                                             |
| ------- | ----------------------------------------------- |
| API     | https://apcd-api-production-415f.up.railway.app |
| Web     | https://npc-apcd-portal.up.railway.app          |

Railway services: API + Web + PostgreSQL + Redis + Volume (for file storage).

### Docker Images

- `apps/api/Dockerfile` -- API service
- `apps/web/Dockerfile` -- Web frontend
- `Dockerfile` (root) -- Multi-stage build

### NICSI VM Production

The application is designed for deployment on NICSI VM with:

- MinIO for S3-compatible object storage
- SMTP for email (GoI mail servers)
- MSG91 for SMS OTP
- Grafana + Prometheus + Loki for monitoring

All configuration is via environment variables. Zero code changes are needed between Railway staging and NICSI VM production.

---

## Environment Variables

Copy `.env.example` to `.env`. See `.env.example` for full documentation of every variable.

Key variables:

```env
# Required
NODE_ENV=development
DATABASE_URL=postgresql://apcd:password@localhost:5432/apcd_portal
JWT_SECRET=<min 64 chars in production>
JWT_REFRESH_SECRET=<min 64 chars in production>
MINIO_ENDPOINT=localhost
MINIO_ACCESS_KEY=minio_admin
MINIO_SECRET_KEY=minio_password
APP_URL=http://localhost:3000
API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<min 32 chars>

# Payments
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# SMS (set SMS_PROVIDER to "msg91" or "fast2sms")
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=...
MSG91_TEMPLATE_ID=...

# Email
SMTP_ENABLED=true
SMTP_HOST=mail.example.com
SMTP_USER=...
SMTP_PASS=...
```

---

## API Endpoints

Full API documentation is available via Swagger UI at `/api/docs` when running the API server.

### Key Endpoints

| Method | Endpoint                            | Description                            |
| ------ | ----------------------------------- | -------------------------------------- |
| POST   | /api/v1/auth/login                  | User login                             |
| POST   | /api/v1/auth/register               | OEM registration                       |
| POST   | /api/v1/auth/forgot-password        | Request password reset email           |
| POST   | /api/v1/auth/reset-password         | Reset password with token              |
| POST   | /api/v1/auth/change-password        | Change password (authenticated)        |
| POST   | /api/v1/auth/change-email           | Request email change with verification |
| GET    | /api/v1/auth/confirm-email-change   | Confirm email change via link          |
| GET    | /api/v1/users/profile               | Get user profile                       |
| PATCH  | /api/v1/users/profile               | Update profile (with photo upload)     |
| POST   | /api/v1/users/add-mobile            | Add mobile number                      |
| POST   | /api/v1/users/verify-mobile         | Verify mobile via OTP                  |
| GET    | /api/v1/applications                | List applications                      |
| POST   | /api/v1/applications                | Create application                     |
| POST   | /api/v1/payments/razorpay/webhook   | Razorpay payment webhook               |
| GET    | /api/v1/certificates/verify/:number | Public certificate verification        |

---

## Scripts

```bash
# Development
pnpm dev                  # Start all apps in dev mode
pnpm build                # Build all packages and apps
pnpm lint                 # Run ESLint
pnpm type-check           # TypeScript type checking

# Database
pnpm db:generate                                  # Generate Prisma client
pnpm --filter @apcd/database db:push              # Push schema changes
pnpm --filter @apcd/database db:seed              # Seed database
pnpm --filter @apcd/database db:studio            # Open Prisma Studio
pnpm --filter @apcd/database db:migrate -- --name <desc>  # Create migration

# Testing
pnpm test                 # Run all unit tests
pnpm --filter @apcd/api test        # API unit tests only
pnpm --filter @apcd/web test        # Web unit tests only
pnpm --filter @apcd/api test:e2e    # API integration tests
pnpm test:e2e             # Playwright E2E tests
pnpm test:roles           # Role-based integration tests (against running API)
```

---

## Testing

| Type              | Tool             | Count                           | Location                             |
| ----------------- | ---------------- | ------------------------------- | ------------------------------------ |
| Unit tests        | Jest + Vitest    | 1,280+                          | Co-located with source (`*.spec.ts`) |
| E2E tests         | Playwright       | 87                              | `e2e/` (organized by role journey)   |
| Load tests        | k6               | 1 script (100 concurrent users) | Root or test directory               |
| Integration tests | Jest + Supertest | --                              | `apps/api/test/integration/`         |

### CI/CD Pipeline (GitHub Actions)

The CI pipeline runs: **lint** -> **type-check** -> **test** -> **build** -> **security scan**

### Running E2E Tests

E2E tests must run against a production build (not dev mode):

```bash
pnpm --filter @apcd/web build
pnpm --filter @apcd/web start &
pnpm test:e2e
```

E2E tests are organized by user role journey:

- `oem-journey.spec.ts` -- OEM: register, apply, track
- `officer-journey.spec.ts` -- Officer: review, query, forward
- `committee-journey.spec.ts` -- Committee: evaluate, score, submit
- `field-verifier-journey.spec.ts` -- Field verifier: inspect, report
- `dealing-hand-journey.spec.ts` -- Dealing hand: verify payments
- `admin-journey.spec.ts` -- Admin: manage users, config
- `certificate-verification.spec.ts` -- Public certificate verification

---

## Security

See [SECURITY.md](SECURITY.md) for security policies and guidelines.

---

## License

Proprietary -- National Productivity Council

## Support

For technical support, contact: support@npc.gov.in
