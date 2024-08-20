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

  it('Registrar usuario en la base de datos', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test@1234',
        role: 'Reader',
      });
  
    console.log("Usuario registrado para la prueba:", response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');
  
    userId = response.body.id;
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
          email: 'luisgerardourbsalz@gmail.com',
          password: 'lurbina',
          role: 'Admin',  // Asegúrate de que el rol sea 'Admin'
      });

    console.log("Admin registrado para la prueba:", response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');

    // Verificación del rol Admin
    const createdUser = await AppDataSource.getRepository(User).findOne({ where: { email: 'luisgerardourbsalz@gmail.com' } });
    console.log("Role del usuario creado:", createdUser?.role);
    expect(createdUser?.role).toBe('Admin');
  });

  it('Verificar el acceso por rol a funciones de update del admin', async () => {
    // Durante el inicio de sesión del admin
console.log("Attempting to log in admin user:", { email: 'luisgerardourbsalz@gmail.com', password: 'lurbina' });

// Revisar si el email se encuentra en la base de datos exactamente como debería
const adminLoginResponse = await request(app)
  .post('/auth/login')
  .send({
    email: 'luisgerardourbsalz@gmail.com',
    password: 'lurbina',
  });

console.log("Admin Login Response Body:", adminLoginResponse.body);
console.log("Admin Login Status:", adminLoginResponse.status);

  
    console.log("Admin Login Response Body:", adminLoginResponse.body);
    expect(adminLoginResponse.status).toBe(200);
  
    const adminToken = adminLoginResponse.body.token;
    console.log("Admin Token:", adminToken);
  
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
    // Durante el inicio de sesión del admin
    console.log("Attempting to log in admin user:", { email: 'luisgerardourbsalz@gmail.com', password: 'lurbina' });

    // Revisar si el email se encuentra en la base de datos exactamente como debería
    const adminLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'luisgerardourbsalz@gmail.com',
        password: 'lurbina',
      });

    console.log("Admin Login Response Body:", adminLoginResponse.body);
    console.log("Admin Login Status:", adminLoginResponse.status);

  
    console.log("Admin Login Response Body:", adminLoginResponse.body);
    expect(adminLoginResponse.status).toBe(200);
  
    const adminToken = adminLoginResponse.body.token;
    console.log("Admin Token:", adminToken);
  
    const protectedResponse = await request(app)
      .delete(`/users/user/${userId}`)
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
