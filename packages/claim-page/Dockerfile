FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm i
COPY . .
RUN pnpm build

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
