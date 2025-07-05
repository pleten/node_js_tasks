# syntax=docker/dockerfile:1.5

################ 1. deps (npm backend  +  pnpm frontend) ################
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /workspace

COPY package*.json           ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

################ 2. backend build (esbuild bundle) #######################
FROM deps AS backend-build
WORKDIR /workspace
COPY src/ ./src
COPY build.js ./
RUN node build.js

################ 3. runtime ################################################
FROM alpine:3.19
RUN apk add --no-cache nodejs tini \
    && adduser -D -h /home/node node

WORKDIR /home/node
USER node
COPY --from=backend-build /workspace/dist/server.mjs ./server.mjs
COPY --from=backend-build /workspace/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["/sbin/tini","--"]
CMD ["node","server.mjs"]