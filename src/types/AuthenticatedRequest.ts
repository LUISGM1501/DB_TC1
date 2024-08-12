import { Request } from 'express';
import { User } from '../models/User';
import { Post } from '../models/Post';

export interface AuthenticatedRequest extends Request {
  user?: User;
  post?: Post;
}
