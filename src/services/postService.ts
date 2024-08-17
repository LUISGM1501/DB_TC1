import { AppDataSource } from '../config/database';
import { Post } from '../models/Post';
import { User } from '../models/User';

export class PostService {
  static async createPost(userId: number, title: string, content: string, type: string = 'text') {
    const postRepository = AppDataSource.getRepository(Post);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const post = postRepository.create({ title, content, type, user });
    await postRepository.save(post);

    return post;
  }

  static async updatePost(postId: number, updates: Partial<Post>) {
    const postRepository = AppDataSource.getRepository(Post);
    let post = await postRepository.findOne({ where: { id: postId } });



    if (!post) {
      throw new Error('Post not found');
    }

    postRepository.merge(post, updates);
    const updatePost = await postRepository.save(post);

    return updatePost;
  }

  static async deletePost(postId: number) {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new Error('Post not found');
    }

    await postRepository.remove(post);
  }

  static async getAllPosts() {
    const postRepository = AppDataSource.getRepository(Post);
    const posts = await postRepository.find({ relations: ['user'] });
    return posts;
  }

  static async getPostById(postId: number) {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({ where: { id: postId }, relations: ['user'] });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }
}
