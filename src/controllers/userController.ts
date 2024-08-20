import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  
  /**
   * Actualiza un usuario existente.
   * 
   * @param req - La solicitud HTTP, debe contener el ID del usuario en los parámetros y los datos actualizados en el cuerpo.
   * @param res - La respuesta HTTP que devuelve el usuario actualizado o un mensaje de error.
   */
  static async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id; 
      const updates = req.body;

      // Llamar al servicio para actualizar el usuario
      const updatedUser = await UserService.updateUser(id, updates);
      res.status(200).json(updatedUser);
    } catch (error) {
      // Manejar cualquier error que ocurra durante la actualización del usuario y devolver un mensaje de error
      res.status(400).json({ message: (error as any).message });
    }
  }

  /**
   * Elimina un usuario existente.
   * 
   * @param req - La solicitud HTTP, debe contener el ID del usuario en los parámetros.
   * @param res - La respuesta HTTP con un código 204 No Content si la eliminación es exitosa, o un mensaje de error.
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id;

      // Llamar al servicio para eliminar el usuario
      await UserService.deleteUser(id);
      res.status(204).send();  // 204 No Content
    } catch (error) {
      // Manejar cualquier error que ocurra durante la eliminación del usuario y devolver un mensaje de error
      res.status(400).json({ message: (error as any).message });
    }
  }
}
