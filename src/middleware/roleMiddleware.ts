import { Request, Response, NextFunction } from 'express';

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;  // Asume que `req.user` ha sido establecido por el authMiddleware

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}
