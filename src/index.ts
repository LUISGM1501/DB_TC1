import express from 'express';
import { AppDataSource } from './config/database';
import { authMiddleware } from './middleware/authMiddleware';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes'; 

const app = express();

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.use(express.json());

    app.use(authMiddleware);  // Aplica el middleware de autenticación globalmente

    // Agregar las rutas
    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);  
    app.use('/posts', postRoutes);

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch((error) => console.log(error));
