FROM node:18-alpine as builder

RUN npm i -g pnpm@latest

WORKDIR /app

# Copy over files required by pnpm install
COPY pnpm-lock.yaml ./

# Install dependencies - Install inside container ensures parity on all machines
RUN pnpm fetch

# Copy everything over from the source directory to the build directory
COPY . .
RUN pnpm install --offline
RUN pnpm build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist/index.js .

EXPOSE 5000
CMD [ "node", "index.js" ]
