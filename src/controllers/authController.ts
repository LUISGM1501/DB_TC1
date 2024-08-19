import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      console.log(`Attempting to register user: ${email}`);
      
      const user = await AuthService.register(username, email, password);
      console.log('User registered successfully:', user);

      res.status(201).json(user);
    } catch (error: any) {
      console.error('Error registering user:', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(`Attempting to log in user: ${email}`);
      
      const token = await AuthService.login(email, password);
      console.log('User logged in successfully. Token:', token);

      res.status(200).json({ token });
    } catch (error: any) {
      console.error('Error logging in user:', error.message);
      res.status(400).json({ message: error.message });
    }
  }
}
