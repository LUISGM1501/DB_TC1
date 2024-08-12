import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  static async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedUser = await UserService.updateUser(id, updates);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await UserService.deleteUser(id);
      res.status(204).send();  // 204 No Content
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }
}
