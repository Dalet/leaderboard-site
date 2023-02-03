#!/bin/sh
caddy start --config /etc/caddy/Caddyfile
PORT=$NITRO_PORT node /app/server/index.mjs
