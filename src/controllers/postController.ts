import { Request, Response } from 'express';
import { PostService } from '../services/postService';

export class PostController {
  static async createPost(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { title, content, type } = req.body;
      const userId = req.user.id;  // Aquí ya sabemos que req.user existe
      const post = await PostService.createPost(userId, title, content, type);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }

  static async updatePost(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = parseInt(req.params.id);
      const updates = req.body;
      const updatedPost = await PostService.updatePost(postId, updates);
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = parseInt(req.params.id);
      await PostService.deletePost(postId);
      res.status(204).send();  // 204 No Content
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }
}
