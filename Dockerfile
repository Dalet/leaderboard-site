## Build stage
FROM node:18-alpine AS build

ENV BACKEND_BASE_URL ""

RUN npm install -g pnpm

WORKDIR /app
COPY . .

RUN pnpm install
RUN pnpm build

FROM node:18-alpine

COPY --from=build /app/.output /app

RUN apk add --update caddy
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY deploy/entrypoint.sh .

# no need to change these
ENV NITRO_PORT 3000
ENV FRONT_ADDRESS localhost:$NITRO_PORT

# needs to be configured
ENV API_ADDRESS localhost:8080

HEALTHCHECK CMD wget --spider -q $FRONT_ADDRESS || exit 1
ENTRYPOINT /bin/sh entrypoint.sh
EXPOSE 80