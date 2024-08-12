import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import jwt from 'jsonwebtoken';

export function authorize(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const token = req.headers.authorization.split(' ')[1];  // Asumiendo el formato "Bearer TOKEN"
    
    try {
      const decodedToken: any = jwt.decode(token);  // Decodifica el token para extraer la información

      // Agrega un log para verificar qué contiene req.user y los roles decodificados
      console.log("Decoded Token:", decodedToken);

      const userRoles = decodedToken.realm_access?.roles || [];
      console.log("User Roles:", userRoles);  // Log para ver qué roles tiene el usuario

      const hasRole = roles.some(role => userRoles.includes(role));
      if (!hasRole) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Si todo está bien, continúa con la siguiente función
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
}
