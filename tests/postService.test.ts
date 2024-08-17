import { Post } from '../src/models/Post';
import { User } from '../src/models/User';
import { PostService } from '../src/services/postService';
import { AppDataSource } from '../src/config/database';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../src/models/User', () => {
  return {
    User: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

jest.mock('../src/models/Post', () => {
  return {
    Post: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

jest.mock('typeorm');

describe('PostService', () => {
  let mockPostRepository: any;
  let mockUserRepository: any;

  beforeEach(() => {
    mockPostRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
      find: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Post) return mockPostRepository;
      if (entity === User) return mockUserRepository;
      throw new Error('Unexpected entity');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Crear un post con un usuario existente', async () => {
    const userId = uuidv4();
    const user = { id: userId, username: 'testuser', email: 'test@example.com', password: 'hashedPassword', role: 'Reader' } as User;
    const post = { title: 'Titulo', content: 'Prueba de publicación', type: 'text', user } as Post;

    mockUserRepository.findOne.mockResolvedValue(user);
    mockPostRepository.create.mockReturnValue(post);
    mockPostRepository.save.mockResolvedValue(post);

    const result = await PostService.createPost(user.id, post.title, post.content, post.type);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    expect(mockPostRepository.create).toHaveBeenCalledWith({ title: post.title, content: post.content, type: post.type, user });
    expect(mockPostRepository.save).toHaveBeenCalledWith(post);
    expect(result).toEqual(post);
  });

  it('Tirar error cuando se cree post con usuario inválido', async () => {
    const userId = uuidv4();
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(PostService.createPost(userId, 'Test Post', 'This is a test post content', 'text')).rejects.toThrow('User not found');
  });

  it('Probar actualizar un post existente con id', async () => {
    const postId = uuidv4();
    const updates = { title: 'New Title', content: 'New content' };
    const mockPost = { id: postId, title: 'Old Title', content: 'Old content', type: 'text', user: { id: uuidv4(), username: 'user1', email: 'user1@example.com', password: 'hashedPassword', role: 'Reader' } } as Post;

    mockPostRepository.findOne.mockResolvedValue(mockPost);
    mockPostRepository.save.mockResolvedValue({ ...mockPost, ...updates });
    mockPostRepository.merge.mockImplementation((post: Post, updates: Partial<Post>) => Object.assign(post, updates));

    const updatedPost = await PostService.updatePost(postId, updates);

    expect(mockPostRepository.findOne).toHaveBeenCalledWith({ where: { id: postId } });
    expect(mockPostRepository.save).toHaveBeenCalledWith({ ...mockPost, ...updates });
    expect(updatedPost.title).toBe('New Title');
    expect(updatedPost.content).toBe('New content');
  });

  it('Tirar error cuando no se encuentre el post para modificar', async () => {
    const postId = uuidv4();
    mockPostRepository.findOne.mockResolvedValue(null);

    await expect(PostService.updatePost(postId, { title: 'New Title' })).rejects.toThrow('Post not found');
  });

  it('Eliminar un post de un usuario', async () => {
    const postId = uuidv4();
    const post = { id: postId, title: 'Test Post', content: 'This is a test post content', user: { id: uuidv4(), username: 'user1', email: 'user1@example.com', password: 'hashedPassword', role: 'Reader' } } as Post;

    mockPostRepository.findOne.mockResolvedValue(post);
    mockPostRepository.remove.mockResolvedValue(undefined);

    await PostService.deletePost(post.id);

    expect(mockPostRepository.findOne).toHaveBeenCalledWith({ where: { id: post.id } });
    expect(mockPostRepository.remove).toHaveBeenCalledWith(post);
  });

  it('Tirar error cuando se busca eliminar post no existente', async () => {
    const postId = uuidv4();
    mockPostRepository.findOne.mockResolvedValue(null);

    await expect(PostService.deletePost(postId)).rejects.toThrow('Post not found');
  });

  it('Obtener todos los posts en la aplicación', async () => {
    const posts = [
      { id: uuidv4(), title: 'Titulo 1', content: 'Contenido 1', user: { id: uuidv4(), username: 'user1', email: 'user1@example.com', password: 'hashedPassword', role: 'Reader' } },
      { id: uuidv4(), title: 'Titulo 2', content: 'Contenido 2', user: { id: uuidv4(), username: 'user2', email: 'user2@example.com', password: 'hashedPassword', role: 'Reader' } },
    ] as Post[];

    mockPostRepository.find.mockResolvedValue(posts);

    const result = await PostService.getAllPosts();

    expect(mockPostRepository.find).toHaveBeenCalledWith({ relations: ['user'] });
    expect(result).toEqual(posts);
  });

  it('Obtener post por id', async () => {
    const postId = uuidv4();
    const post = { id: postId, title: 'titulo', content: 'contenido', user: { id: uuidv4(), username: 'user1', email: 'user1@example.com', password: 'hashedPassword', role: 'Reader' } } as Post;

    mockPostRepository.findOne.mockResolvedValue(post);

    const result = await PostService.getPostById(post.id);

    expect(mockPostRepository.findOne).toHaveBeenCalledWith({ where: { id: post.id }, relations: ['user'] });
    expect(result).toEqual(post);
  });

  it('Tirar error si al buscar un post no existente', async () => {
    const postId = uuidv4();
    mockPostRepository.findOne.mockResolvedValue(null);

    await expect(PostService.getPostById(postId)).rejects.toThrow('Post not found');
  });
});
