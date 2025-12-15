FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

ARG DATABASE_URL=file:./dev.db
ENV DATABASE_URL=${DATABASE_URL}

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN mkdir -p /app/migrations-backup && cp -r prisma/migrations /app/migrations-backup/ 2>/dev/null || true

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/migrations-backup ./migrations-backup

EXPOSE 3004

CMD sh -c "if [ ! -d /app/prisma/migrations ] && [ -d /app/migrations-backup/migrations ]; then cp -r /app/migrations-backup/migrations /app/prisma/migrations; fi && npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/main.js"
