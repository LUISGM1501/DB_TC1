import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import jwkToPem from 'jwk-to-pem';

interface AuthenticatedRequest extends Request {
  user?: User;
}

const jwk = {
  kty: "RSA" as const,
  kid: "hlqcrMMhwBYgvqAGKvO1Eedl6tZBfTK4DUEbXkSi6n8",
  use: "sig",
  alg: "RS256",
  n: "t0l1ip0rIGpbtXEh1eqRH6x6hP8pT-rRMTNaP8XUPwA6lKI6SdyOaf_8mZIsWmU6OjDrxTFSvIO5Q-VgT-Dy0FSZsjeA3E-KEaOEcJBRYQQGEM617jyyowNgE9sJIbOqfDa6kCAPOTJg9zPKeFpLdug0zxTMFRyx7dMaEjt6apu0SiQCTErxsgCKEYUzqnBzfvR1GIHpkUlER9_mH9TqFsFP_H2SimpNnFrJ9Kc4dLca-7zxpgN6ka6hjdRJyMHCYKKGZ_4KIL6bJ8_aElyUN-X60kvywRaVjPLCfq9E7kWDAligk-tPa_txw2s5XBVPIC4CUF6yYTp4GZY0TxRENw",
  e: "AQAB",
};

const publicKey = jwkToPem(jwk);

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ message: 'Unauthorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    
    console.log("Decoded token in authMiddleware:", decoded);

    const userId = (decoded as any).sub;

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

    req.user = user; // Aquí estamos asegurándonos de que `req.user` sea una instancia completa de `User`
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