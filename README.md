# Tarea Corta 1 - Base de Datos 2

## Curso: Base de Datos 2  
## Profesor: Kenneth Obando Rodríguez

## Integrantes: 
- Luis Gerardo Urbina Salazar
- Andres Mora Urbina

---

## Despliegue de Aplicaciones con Docker y PostgreSQL

### Descripción

Esta tarea tiene como objetivo familiarizar a los estudiantes con las prácticas de contenedorización y orquestación de aplicaciones mediante Docker y Docker Compose. El proyecto se centra en el desarrollo de una aplicación REST API integrada con una base de datos PostgreSQL, abordando aspectos clave como la automatización, la reproducibilidad y la escalabilidad de las aplicaciones modernas.

---

## Funcionalidades Implementadas

### 1. **Autenticación:**
   - **JWT (JSON Web Tokens):** Implementación de un sistema de autenticación robusto basado en tokens JWT para garantizar la seguridad de las operaciones dentro de la API.
   - **Keycloak:** Uso de Keycloak como servicio de autenticación, desplegado en un contenedor Docker para manejar la autenticación y la gestión de usuarios.

### 2. **Creación y Administración de Usuarios:**
   - **Registro de Usuarios:** Permite el registro de nuevos usuarios con validaciones estrictas para evitar duplicidad de correos electrónicos.
   - **Actualización y Eliminación de Usuarios:** Funcionalidades completas para la administración de usuarios, incluyendo la actualización de datos y la eliminación segura de registros.
   - **Validación de Datos:** Integración de validaciones exhaustivas para asegurar que los datos proporcionados cumplen con los estándares de seguridad y formato.

### 3. **Control de Acceso:**
   - **Roles de Usuario:** Implementación de tres niveles de acceso: Administrador, Editor y Lector, cada uno con permisos específicos sobre los recursos de la API.
   - **Middleware de Roles:** Uso de middleware personalizado para la verificación de roles antes de permitir el acceso a recursos sensibles.
   - **Documentación de Políticas:** Las políticas de acceso están documentadas en la API, detallando qué acciones están permitidas para cada rol de usuario.

### 4. **Publicación de Posts:**
   - **Creación y Gestión de Posts:** Permite a los usuarios crear, actualizar y eliminar posts en la base de datos PostgreSQL.
   - **Soporte para Múltiples Tipos de Contenido:** Los posts pueden incluir texto, imágenes y videos, almacenados de manera eficiente en la base de datos.

### 5. **Pruebas Unitarias y de Integración:**
   - **Cobertura Completa:** Pruebas unitarias cubren todos los casos posibles, asegurando que cada componente de la API funcione como se espera.
   - **Pruebas de Integración:** Verificación de la comunicación y funcionamiento conjunto de todos los servicios, especialmente entre la API y la base de datos PostgreSQL.
   - **Logs para Depuración:** Se integraron logs detallados en las pruebas de integración para identificar cualquier problema durante el proceso de autenticación y autorización.

---

## Herramientas Utilizadas

- **Node.js y Express:** Framework utilizado para construir la API REST.
- **TypeORM:** ORM utilizado para interactuar con la base de datos PostgreSQL.
- **PostgreSQL:** Sistema de gestión de bases de datos utilizado para almacenar la información de usuarios y posts.
- **Docker y Docker Compose:** Herramientas utilizadas para la contenedorización y orquestación de la aplicación, facilitando la implementación y escalabilidad.
- **Keycloak:** Herramienta de gestión de identidad y acceso, utilizada para manejar la autenticación y autorización en la aplicación.
- **Jest:** Framework de pruebas utilizado para realizar pruebas unitarias y de integración.
- **Bcrypt:** Biblioteca para el hash de contraseñas, garantizando la seguridad en el almacenamiento de las mismas.

---

## Documentación de la API

La documentación completa de la API está disponible y se genera automáticamente mediante Swagger. Puedes acceder a ella para consultar todos los endpoints disponibles, sus parámetros y respuestas esperadas.

- **URL de la Documentación:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Endpoints Principales

- **POST** `/auth/register`: Registra un nuevo usuario en el sistema.
- **POST** `/auth/login`: Inicia sesión en el sistema y devuelve un token JWT.
- **POST** `/posts/post`: Crea un nuevo post.
- **PUT** `/posts/post/:id`: Actualiza un post existente.
- **DELETE** `/posts/post/:id`: Elimina un post.
- **GET** `/posts`: Obtiene todos los posts.
- **GET** `/posts/:id`: Obtiene un post específico.
- **PUT** `/users/user/:id`: Actualiza un usuario existente.
- **DELETE** `/users/user/:id`: Elimina un usuario.

---

## Cómo Ejecutar la Aplicación

### Pasos para Iniciar el Proyecto

1. **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/LUISGM1501/DB_TC1
    cd DB_TC1
    ```

2. **Instalar Dependencias:**
   ```bash
   npm install

3. **Levantar la aplicacion con docker**
   ```bash
   docker-compose up --build

--- 

#### Ejecución de Pruebas

Para ejecutar las pruebas unitarias y de integración, puedes utilizar los siguientes comandos:

## Conjunto de Pruebas Unitarias

1. `npm run test:userService`: Ejecuta las pruebas unitarias para el servicio de usuarios.
2. `npm run test:authService`: Ejecuta las pruebas unitarias para el servicio de autenticación.
3. `npm run test:postService`: Ejecuta las pruebas unitarias para el servicio de publicaciones.

## Conjunto de Pruebas de Integración

4. `npm run test:authIntegration`: Ejecuta las pruebas de integración para la autenticación.
5. `npm run test:user-postIntegration`: Ejecuta las pruebas de integración para la relación entre usuarios y publicaciones.
6. `npm run test:conectionIntegration`: Ejecuta las pruebas de integración para la conexión con la base de datos.

## Todas las Pruebas

7. `npm run test`: Ejecuta todas las pruebas en secuencia.


