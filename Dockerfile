FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG DATABASE_URL
ARG SITEPING_API_KEY
ARG SITEPING_ORIGINS
ENV DATABASE_URL=$DATABASE_URL
ENV SITEPING_API_KEY=$SITEPING_API_KEY
ENV SITEPING_ORIGINS=$SITEPING_ORIGINS
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx @siteping/cli sync --schema prisma/schema.prisma && npx prisma generate && npx next build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npx next start -H 0.0.0.0 -p 3000"]
