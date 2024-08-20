import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest'; 
import { PostService } from '../services/postService';

export class PostController {
  
  /**
   * Crea un nuevo post.
   * 
   * @param req - La solicitud HTTP, debe contener `title`, `content` y `type` en el cuerpo. El usuario autenticado debe estar disponible en `req.user`.
   * @param res - La respuesta HTTP que devuelve el post creado o un mensaje de error.
   */
  static async createPost(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized, no req.user' });
      }

      const { title, content, type } = req.body;

      // Verifica si req.user tiene un ID válido
      if (!req.user.id) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      // Extraer el ID del usuario aut
      const userId = req.user.id;

      // Llamar al servicio para crear un nuevo post
      const post = await PostService.createPost(userId, title, content, type);
      res.status(201).json(post);
    } catch (error) {
      // Manejar cualquier error que ocurra durante la creación del post y devolver un mensaje de error
      res.status(400).json({ message: (error as any).message });
    }
  }

  /**
   * Actualiza un post existente.
   * 
   * @param req - La solicitud HTTP, debe contener el ID del post en los parámetros y los datos actualizados en el cuerpo.
   * @param res - La respuesta HTTP que devuelve el post actualizado o un mensaje de error.
   */
  static async updatePost(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = req.params.id as string;
      const updates = req.body;

      // Llamar al servicio para actualizar el post
      const updatedPost = await PostService.updatePost(postId, updates);
      res.status(200).json(updatedPost);
    } catch (error) {
      // Manejar cualquier error que ocurra durante la actualización del post y devolver un mensaje de error
      res.status(400).json({ message: (error as any).message });
    }
  }

  /**
   * Elimina un post existente.
   * 
   * @param req - La solicitud HTTP, debe contener el ID del post en los parámetros.
   * @param res - La respuesta HTTP con un código 204 No Content si la eliminación es exitosa, o un mensaje de error.
   */
  static async deletePost(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = req.params.id as string;

      // Llamar al servicio para eliminar el post
      await PostService.deletePost(postId);
      res.status(204).send();  // 204 No Content
    } catch (error) {
      // Manejar cualquier error que ocurra durante la eliminación del post y devolver un mensaje de error
      res.status(400).json({ message: (error as any).message });
    }
  }

  /**
   * Obtiene todos los posts.
   * 
   * @param req - La solicitud HTTP.
   * @param res - La respuesta HTTP que devuelve un arreglo de posts o un mensaje de error.
   */
  static async getAllPosts(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Llamar al servicio para obtener todos los posts
      const posts = await PostService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      // Manejar cualquier error que ocurra al obtener los posts y devolver un mensaje de error
      res.status(400).json({ message: (error as any).message });
    }
  }

  /**
   * Obtiene un post por su ID.
   * 
   * @param req - La solicitud HTTP, debe contener el ID del post en los parámetros.
   * @param res - La respuesta HTTP que devuelve el post encontrado o un mensaje de error si no se encuentra.
   */
  static async getPostById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = req.params.id as string;

      // Llamar al servicio para obtener el post por ID
      const post = await PostService.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json(post);
    } catch (error) {
      // Manejar cualquier error que ocurra al obtener el post por ID y devolver un mensaje de error
      res.status(400).json({ message: (error as any).message });
    }
  }
}
