import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import jwt from 'jsonwebtoken';

/**
 * Middleware de autorización para proteger rutas según roles de usuario.
 * 
 * Verifica si el usuario tiene uno de los roles requeridos para acceder a una ruta específica.
 * 
 * @param roles - Array de roles permitidos para acceder a la ruta.
 * @returns Función de middleware que verifica el rol del usuario.
 */
export function authorize(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Verifica si hay un encabezado de autorización en la solicitud
    if (!req.headers.authorization) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const token = req.headers.authorization.split(' ')[1];
    
    try {
      // Verifica y decodifica el token JWT usando la clave secreta
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);

      const userRole = decodedToken.role; // Extrae el rol del usuario desde el token

      // Verifica si el rol del usuario está incluido en los roles permitidos
      const hasRole = roles.includes(userRole);
      if (!hasRole) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Si todo es correcto, continúa con el siguiente middleware
      next();
    } catch (error) {
      // Si ocurre un error durante la verificación del token, la solicitud es rechazada
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
}
