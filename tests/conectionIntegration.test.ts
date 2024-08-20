import request from 'supertest';
import { AppDataSource } from '../src/config/database';
import app from '../src/appTest';
import { User } from '../src/models/User';
import bcrypt from 'bcryptjs';

beforeAll(async () => {
    await AppDataSource.initialize(); // Iniciar la conexión a la base de datos

    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({ where: { email: 'luisgerardourbsalz@gmail.com' } });

    if (user) {
        await userRepository.remove(user); // Eliminar el usuario si existe
    }

    // Crear el usuario de nuevo con la contraseña correcta
    const hashedPassword = await bcrypt.hash('lurbina', 10);
    user = userRepository.create({
        username: 'adminuser',
        email: 'luisgerardourbsalz@gmail.com',
        password: hashedPassword,
        role: 'Admin'
    });
    await userRepository.save(user);
    console.log("Usuario creado:", user);
});

afterAll(async () => {
    await AppDataSource.destroy(); // Cerrar la conexión después de todas las pruebas
});

describe('Prueba de conexiones de la app con las apis', () => {

    it('verificar la comunicación entre las apis y postgressql', async () => {
        // Autenticación
        const loginResponse = await request(app)
        .post('/auth/login')
        .send({ email: 'luisgerardourbsalz@gmail.com', password: 'lurbina' });

        // Verificar el estado de respuesta y obtener el token
        expect(loginResponse.status).toBe(200);
        const token = loginResponse.body.token;

        // Usar el token para autenticar la solicitud a /posts
        const response = await request(app)
            .get('/posts')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);  // Verifica que la respuesta sea 200 OK
    });

    it('verificar que la app inicie con el docker-compose', async () => {
        const execSync = require('child_process').execSync;
        const dockerStatus = execSync('docker-compose ps', { encoding: 'utf-8' });

        expect(dockerStatus).toMatch(/Up/);  // Verifica que los servicios estén en ejecución

        // Realiza la solicitud a /auth/login con POST
        const response = await request(app)
        .post('/auth/login')
        .send({ email: 'luisgerardourbsalz@gmail.com', password: 'lurbina' });

        // Verificar el estado de respuesta
        expect(response.status).toBe(200);  // Verifica que la respuesta sea 200 OK
    });
});
