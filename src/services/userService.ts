import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export class UserService {

  /**
   * Actualiza un usuario existente con los datos proporcionados.
   * 
   * @param id - ID del usuario a actualizar.
   * @param updates - Objeto con los campos a actualizar.
   * @returns El usuario actualizado.
   * @throws Error si el usuario no es encontrado.
   */
  static async updateUser(id: string, updates: Partial<User>) {
    const userRepository = AppDataSource.getRepository(User);

    // Busca el usuario por su ID
    let user = await userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    // Aplica las actualizaciones y guarda el usuario
    userRepository.merge(user, updates);
    await userRepository.save(user);

    return user;
  }

  /**
   * Elimina un usuario por su ID.
   * 
   * @param id - ID del usuario a eliminar.
   * @throws Error si el usuario no es encontrado.
   */
  static async deleteUser(id: string) {
    const userRepository = AppDataSource.getRepository(User);

    // Busca el usuario por su ID
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    // Elimina el usuario
    await userRepository.remove(user);
  }
}
