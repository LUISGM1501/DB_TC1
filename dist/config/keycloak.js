"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryStore = exports.keycloak = void 0;
const keycloak_connect_1 = __importDefault(require("keycloak-connect"));
const express_session_1 = __importDefault(require("express-session"));
// Configurar el almacén de sesiones en la memoria
const memoryStore = new express_session_1.default.MemoryStore();
exports.memoryStore = memoryStore;
// Configuración de Keycloak
const keycloak = new keycloak_connect_1.default({ store: memoryStore }, '/usr/src/app/keycloak.json');
exports.keycloak = keycloak;
