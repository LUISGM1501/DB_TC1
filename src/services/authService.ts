import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export class AuthService {
  static async register(username: string, email: string, password: string, role: string = 'Reader') {
    const userRepository = AppDataSource.getRepository(User);

    // Solo permitir a los administradores asignar roles diferentes
    if (role !== 'Reader' && role !== 'Editor' && role !== 'Admin') {
      throw new Error('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ username, email, password: hashedPassword, role });
    const savedUser = await userRepository.save(user);
   
    return savedUser;
  }

  static async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    // Usa la clave secreta desde la variable de entorno
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return token;
  }
}
