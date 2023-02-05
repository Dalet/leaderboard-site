## Build stage
FROM node:18-alpine AS build

# e.g "https://api.leaderboards.gg:4040", or empty for the current domain
ARG BACKEND_BASE_URL ""

RUN npm install -g pnpm

WORKDIR /app
COPY . .

RUN pnpm install

RUN echo "Building with BACKEND_BASE_URL=$BACKEND_BASE_URL}"
RUN pnpm build

FROM node:18-alpine

COPY --from=build /app/.output /app

# no need to change this
ENV NITRO_PORT 3000

HEALTHCHECK CMD wget --spider -q $FRONT_ADDRESS || exit 1
CMD PORT=$NITRO_PORT node /app/server/index.mjs
EXPOSE 3000