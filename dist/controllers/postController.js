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
exports.PostController = void 0;
const postService_1 = require("../services/postService");
class PostController {
    static createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Agrega un log para verificar si req.user está definido
                console.log("User in createPost:", req.user);
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const { title, content, type } = req.body;
                const userId = req.user.id; // Usa la interfaz extendida
                const post = yield postService_1.PostService.createPost(userId, title, content, type);
                res.status(201).json(post);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const postId = parseInt(req.params.id);
                const updates = req.body;
                const updatedPost = yield postService_1.PostService.updatePost(postId, updates);
                res.status(200).json(updatedPost);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const postId = parseInt(req.params.id);
                yield postService_1.PostService.deletePost(postId);
                res.status(204).send(); // 204 No Content
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const posts = yield postService_1.PostService.getAllPosts();
                res.status(200).json(posts);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const postId = parseInt(req.params.id);
                const post = yield postService_1.PostService.getPostById(postId);
                if (!post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                res.status(200).json(post);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.PostController = PostController;
