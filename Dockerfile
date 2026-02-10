# Single-stage build - avoids pnpm symlink issues with multi-stage COPY
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy package files first (cache layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Generate Prisma client
RUN pnpm --filter @apcd/database db:generate

# Build packages
RUN pnpm --filter @apcd/shared build
RUN pnpm --filter @apcd/api build

# Expose port
EXPOSE 4000

# Set environment
ENV NODE_ENV=production
ENV PORT=4000

# Start the API
CMD ["node", "apps/api/dist/main.js"]
