import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key') as { id: number };
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;  // Asigna user al objeto request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
