import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,  
  port: parseInt(process.env.DB_PORT as string),  
  username: process.env.DB_USERNAME as string, 
  password: process.env.DB_PASSWORD as string, 
  database: process.env.DB_NAME as string,  
  entities: [__dirname + '/../models/*.ts'], 
  synchronize: true, 
});
