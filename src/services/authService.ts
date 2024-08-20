import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export class AuthService {
  static async register(username: string, email: string, password: string, role: string) {
    const userRepository = AppDataSource.getRepository(User);

    console.log(`Registering user: ${username}, Role: ${role}`);

    if (role !== 'Reader' && role !== 'Editor' && role !== 'Admin') {
        console.error('Invalid role provided:', role);
        throw new Error('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully.');

    // Asegúrate de que el rol se está pasando correctamente aquí
    const user = userRepository.create({ username, email, password: hashedPassword, role });
    console.log('Creating user with role:', role);

    const savedUser = await userRepository.save(user);
    console.log('User saved to database:', savedUser);

    return savedUser;
  }

  static async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error('User not found for email:', email);
      throw new Error('Invalid credentials');
    }
  
    console.log("User found for login:", user);
  
    // Usa la clave secreta desde la variable de entorno
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    console.log("Token generated successfully:", token);
    return token;
  }
  
}
