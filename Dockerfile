# Usa la imagen base de Node.js
FROM node:14

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencia
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .
COPY keycloak.json /usr/src/app/keycloak.json


# Compila el código TypeScript
RUN npm run build

# Expone el puerto
EXPOSE 3000

# Inicia la aplicación
CMD ["npm", "start"]
