import request from 'supertest';
import { AppDataSource } from '../src/config/database';
import { User } from '../src/models/User';
import { Post } from '../src/models/Post';
import app from '../src/appTest';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

let userId: string;

beforeAll(async () => {
  // Inicializa la conexión a la base de datos antes de las pruebas
  try {
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("Error al inicializar la conexión a la base de datos:", error);
    throw error;
  }
});

afterAll(async () => {
  // Cierra la conexión a la base de datos después de las pruebas
  await AppDataSource.destroy();
});

beforeEach(async () => {
  // Limpia la base de datos antes de cada prueba
  await AppDataSource.getRepository(Post).delete({});
  await AppDataSource.getRepository(User).delete({});
  console.log('Base de datos limpia antes de cada prueba.');
});

describe('Authentication and Authorization Integration Tests', () => {

  it('Registrar usuario admin en la base de datos', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
          username: 'adminuser',
          email: 'adminuser@example.com',
          password: 'lurbina',
          role: 'Admin',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');

    // Verifica el rol del usuario creado
    const createdUser = await AppDataSource.getRepository(User).findOne({ where: { email: 'adminuser@example.com' } });
    expect(createdUser?.role).toBe('Admin');
  });

  it('Crear e iniciar sesión con el mismo usuario y verificar su token', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test@1234',
        role: 'Reader',
      });

    // Verifica que el usuario esté en la base de datos
    const registeredUser = await AppDataSource.getRepository(User).findOne({ where: { email: 'testuser@example.com' } });
    
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Test@1234',
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
  });

  it('Verificar el acceso por rol a funciones de update del admin', async () => {
    // Registrar el usuario admin al inicio de la prueba
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        username: 'adminuser',
        email: 'adminuser@example.com',
        password: 'lurbina',
        role: 'Admin',
      });

    const adminUser = registerResponse.body;

    userId = adminUser.id;

    // Intentar iniciar sesión con el usuario admin
    const adminLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'adminuser@example.com',
        password: 'lurbina',
      });

    const adminToken = adminLoginResponse.body.token;

    const protectedResponse = await request(app)
      .put(`/users/user/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'updatedUsername',
        email: 'updatedemail@example.com',
      });

    expect(protectedResponse.status).toBe(200);
  });

  it('Verificar el acceso por rol a funciones de eliminar del admin', async () => {
    // Registrar el usuario admin al inicio de la prueba
    await request(app)
      .post('/auth/register')
      .send({
        username: 'adminuser',
        email: 'adminuser@example.com',
        password: 'lurbina',
        role: 'Admin',
      });

    const adminUser = await AppDataSource.getRepository(User).findOne({ where: { email: 'adminuser@example.com' } });

    userId = adminUser!.id;

    // Intentar iniciar sesión con el usuario admin
    const adminLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'adminuser@example.com',
        password: 'lurbina',
      });

    expect(adminLoginResponse.status).toBe(200);
  
    const adminToken = adminLoginResponse.body.token;
  
    const protectedResponse = await request(app)
      .delete(`/users/user/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
  
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

    expect(protectedResponse.status).toBe(403);
  });
});
