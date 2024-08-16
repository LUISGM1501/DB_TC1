import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export class UserService {
  static async updateUser(id: string, updates: Partial<User>) {
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    userRepository.merge(user, updates);
    await userRepository.save(user);

    return user;
  }

  static async deleteUser(id: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    await userRepository.remove(user);
  }
}
