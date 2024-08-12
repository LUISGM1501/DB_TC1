import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

/**
 * @swagger
 * /posts/post:
 *   post:
 *     summary: Crea un nuevo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, image, video]
 *     responses:
 *       201:
 *         description: Post creado
 *       400:
 *         description: Error en la solicitud
 */
// Ruta para crear un nuevo post 
router.post('/post', authorize(['Admin', 'Editor']), PostController.createPost);

/**
 * @swagger
 * /posts/post/{id}:
 *   put:
 *     summary: Actualiza un post existente
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post actualizado
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Post no encontrado
 */
// Ruta para actualizar un post
router.put('/post/:id', authorize(['Admin', 'Editor']), PostController.updatePost);

/**
 * @swagger
 * /posts/post/{id}:
 *   delete:
 *     summary: Elimina un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del post
 *     responses:
 *       204:
 *         description: Post eliminado
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Post no encontrado
 */
// Ruta para eliminar un post
router.delete('/post/:id', authorize(['Admin']), PostController.deletePost);

export default router;
