import request from 'supertest';
import { AppDataSource } from '../src/config/database';
import { User } from '../src/models/User';
import app from '../src/appTest';

let userId: number; 

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {

  await AppDataSource.getRepository(User).clear();
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

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');

    userId = response.body.id;
  });

  it('Crear e iniciar sesión con el mismo usaurio y verificar su token', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test@1234',
        role: 'Admin',
      });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Test@1234',
      });

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
