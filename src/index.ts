import express from 'express';
import session from 'express-session';
import { AppDataSource } from './config/database';
import { keycloak, memoryStore } from './config/keycloak';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import { setupSwagger } from './config/swagger';

const app = express();

// Configurar la sesión
app.use(session({
  secret: 'some_secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

// Middleware de Keycloak
app.use(keycloak.middleware());

app.use(express.json());

// Configuración de las rutas
app.use('/auth', authRoutes);
app.use('/users', keycloak.protect(), userRoutes); // Protegiendo las rutas de usuario con Keycloak
app.use('/posts', keycloak.protect(), postRoutes);

// Configuración de Swagger
setupSwagger(app);

// Inicializar la base de datos
AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
      console.log('API Docs available at http://localhost:3000/api-docs');
    });
  })
  .catch((error) => console.log(error));
