import { Router } from 'express';
import { UserService } from '../services/userService';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

// Ruta para actualizar un usuario, protegida para administradores
router.put('/user/:id', authorize(['Admin']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const updatedUser = await UserService.updateUser(id, updates);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

// Ruta para eliminar un usuario, protegida para administradores
router.delete('/user/:id', authorize(['Admin']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await UserService.deleteUser(id);
    res.status(204).send();  // 204 No Content
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
});

export default router;
