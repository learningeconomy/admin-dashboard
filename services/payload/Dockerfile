FROM node:18.8-alpine as base

FROM base as builder

WORKDIR /home/node/app

COPY . .

RUN npm i -g pnpm
RUN pnpm i

RUN pnpm build

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

WORKDIR /home/node/app
COPY package.json ./

RUN npm i -g pnpm
RUN pnpm i --production

COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

CMD ["node", "dist/server.js"]
