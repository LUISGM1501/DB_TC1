import { AppDataSource } from '../config/database';
import { Post } from '../models/Post';
import { User } from '../models/User';

export class PostService {
  
  /**
   * Crea un nuevo post asociado a un usuario específico.
   * 
   * @param userId - ID del usuario que crea el post.
   * @param title - Título del post.
   * @param content - Contenido del post.
   * @param type - Tipo de contenido (por defecto es 'text').
   * @returns El post creado.
   * @throws Error si el usuario no es encontrado.
   */
  static async createPost(userId: string, title: string, content: string, type: string = 'text') {
    const postRepository = AppDataSource.getRepository(Post);
    const userRepository = AppDataSource.getRepository(User);

    // Verifica si el usuario existe
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Crea y guarda el nuevo post
    const post = postRepository.create({ title, content, type, user });
    await postRepository.save(post);

    return post;
  }

  /**
   * Actualiza un post existente con los datos proporcionados.
   * 
   * @param postId - ID del post a actualizar.
   * @param updates - Objeto con los campos a actualizar.
   * @returns El post actualizado.
   * @throws Error si el post no es encontrado.
   */
  static async updatePost(postId: string, updates: Partial<Post>) {
    const postRepository = AppDataSource.getRepository(Post);

    // Busca el post por su ID
    let post = await postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new Error('Post not found');
    }

    // Aplica las actualizaciones y guarda el post
    postRepository.merge(post, updates);
    const updatedPost = await postRepository.save(post);

    return updatedPost;
  }

  /**
   * Elimina un post por su ID.
   * 
   * @param postId - ID del post a eliminar.
   * @throws Error si el post no es encontrado.
   */
  static async deletePost(postId: string) {
    const postRepository = AppDataSource.getRepository(Post);

    // Busca el post por su ID
    const post = await postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new Error('Post not found');
    }

    // Elimina el post
    await postRepository.remove(post);
  }

  /**
   * Obtiene todos los posts, incluyendo la información del usuario que los creó.
   * 
   * @returns Un array de todos los posts.
   */
  static async getAllPosts() {
    const postRepository = AppDataSource.getRepository(Post);

    // Busca todos los posts incluyendo la relación con el usuario
    const posts = await postRepository.find({ relations: ['user'] });

    return posts;
  }

  /**
   * Obtiene un post por su ID, incluyendo la información del usuario que lo creó.
   * 
   * @param postId - ID del post a obtener.
   * @returns El post encontrado.
   * @throws Error si el post no es encontrado.
   */
  static async getPostById(postId: string) {
    const postRepository = AppDataSource.getRepository(Post);

    // Busca el post por su ID incluyendo la relación con el usuario
    const post = await postRepository.findOne({ where: { id: postId }, relations: ['user'] });
    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }
}
