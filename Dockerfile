# Single-stage build for pnpm workspace compatibility
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy package files first (cache layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Generate Prisma client
RUN pnpm --filter @apcd/database db:generate

# Build packages in order
RUN pnpm --filter @apcd/database build
RUN pnpm --filter @apcd/shared build
RUN pnpm --filter @apcd/api build
RUN pnpm --filter @apcd/web build

# Copy static files into standalone output (required for Next.js standalone mode)
RUN cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static || true
RUN cp -r apps/web/public apps/web/.next/standalone/apps/web/public || true

# Fix line endings for shell scripts and make executable
RUN find scripts -name '*.sh' -exec sed -i 's/\r$//' {} \; -exec chmod +x {} \;

# Expose port
EXPOSE 4000

# Set environment
ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME=0.0.0.0

# Start the API with error capture
CMD ["sh", "-c", "echo '=== Container starting ===' && echo \"Node: $(node --version)\" && echo \"PWD: $(pwd)\" && echo \"Main exists: $(test -f apps/api/dist/main.js && echo YES || echo NO)\" && node apps/api/dist/main.js 2>&1"]
