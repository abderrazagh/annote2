FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package.json ./
RUN npm install
COPY . .
RUN npx @siteping/cli sync --schema prisma/schema.prisma && npx prisma generate && npx next build
ENV NODE_ENV=production
ENV DATABASE_URL=file:/data/siteping.db
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npx next start -H 0.0.0.0 -p 3000"]
