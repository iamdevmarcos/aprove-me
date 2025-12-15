FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

ARG DATABASE_URL=file:./dev.db
ENV DATABASE_URL=${DATABASE_URL}

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build || (echo "Build failed!" && exit 1)
RUN test -f dist/src/main.js || (echo "main.js not found in dist/src!" && ls -la dist/ && exit 1)

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3003

CMD sh -c "npx prisma migrate deploy && node dist/src/main.js"

