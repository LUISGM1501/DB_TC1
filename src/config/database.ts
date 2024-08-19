import { DataSource } from 'typeorm';
import { User } from '../models/User';  // Asegúrate de importar todas tus entidades
import { Post } from '../models/Post';  // Importa otras entidades que necesites

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,  
  port: parseInt(process.env.DB_PORT as string),  
  username: process.env.DB_USERNAME as string, 
  password: process.env.DB_PASSWORD as string, 
  database: process.env.DB_NAME as string,  
  entities: [User, Post],  // Incluye todas tus entidades aquí
  synchronize: true, 
});
