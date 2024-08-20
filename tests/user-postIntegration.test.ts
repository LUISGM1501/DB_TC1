import request from 'supertest';
import { AppDataSource } from '../src/config/database';
import { User } from '../src/models/User';
import { Post } from '../src/models/Post';
import app from '../src/appTest';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  // Eliminar todos los posts asociados a los usuarios primero
  await AppDataSource.getRepository(Post).delete({});
  // Luego eliminar todos los usuarios
  await AppDataSource.getRepository(User).delete({});
});


describe('Pruebas de Integración de interacción entre Usuarios y Posts', () => {

  it('Verificar que un usuario autenticado puede crear un post', async () => {
    const userResponse = await request(app)
      .post('/auth/register')
      .send({
        username: 'editoruser',
        email: 'editoruser@example.com',
        password: 'Test@1234',
        role: 'Editor',
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'editoruser@example.com',
        password: 'Test@1234',
      });

    const token = loginResponse.body.token;

    const postResponse = await request(app)
      .post('/posts/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'First Post',
        content: 'This is the first post content.',
        type: 'text',
      });

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toHaveProperty('id');
    expect(postResponse.body.title).toBe('First Post');
  });

  it('Verificar que un usuario autenticado puede actualizar su propio post', async () => {
    const userResponse = await request(app)
      .post('/auth/register')
      .send({
        username: 'editoruser',
        email: 'editoruser@example.com',
        password: 'Test@1234',
        role: 'Editor',
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'editoruser@example.com',
        password: 'Test@1234',
      });

    const token = loginResponse.body.token;

    const postResponse = await request(app)
      .post('/posts/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post content.',
        type: 'text',
      });

    const postId = postResponse.body.id;

    const updateResponse = await request(app)
      .put(`/posts/post/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Post Title',
        content: 'This is updated test post content.',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('Updated Post Title');
  });

  it('Verificar que un usuario autenticado puede eliminar su propio post', async () => {
    const userResponse = await request(app)
      .post('/auth/register')
      .send({
        username: 'editoruser',
        email: 'editoruser@example.com',
        password: 'Test@1234',
        role: 'Editor',
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'editoruser@example.com',
        password: 'Test@1234',
      });

    const token = loginResponse.body.token;

    const postResponse = await request(app)
      .post('/posts/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post content.',
        type: 'text',
      });

    const postId = postResponse.body.id;

    const deleteResponse = await request(app)
      .delete(`/posts/post/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);
  });

  it('Verificar que se pueden recuperar todos los posts asociados con un usuario', async () => {
    const userResponse = await request(app)
      .post('/auth/register')
      .send({
        username: 'editoruser',
        email: 'editoruser@example.com',
        password: 'Test@1234',
        role: 'Editor',
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'editoruser@example.com',
        password: 'Test@1234',
      });

    const token = loginResponse.body.token;

    await request(app)
      .post('/posts/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'First Post',
        content: 'This is the first post content.',
        type: 'text',
      });

    await request(app)
      .post('/posts/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Second Post',
        content: 'This is the second post content.',
        type: 'text',
      });

    const postsResponse = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`);

    expect(postsResponse.status).toBe(200);
    expect(postsResponse.body.length).toBe(2);
    expect(postsResponse.body[0].title).toBe('First Post');
    expect(postsResponse.body[1].title).toBe('Second Post');
  });

  it('Verificar que se puede recuperar un post específico por ID', async () => {
    const userResponse = await request(app)
      .post('/auth/register')
      .send({
        username: 'editoruser',
        email: 'editoruser@example.com',
        password: 'Test@1234',
        role: 'Editor',
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'editoruser@example.com',
        password: 'Test@1234',
      });

    const token = loginResponse.body.token;

    const postResponse = await request(app)
      .post('/posts/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Specific Post',
        content: 'This is the specific post content.',
        type: 'text',
      });

    const postId = postResponse.body.id;

    const getResponse = await request(app)
      .get(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe('Specific Post');
  });
});
