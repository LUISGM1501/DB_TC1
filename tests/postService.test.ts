import { Post } from '../src/models/Post';
import { User } from '../src/models/User';
import { PostService } from '../src/services/postService';
import { AppDataSource } from '../src/config/database';

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
    const user = { id: 1, username: 'testuser' } as User;
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

  it('Tirar error cuando se cree post con usuario invalido', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(PostService.createPost(1, 'Test Post', 'This is a test post content', 'text')).rejects.toThrow('User not found');
  });

  it('Probar actualizar un post existente con id', async () => {
        const postId = 1;
        const updates = { title: 'New Title', content: 'New content' };
        const mockPost = { id: postId, title: 'Old Title', content: 'Old content', type: 'text', user: { id: 1, username: 'user1' } } as Post;

        mockPostRepository.findOne.mockResolvedValue(mockPost);
        mockPostRepository.save.mockResolvedValue({ ...mockPost, ...updates });
        mockPostRepository.merge.mockImplementation((post: Post, updates: Partial<Post>) => Object.assign(post, updates));

        // Prueba de la función de actualización del post
        const updatedPost = await PostService.updatePost(postId, updates);

        // Verificaciones
        expect(mockPostRepository.findOne).toHaveBeenCalledWith({ where: { id: postId } });
        expect(mockPostRepository.save).toHaveBeenCalledWith({ ...mockPost, ...updates });
        expect(updatedPost.title).toBe('New Title');
        expect(updatedPost.content).toBe('New content');
  });
  


  it('Tirar error cuando no se encuentre el post para modificar', async () => {
    mockPostRepository.findOne.mockResolvedValue(null);

    await expect(PostService.updatePost(1, { title: 'New Title' })).rejects.toThrow('Post not found');
  });

  it('Eliminar un post de un usuario', async () => {
    const post = { id: 1, title: 'Test Post', content: 'This is a test post content' } as Post;

    mockPostRepository.findOne.mockResolvedValue(post);
    mockPostRepository.remove.mockResolvedValue(undefined);

    await PostService.deletePost(post.id);

    expect(mockPostRepository.findOne).toHaveBeenCalledWith({ where: { id: post.id } });
    expect(mockPostRepository.remove).toHaveBeenCalledWith(post);
  });

  it('Tirar error cuando se busca eliminar post no existente', async () => {
    mockPostRepository.findOne.mockResolvedValue(null);

    await expect(PostService.deletePost(1)).rejects.toThrow('Post not found');
  });

  it('Obtener todos los post en la aplicacion', async () => {
    const posts = [
      { id: 1, title: 'Titulo 1', content: 'Contenido 1', user: { id: 1, username: 'user1' } },
      { id: 2, title: 'Titulo 2', content: 'Contenido 2', user: { id: 2, username: 'user2' } },
    ] as Post[];

    mockPostRepository.find.mockResolvedValue(posts);

    const result = await PostService.getAllPosts();

    expect(mockPostRepository.find).toHaveBeenCalledWith({ relations: ['user'] });
    expect(result).toEqual(posts);
  });

  it('Obtener post por id', async () => {
    const post = { id: 1, title: 'titulo', content: 'contenido', user: { id: 1, username: 'user1' } } as Post;

    mockPostRepository.findOne.mockResolvedValue(post);

    const result = await PostService.getPostById(post.id);

    expect(mockPostRepository.findOne).toHaveBeenCalledWith({ where: { id: post.id }, relations: ['user'] });
    expect(result).toEqual(post);
  });

  it('Tirar el error si al buscar un post no existente', async () => {
    mockPostRepository.findOne.mockResolvedValue(null);

    await expect(PostService.getPostById(1)).rejects.toThrow('Post not found');
  });
});

