import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: User;
}

const secretKey = process.env.JWT_SECRET || ''; // Asegúrate de que JWT_SECRET se está usando aquí

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ message: 'Unauthorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    
    console.log("Decoded token in authMiddleware:", decoded);

    const userId = (decoded as any).id;

    if (!userId) {
      console.log("User ID not found in token:", decoded);
      return res.status(401).json({ message: 'Unauthorized, no user ID found in token' });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      console.log("No user found with ID:", userId);
      return res.status(401).json({ message: 'Unauthorized, no user, No user found with ID: ' + userId });
    }

    console.log("User found in DB:", user);

    req.user = user;
    console.log("req.user set in authMiddleware:", req.user);

    next();
  } catch (error) {
    console.log("Error verifying token:", error);
    return res.status(401).json({ 
      message: 'Unauthorized, error', 
      error: (error as any).message, 
      "Authorization Header": req.headers['authorization']
    });
  }
};
