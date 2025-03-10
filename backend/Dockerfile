# Usar la imagen oficial de Node.js
FROM node:18-alpine

# Instalar dependencias necesarias para compilar bcrypt y pg
RUN apk add --no-cache make gcc g++ python3 postgresql-dev

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias incluyendo las de desarrollo
RUN npm ci
RUN npm install pg --save
RUN npm rebuild bcrypt --build-from-source

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación en modo desarrollo con hot-reload
CMD ["npm", "run", "start:dev"] 