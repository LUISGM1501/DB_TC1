import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import jwt from 'jsonwebtoken';

export function authorize(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      console.log("No authorization header found.");
      return res.status(403).json({ message: 'Access denied' });
    }

    const token = req.headers.authorization.split(' ')[1];
    
    try {
      const decodedToken: any = jwt.decode(token);
      console.log("Decoded Token:", decodedToken);

      const userRoles = [
        ...(decodedToken.realm_access?.roles || []),
        ...(decodedToken.resource_access?.DockerRestApiClient?.roles || [])
      ];

      console.log("User Roles:", userRoles);

      const hasRole = roles.some(role => userRoles.includes(role));
      if (!hasRole) {
        console.log("User does not have the required role.");
        return res.status(403).json({ message: 'Access denied' });
      }

      // No sobreescribir req.user, solo verificar roles
      next();
    } catch (error) {
      console.log("Token decoding failed:", error);
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
}

