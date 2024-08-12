import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

// Ruta para crear un nuevo post
router.post('/post', authorize(['Admin', 'Editor']), PostController.createPost);

// Ruta para actualizar un post existente
router.put('/post/:id', authorize(['Admin', 'Editor']), PostController.updatePost);

// Ruta para eliminar un post
router.delete('/post/:id', authorize(['Admin']), PostController.deletePost);

export default router;
