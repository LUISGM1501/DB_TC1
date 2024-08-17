// src/appForTest.ts
import express from 'express';
import session from 'express-session';
import { keycloak, memoryStore } from './config/keycloak';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(session({
  secret: 'some_secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

app.use(keycloak.middleware());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
setupSwagger(app);

export default app;
