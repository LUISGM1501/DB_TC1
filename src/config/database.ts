import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'database',  
  port: parseInt(process.env.DB_PORT || '5432', 10),  
  username: process.env.DB_USERNAME || 'user', 
  password: process.env.DB_PASSWORD || 'password', 
  database: process.env.DB_NAME || 'DB_TC1',  
  entities: [__dirname + '/../models/*.ts'], 
  synchronize: true, 
});
