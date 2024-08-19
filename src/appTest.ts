// src/appForTest.ts
import express from 'express';
import session from 'express-session';
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
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Configuración de Swagger
setupSwagger(app);

export default app;
