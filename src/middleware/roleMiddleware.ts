import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest'; 

export function authorize(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;  // Usa la interfaz extendida

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}
