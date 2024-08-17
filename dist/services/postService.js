"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const database_1 = require("../config/database");
const Post_1 = require("../models/Post");
const User_1 = require("../models/User");
class PostService {
    static createPost(userId_1, title_1, content_1) {
        return __awaiter(this, arguments, void 0, function* (userId, title, content, type = 'text') {
            const postRepository = database_1.AppDataSource.getRepository(Post_1.Post);
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }
            const post = postRepository.create({ title, content, type, user });
            yield postRepository.save(post);
            return post;
        });
    }
    static updatePost(postId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = database_1.AppDataSource.getRepository(Post_1.Post);
            let post = yield postRepository.findOne({ where: { id: postId } });
            if (!post) {
                throw new Error('Post not found');
            }
            postRepository.merge(post, updates);
            yield postRepository.save(post);
            return post;
        });
    }
    static deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = database_1.AppDataSource.getRepository(Post_1.Post);
            const post = yield postRepository.findOne({ where: { id: postId } });
            if (!post) {
                throw new Error('Post not found');
            }
            yield postRepository.remove(post);
        });
    }
    static getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = database_1.AppDataSource.getRepository(Post_1.Post);
            const posts = yield postRepository.find({ relations: ['user'] });
            return posts;
        });
    }
    static getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = database_1.AppDataSource.getRepository(Post_1.Post);
            const post = yield postRepository.findOne({ where: { id: postId }, relations: ['user'] });
            if (!post) {
                throw new Error('Post not found');
            }
            return post;
        });
    }
}
exports.PostService = PostService;
