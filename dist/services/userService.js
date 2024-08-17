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
exports.UserService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
class UserService {
    static updateUser(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            let user = yield userRepository.findOne({ where: { id } });
            if (!user) {
                throw new Error('User not found');
            }
            userRepository.merge(user, updates);
            yield userRepository.save(user);
            return user;
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({ where: { id } });
            if (!user) {
                throw new Error('User not found');
            }
            yield userRepository.remove(user);
        });
    }
}
exports.UserService = UserService;
