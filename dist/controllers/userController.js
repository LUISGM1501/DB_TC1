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
exports.UserController = void 0;
const userService_1 = require("../services/userService");
class UserController {
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const updates = req.body;
                const updatedUser = yield userService_1.UserService.updateUser(id, updates);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield userService_1.UserService.deleteUser(id);
                res.status(204).send(); // 204 No Content
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.UserController = UserController;
