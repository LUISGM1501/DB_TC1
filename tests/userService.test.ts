import { User } from '../src/models/User';
import { UserService } from '../src/services/userService';
import { AppDataSource } from '../src/config/database';

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
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      merge: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);
  });

  describe('updateUser', () => {
    it('Probar actualizar usuario existente con id', async () => {
      const userId = 1;
      const updates = { username: 'updatedUser' };
      const mockUser = { id: userId, username: 'originalUser', email: 'test@example.com' };
      
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, ...updates });
      mockUserRepository.merge.mockImplementation((user: User, updates: Partial<User>) => Object.assign(user, updates));

      //console.log('Usuario orignial id:', mockUser.id);
      //console.log('Usuario orignial nombre:', mockUser.username);
      //console.log('Usuario orignial email:', mockUser.email);

      const updatedUser = await UserService.updateUser(userId, updates);

      //console.log('Usuario actualizado id:', updatedUser.id);
      //console.log('Usuario actualizado nombre:', updatedUser.username);
      //console.log('Usuario actualizado email:', updatedUser.email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockUserRepository.save).toHaveBeenCalledWith({ ...mockUser, ...updates });
      expect(updatedUser.username).toBe('updatedUser');
    });

    it('Tirar error cuando no encuentra un usuario para actualizar', async () => {
      const userId = 1;
      const updates = { username: 'updatedUser' };
      
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(UserService.updateUser(userId, updates)).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('Probar elminar usuario existente con id', async () => {
      const userId = 1;
      const mockUser = { id: userId, username: 'userToDelete', email: 'test@example.com' };
      
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await UserService.deleteUser(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('Tirar error cuando no encuentra un usuario para eliminar', async () => {
      const userId = 1;
      
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(UserService.deleteUser(userId)).rejects.toThrow('User not found');
    });
  });
});

