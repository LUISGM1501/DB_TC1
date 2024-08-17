# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Instala TypeScript globalmente
RUN npm install -g typescript

# Asegúrate de que node_modules/.bin esté en el PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copia el resto del código fuente
COPY . .

# Copia el archivo keycloak.json al directorio raíz del contenedor
COPY keycloak.json /usr/src/app/keycloak.json

# Compila el código TypeScript
# Ejecuta la compilación
RUN npm run build

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando por defecto al iniciar el contenedor
CMD ["npm", "start"]