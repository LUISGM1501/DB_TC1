import express from 'express';
import { AppDataSource } from './config/database';
import authRoutes from './routes/authRoutes';
import 'reflect-metadata';

const app = express();

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.use(express.json());
    app.use('/auth', authRoutes);

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch((error) => console.log(error));
