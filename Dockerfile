FROM node:22-bullseye-slim AS base
RUN apt-get update && apt-get install -y openssl

FROM base AS deps
WORKDIR /myapp
COPY package.json package-lock.json ./
RUN npm install --include=dev --ignore-scripts

FROM base AS production-deps
WORKDIR /myapp
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM base AS build
WORKDIR /myapp
COPY --from=deps /myapp/node_modules ./node_modules
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

FROM base
WORKDIR /myapp
COPY --from=production-deps --chown=node:node /myapp/node_modules ./node_modules
COPY --from=build --chown=node:node /myapp/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=node:node /myapp/build ./build
COPY --from=build --chown=node:node /myapp/public ./public
COPY --from=build --chown=node:node /myapp/package.json ./package.json
COPY --from=build --chown=node:node /myapp/start.sh ./start.sh
COPY --from=build --chown=node:node /myapp/prisma ./prisma
COPY --from=build --chown=node:node /myapp/scripts ./scripts
ENV PORT="3000"
ENV NODE_ENV=production
EXPOSE 3000
RUN mkdir -p /data && chown -R node:node /data
USER node
ENTRYPOINT ["./start.sh"]
