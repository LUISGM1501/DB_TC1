import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest'; 
import { PostService } from '../services/postService';

export class PostController {
  static async createPost(req: AuthenticatedRequest, res: Response) {
    try {
      console.log("User in createPost:", req.user);

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized, no req.user' });
      }

      const { title, content, type } = req.body;
      const userId = req.user.id as string;  // Asegurarse que sea un string
      const post = await PostService.createPost(userId, title, content, type);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }

  static async updatePost(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = req.params.id as string;
      const updates = req.body;
      const updatedPost = await PostService.updatePost(postId, updates);
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }

  static async deletePost(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = req.params.id as string;
      await PostService.deletePost(postId);
      res.status(204).send();  // 204 No Content
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }

  static async getAllPosts(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const posts = await PostService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }

  static async getPostById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = req.params.id as string;
      const post = await PostService.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }
  }
}
