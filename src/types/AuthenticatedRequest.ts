import { Request } from 'express';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: User;
}
