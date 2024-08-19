import request from 'supertest';
import { AppDataSource } from '../src/config/database';
import { User } from '../src/models/User';
import app from '../src/appTest';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Cargar las variables de entorno
dotenv.config();

let userId: string;

beforeAll(async () => {
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_PORT:", process.env.DB_PORT);
  console.log("DB_USERNAME:", process.env.DB_USERNAME);
  console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
  console.log("DB_NAME:", process.env.DB_NAME);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  try {
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("Error al inicializar la conexión a la base de datos:", error);
    throw error;
  }
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  await AppDataSource.getRepository(User).query('DELETE FROM "user" CASCADE;');
});

describe('Authentication and Authorization Integration Tests', () => {

  it('Registrar usuario en la base de datos', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test@1234',
        role: 'Admin',
      });

    console.log("Response Body:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');

    userId = response.body.id;
  });

  it('Crear e iniciar sesión con el mismo usuario y verificar su token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Test@1234',
      });

    console.log("Response Body:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Verificar el acceso por rol a funciones de update del admin', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Test@1234',
      });

    const token = loginResponse.body.token;

    const protectedResponse = await request(app)
      .put(`/users/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updatedUsername',
        email: 'updatedemail@example.com',
        role: 'Editor',
      });

    console.log("Protected Response Body (Update):", protectedResponse.body);

    expect(protectedResponse.status).toBe(200);
  });

  it('Verificar el acceso por rol a funciones de eliminar del admin', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Test@1234',
      });

    const token = loginResponse.body.token;

    const protectedResponse = await request(app)
      .delete(`/users/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log("Protected Response Body (Delete):", protectedResponse.body);

    expect(protectedResponse.status).toBe(204); 
  });

  it('Denegar acceso a funciones si el usuario no tiene el rol solicitado', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        username: 'readeruser',
        email: 'readeruser@example.com',
        password: 'Test@1234',
        role: 'Reader',
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'readeruser@example.com',
        password: 'Test@1234',
      });

    const token = loginResponse.body.token;

    const protectedResponse = await request(app)
      .put(`/users/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updatedUsername',
        email: 'updatedemail@example.com',
        role: 'Editor',
      });

    console.log("Protected Response Body (Access Denied):", protectedResponse.body);

    expect(protectedResponse.status).toBe(403);
  });
});
