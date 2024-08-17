import request from 'supertest';
import { AppDataSource } from '../src/config/database';
import app from '../src/appTest';

beforeAll(async () => {
    await AppDataSource.initialize(); // Iniciar la conexión a la base de datos
  });
  
  afterAll(async () => {
    await AppDataSource.destroy(); // Cerrar la conexión después de todas las pruebas
  });

describe('Prueba de conexiones de la app con las apis', () => {

  it('verificar la comunicación entre las apis y postgressql', async () => {
    const response = await request(app)
      .get('/posts');

    expect(response.status).toBe(200);
  });

  it('verificar que la app inicie con el docker-compose', async () => {
    const execSync = require('child_process').execSync;
    const dockerStatus = execSync('docker-compose ps', { encoding: 'utf-8' });

    expect(dockerStatus).toMatch(/Up/);

    const response = await request(app)
      .get('/auth/login');

    expect(response.status).toBe(400);
  });
});
