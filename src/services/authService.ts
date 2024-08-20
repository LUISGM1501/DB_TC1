import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export class AuthService {
  /**
   * Registra un nuevo usuario en el sistema.
   * 
   * @param username - Nombre de usuario.
   * @param email - Correo electrónico del usuario.
   * @param password - Contraseña del usuario.
   * @param role - Rol del usuario (Reader, Editor, Admin).
   * @returns El usuario creado y guardado en la base de datos.
   * @throws Error si el rol proporcionado es inválido o si ocurre algún problema durante el proceso de registro.
   */
  static async register(username: string, email: string, password: string, role: string) {
    const userRepository = AppDataSource.getRepository(User);

    // Verifica que el rol proporcionado sea válido
    if (role !== 'Reader' && role !== 'Editor' && role !== 'Admin') {
      throw new Error('Invalid role');
    }

    // Hashea la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea una nueva instancia de usuario con los datos proporcionados
    const user = userRepository.create({ username, email, password: hashedPassword, role });

    // Guarda el nuevo usuario en la base de datos
    const savedUser = await userRepository.save(user);

    return savedUser;
  }

  /**
   * Inicia sesión para un usuario existente.
   * 
   * @param email - Correo electrónico del usuario.
   * @param password - Contraseña del usuario.
   * @returns Un token JWT si las credenciales son válidas.
   * @throws Error si las credenciales son inválidas o si ocurre algún problema durante el proceso de inicio de sesión.
   */
  static async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);

    // Busca al usuario por su correo electrónico
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    // Genera un token JWT utilizando la clave secreta y los datos del usuario
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return token;
  }
}
