FROM node:20-bullseye-slim AS base

RUN apt-get update && apt-get install -y redis-server && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY scripts ./scripts/

ENV NODE_ENV=production

USER node
CMD sh -c "redis-server --daemonize yes && sleep 1 && node scripts/cron-monthly-cleanup.mjs"
