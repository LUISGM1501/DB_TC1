"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authorize(roles) {
    return (req, res, next) => {
        var _a;
        if (!req.headers.authorization) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const token = req.headers.authorization.split(' ')[1]; // Asumiendo el formato "Bearer TOKEN"
        try {
            const decodedToken = jsonwebtoken_1.default.decode(token); // Decodifica el token para extraer la información
            // Agrega un log para verificar qué contiene req.user y los roles decodificados
            console.log("Decoded Token:", decodedToken);
            const userRoles = ((_a = decodedToken.realm_access) === null || _a === void 0 ? void 0 : _a.roles) || [];
            console.log("User Roles:", userRoles); // Log para ver qué roles tiene el usuario
            const hasRole = roles.some(role => userRoles.includes(role));
            if (!hasRole) {
                return res.status(403).json({ message: 'Access denied' });
            }
            // Si todo está bien, continúa con la siguiente función
            next();
        }
        catch (error) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    };
}
