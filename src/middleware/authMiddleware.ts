import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: User;
}

const secretKey = process.env.JWT_SECRET || ''; // Obtiene la clave JWT desde las variables de entorno

/**
 * Middleware de autenticación para proteger rutas.
 * 
 * Verifica el token JWT en la cabecera de autorización, decodifica el token, 
 * y asocia el usuario correspondiente a la solicitud si el token es válido.
 * 
 * @param req - La solicitud HTTP, debe contener el token JWT en la cabecera 'Authorization'.
 * @param res - La respuesta HTTP que devuelve un mensaje de error si la autenticación falla.
 * @param next - La función de middleware siguiente que se ejecuta si la autenticación es exitosa.
 */
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extrae el token de la cabecera de autorización

  if (!token) {
    // Si no se proporciona un token, la solicitud es rechazada
    return res.status(401).json({ message: 'Unauthorized, no token' });
  }

  try {
    // Verifica y decodifica el token JWT usando la clave secreta
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] }) as { id: string };

    const userId = decoded.id; // Extrae el ID de usuario del token

    if (!userId) {
      // Si no se encuentra un ID de usuario en el token, la solicitud es rechazada
      return res.status(401).json({ message: 'Unauthorized, no user ID found in token' });
    }

    // Busca el usuario en la base de datos usando el ID extraído del token
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      // Si no se encuentra un usuario con el ID proporcionado, la solicitud es rechazada
      return res.status(401).json({ message: 'Unauthorized, no user found with ID: ' + userId });
    }

    // Si todo es correcto, asocia el usuario a la solicitud y continúa con el siguiente middleware
    req.user = user;
    next();
  } catch (error) {
    // Si ocurre un error durante la verificación del token, la solicitud es rechazada
    return res.status(401).json({ 
      message: 'Unauthorized, error', 
      error: (error as any).message
    });
  }
};
