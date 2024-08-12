import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

/**
 * @swagger
 * /users/user/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Editor, Reader]
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Usuario no encontrado
 */
// Ruta para actualizar a un usuario
router.put('/user/:id', authorize(['Admin']), UserController.updateUser);

/**
 * @swagger
 * /users/user/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Usuario no encontrado
 */
// Ruta para eliminar a un usuario
router.delete('/user/:id', authorize(['Admin']), UserController.deleteUser);

export default router;
