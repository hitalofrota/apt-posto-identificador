# Estágio de Build
FROM node:20 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de Produção
FROM nginx:stable-alpine AS production-stage
# Copia o arquivo de configuração que criamos acima
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copia os arquivos estáticos
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]