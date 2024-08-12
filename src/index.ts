import express from 'express';
import { AppDataSource } from './config/database';
import { setupSwagger } from './config/swagger';
import { authMiddleware } from './middleware/authMiddleware';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes'; 


const app = express();

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.use(express.json());

    setupSwagger(app);  // Swagger para la documentación de apis

    app.use(authMiddleware);  // Aplica el middleware de autenticación globalmente

    // Agregar las rutas
    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);  
    app.use('/posts', postRoutes);

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
      console.log('API Docs available at http://localhost:3000/api-docs');
    });
  })
  .catch((error) => console.log(error));
