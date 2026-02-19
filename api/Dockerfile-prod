FROM node:20-slim

WORKDIR /app
RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

CMD npx prisma migrate deploy && node server.js