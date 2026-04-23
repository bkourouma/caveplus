FROM node:20-bookworm-slim AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm install --ignore-scripts

FROM base AS builder

ARG NEXT_PUBLIC_SITE_URL=https://caveplus.ci
ARG NEXTAUTH_URL=https://caveplus.ci

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://caveplus.ci}" \
  && export NEXTAUTH_URL="${NEXTAUTH_URL:-$NEXT_PUBLIC_SITE_URL}" \
  && export SITE_URL="$NEXT_PUBLIC_SITE_URL" \
  && npx prisma generate \
  && npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3400

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache && chown -R node:node /app

USER node

EXPOSE 3400

CMD ["node", "server.js"]
