import { AppDataSource } from '../config/database'; 
import { User } from '../models/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export class AuthService {
  static async register(username: string, email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ username, email, password: hashedPassword, role: 'Reader' });
    await userRepository.save(user);
    return user;
  }

  static async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
    return token;
  }
}
