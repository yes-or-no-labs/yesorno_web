# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build:dev

# Stage 2: Serve static files
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./nginx/dev-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

