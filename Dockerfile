FROM node:20-slim AS builder
WORKDIR /app

# Install pnpm and build dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm fetch --prod || true
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy rest of the sources and build
COPY . .
RUN pnpm build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Copy built files and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./ || true

EXPOSE 3000
CMD ["pnpm","start"]
