"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const keycloak_1 = require("../config/keycloak");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Editor, Reader]
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Error en la solicitud
 *       403:
 *         description: Acceso denegado
 */
router.post('/register', keycloak_1.keycloak.protect('Admin'), authController_1.AuthController.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica un usuario y devuelve un JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Credenciales inválidas
 */
router.post('/login', authController_1.AuthController.login);
exports.default = router;
