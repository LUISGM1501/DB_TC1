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
  // Elimina primero las entradas en la tabla 'post'
  await AppDataSource.getRepository(Post).delete({});
  
  // Luego, elimina las entradas en la tabla 'user'
  await AppDataSource.getRepository(User).delete({});
  
  console.log('Base de datos limpia antes de cada prueba.');
});

describe('Authentication and Authorization Integration Tests', () => {

  it('Registrar usuario admin en la base de datos', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
          username: 'adminuser',
          email: 'adminuser@example.com', // Cambiado el correo electrónico
          password: 'lurbina',
          role: 'Admin',
      });
  
    console.log("Admin registrado para la prueba:", response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  
    // Añadir un pequeño retraso para permitir que la base de datos procese la transacción
    await new Promise(resolve => setTimeout(resolve, 500)); // Espera de 500ms
  
    // Verificación del rol Admin
    const createdUser = await AppDataSource.getRepository(User).findOne({ where: { email: 'adminuser@example.com' } });
    console.log("Role del usuario creado:", createdUser?.role);
    expect(createdUser?.role).toBe('Admin');
  });

  it('Crear e iniciar sesión con el mismo usuario y verificar su token', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test@1234',
        role: 'Reader',
      });
  
    // Consulta manual para verificar que el usuario esté en la base de datos
    const registeredUser = await AppDataSource.getRepository(User).findOne({ where: { email: 'testuser@example.com' } });
    console.log("Usuario registrado encontrado en la base de datos:", registeredUser);
  
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Test@1234',
      });
  
    console.log("Response Body:", loginResponse.body);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
  });
  

  it('Registrar usuario admin en la base de datos', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
          username: 'adminuser',
          email: 'adminuser@example.com', // Cambiado el correo electrónico
          password: 'lurbina',
          role: 'Admin',
      });

    console.log("Admin registrado para la prueba:", response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');

    // Añadir un pequeño retraso para permitir que la base de datos procese la transacción
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verificación del rol Admin
    const createdUser = await AppDataSource.getRepository(User).findOne({ where: { email: 'adminuser@example.com' } });
    console.log("Role del usuario creado:", createdUser?.role);
    expect(createdUser?.role).toBe('Admin');
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

    if (!adminUser || !adminUser.id) {
      throw new Error('El usuario admin no fue creado correctamente.');
    }

    userId = adminUser.id;  // Asigna el userId correctamente

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
  
    console.log("Protected Response Body (Update):", protectedResponse.body);
    expect(protectedResponse.status).toBe(200);
  });

  it('Verificar el acceso por rol a funciones de eliminar del admin', async () => {
    // Registrar el usuario admin al inicio de la prueba
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        username: 'adminuser',
        email: 'adminuser@example.com',
        password: 'lurbina',
        role: 'Admin',
      });

    // Verificar si el usuario admin existe en la base de datos antes del login
    const adminUser = await AppDataSource.getRepository(User).findOne({ where: { email: 'adminuser@example.com' } });
    console.log("Admin User en base de datos:", adminUser);

    if (!adminUser) {
      throw new Error('El usuario admin no fue encontrado en la base de datos antes del intento de login.');
    }

    userId = adminUser.id;  // Aseguramos que `userId` esté asignado

    // Intentar iniciar sesión con el usuario admin
    console.log("Attempting to log in admin user:", { email: 'adminuser@example.com', password: 'lurbina' });

    const adminLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'adminuser@example.com',
        password: 'lurbina',
      });

    console.log("Admin Login Response Body:", adminLoginResponse.body);
    console.log("Admin Login Status:", adminLoginResponse.status);
    expect(adminLoginResponse.status).toBe(200);
  
    const adminToken = adminLoginResponse.body.token;
    console.log("Admin Token:", adminToken);
  
    const protectedResponse = await request(app)
      .delete(`/users/user/${userId}`)  // Usar el `userId` asegurado
      .set('Authorization', `Bearer ${adminToken}`);
  
    console.log("Protected Response Body (Delete):", protectedResponse.body);
    expect(protectedResponse.status).toBe(204);
  });


  it('Denegar acceso a funciones si el usuario no tiene el rol solicitado', async () => {
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        username: 'readeruser',
        email: 'readeruser@example.com',
        password: 'Test@1234',
        role: 'Reader',
      });

    console.log("Response Body:", registerResponse.body);
    
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
