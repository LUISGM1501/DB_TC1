import { User } from '../src/models/User';
import { UserService } from '../src/services/userService';
import { AppDataSource } from '../src/config/database';
import { v4 as uuidv4 } from 'uuid'; // Importar la función para generar UUIDs

jest.mock('../src/models/User', () => {
  return {
    User: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

jest.mock('../src/models/Post', () => {
  return {
    Post: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

jest.mock('typeorm');

describe('UserService', () => {
  let mockUserRepository: any;

  beforeEach(() => {
    // Configurar el repositorio de usuarios simulado antes de cada prueba
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      merge: jest.fn(),
    };

    // Mockear el método getRepository para devolver el repositorio simulado
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);
  });

  describe('updateUser', () => {
    it('Debería actualizar un usuario existente dado su ID', async () => {
      const userId = uuidv4(); // Generar un nuevo UUID para esta prueba
      const updates = { username: 'updatedUser' };
      const mockUser = { id: userId, username: 'originalUser', email: 'test@example.com' };
      
      mockUserRepository.findOne.mockResolvedValue(mockUser); // Simular encontrar el usuario
      mockUserRepository.save.mockResolvedValue({ ...mockUser, ...updates }); // Simular la actualización del usuario
      mockUserRepository.merge.mockImplementation((user: User, updates: Partial<User>) => Object.assign(user, updates));

      const updatedUser = await UserService.updateUser(userId, updates);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockUserRepository.save).toHaveBeenCalledWith({ ...mockUser, ...updates });
      expect(updatedUser.username).toBe('updatedUser');
    });

    it('Debería lanzar un error si no encuentra un usuario para actualizar', async () => {
      const userId = uuidv4(); // Generar un nuevo UUID para esta prueba
      const updates = { username: 'updatedUser' };
      
      mockUserRepository.findOne.mockResolvedValue(null); // Simular no encontrar el usuario

      await expect(UserService.updateUser(userId, updates)).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('Debería eliminar un usuario existente dado su ID', async () => {
      const userId = uuidv4(); // Generar un nuevo UUID para esta prueba
      const mockUser = { id: userId, username: 'userToDelete', email: 'test@example.com' };
      
      mockUserRepository.findOne.mockResolvedValue(mockUser); // Simular encontrar el usuario

      await UserService.deleteUser(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('Debería lanzar un error si no encuentra un usuario para eliminar', async () => {
      const userId = uuidv4(); // Generar un nuevo UUID para esta prueba
      
      mockUserRepository.findOne.mockResolvedValue(null); // Simular no encontrar el usuario

      await expect(UserService.deleteUser(userId)).rejects.toThrow('User not found');
    });
  });
});
