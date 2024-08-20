import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  /**
   * Maneja la lógica de registro de usuarios.
   * 
   * @param req - La solicitud HTTP, debe contener `username`, `email`, `password` y `role` en el cuerpo.
   * @param res - La respuesta HTTP que devuelve el usuario creado o un mensaje de error.
   */
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;
      
      // Llamar al servicio de autenticación para registrar un nuevo usuario
      const user = await AuthService.register(username, email, password, role);

      // Devolver el usuario creado con un código de estado 201 (Creado)
      res.status(201).json(user);
    } catch (error: any) {
      // Manejar cualquier error que ocurra durante el registro y devolver un mensaje de error con un código de estado 400
      console.error('Error registering user:', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Maneja la lógica de inicio de sesión de usuarios.
   * 
   * @param req - La solicitud HTTP, debe contener `email` y `password` en el cuerpo.
   * @param res - La respuesta HTTP que devuelve un token JWT o un mensaje de error.
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Llamar al servicio de autenticación para iniciar sesión y obtener un token
      const token = await AuthService.login(email, password);

      // Devolver el token con un código de estado 200 (Éxito)
      res.status(200).json({ token });
    } catch (error: any) {
      // Manejar cualquier error que ocurra durante el inicio de sesión y devolver un mensaje de error con un código de estado 400
      console.error('Error logging in user:', error.message);
      res.status(400).json({ message: error.message });
    }
  }
}
