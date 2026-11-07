
# ==========================================
# Stage 1: Install dependencies
# ==========================================
FROM node:26.13.0-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


# ==========================================
# Stage 2: Run tests
# ==========================================
FROM dependencies AS test

COPY src ./src
COPY tests ./tests
COPY views ./views
COPY public ./public

RUN npm test && touch /tmp/tests-passed


# ==========================================
# Stage 3: Production dependencies
# ==========================================
FROM node:26.13.0-alpine AS production-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force


# ==========================================
# Stage 4: Production runtime
# ==========================================
FROM node:26.13.0-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production dependencies
COPY --from=production-deps --chown=node:node \
    /app/node_modules ./node_modules

# Copy application files
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node views ./views
COPY --chown=node:node public ./public

# Require successful tests
COPY --from=test /tmp/tests-passed /tmp/tests-passed

# Remove npm and npx from runtime image
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

# Run as non-root user
USER node

EXPOSE 3000

# Container health check
HEALTHCHECK --interval=30s \
    --timeout=5s \
    --start-period=10s \
    --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start application without npm
CMD ["node", "src/server.js"]
