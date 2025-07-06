# syntax=docker/dockerfile:1.5

################ 1. deps (npm backend  +  pnpm frontend) ################
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /workspace

COPY package*.json           ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

################ 2. backend build #######################
FROM deps AS backend-build
WORKDIR /workspace
COPY src/ ./src
COPY tsconfig*.json ./
RUN npm run build

################ 3. tests #######################
FROM backend-build AS e2e-tests
WORKDIR /workspace
COPY test/ ./test
RUN npm test

################ 4. runtime ################################################
FROM alpine:3.19
RUN apk add --no-cache nodejs tini \
    && adduser -D -h /home/node node

WORKDIR /home/node
USER node
COPY --from=e2e-tests /workspace/dist ./app
COPY --from=e2e-tests /workspace/node_modules ./node_modules
COPY --from=e2e-tests /workspace/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["/sbin/tini","--"]
CMD ["node","app/main.js"]