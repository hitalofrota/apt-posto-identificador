FROM node:20

WORKDIR /app

# Instala as dependências
COPY package*.json ./
RUN npm install

# Copia o schema e gera o client ESPECÍFICO para o Linux do container
COPY prisma ./prisma/
RUN npx prisma generate

# Copia o resto do código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]