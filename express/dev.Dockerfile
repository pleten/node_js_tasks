################# 1. deps (npm + pnpm) #################################
FROM node:20-alpine AS deps
WORKDIR /workspace
RUN corepack enable

# копіюємо lock-файли
COPY /package*.json ./

RUN --mount=type=cache,target=/root/.npm  \
    npm ci

################# 3. backend prune (залишаємо prod-deps) ##############
FROM node:20-alpine AS backend
WORKDIR /workspace/



################# 4. runtime (tiny) ###################################
FROM node:20-alpine
RUN apk add --no-cache nodejs tini
WORKDIR /app

COPY --from=deps /workspace/node_modules ./node_modules
COPY src/ ./src
COPY /package.json ./


ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm","run", "dev"]