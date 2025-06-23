FROM node:20-alpine AS builder

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN npm install -g pnpm@8.8.0 && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/src/main"]
