import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import jwt from 'jsonwebtoken';

export function authorize(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      console.error("No authorization header found.");
      return res.status(403).json({ message: 'Access denied' });
    }

    const token = req.headers.authorization.split(' ')[1];
    
    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);
      console.log("Decoded Token:", decodedToken);

      const userRole = decodedToken.role; 
      console.log("User Role from token:", userRole);

      const hasRole = roles.includes(userRole);
      if (!hasRole) {
        console.error("User does not have the required role:", userRole, "Required roles:", roles);
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      console.error("Token decoding failed:", error);
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
}
