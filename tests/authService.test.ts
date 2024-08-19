import { AuthService } from '../src/services/authService';
import { AppDataSource } from '../src/config/database';
import { User } from '../src/models/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../src/config/database');

describe('AuthService', () => {
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeAll(() => {
    AppDataSource.getRepository = jest.fn().mockReturnValue(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debería hashear la contraseña y guardar el usuario', async () => {
      const userData = { username: 'testuser', email: 'test@example.com', password: 'password123', role: 'Reader' };
      const hashedPassword = 'hashedPassword';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockReturnValue({ ...userData, password: hashedPassword });
      mockUserRepository.save.mockResolvedValue({ id: uuidv4(), ...userData, password: hashedPassword });

      const result = await AuthService.register(userData.username, userData.email, userData.password, userData.role);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({ ...userData, password: hashedPassword });
      expect(mockUserRepository.save).toHaveBeenCalledWith({ ...userData, password: hashedPassword });
      expect(result).toEqual(expect.objectContaining({ username: 'testuser', email: 'test@example.com' }));
    });

    it('debería tirar un error si se registra a un usuario con un rol inválido', async () => {
      await expect(AuthService.register('testuser', 'test@example.com', 'password123', 'InvalidRole')).rejects.toThrow('Invalid role');
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('verificar el token', async () => {
      const user = { id: uuidv4(), email: 'test@example.com', password: 'hashedPassword', role: 'Reader' };
      const token = 'jwtToken';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue(user);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        throw new Error("JWT_SECRET no está definido en las variables de entorno");
      }

      const result = await AuthService.login(user.email, 'password123');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
      expect(jwt.sign).toHaveBeenCalledWith({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
      expect(result).toBe(token);
    });

    it('reconocer credenciales inválidas', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(AuthService.login('invalid@example.com', 'password123')).rejects.toThrow('Invalid credentials');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'invalid@example.com' } });
    });
  });
});
