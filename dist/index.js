"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const database_1 = require("./config/database");
const keycloak_1 = require("./config/keycloak");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
// Configurar la sesión
app.use((0, express_session_1.default)({
    secret: 'some_secret',
    resave: false,
    saveUninitialized: true,
    store: keycloak_1.memoryStore,
}));
// Middleware de Keycloak
app.use(keycloak_1.keycloak.middleware());
app.use(express_1.default.json());
// Configuración de las rutas
app.use('/auth', authRoutes_1.default);
app.use('/users', keycloak_1.keycloak.protect(), userRoutes_1.default); // Protegiendo las rutas de usuario con Keycloak
app.use('/posts', keycloak_1.keycloak.protect(), postRoutes_1.default);
// Configuración de Swagger
(0, swagger_1.setupSwagger)(app);
// Inicializar la base de datos
database_1.AppDataSource.initialize()
    .then(() => {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
        console.log('API Docs available at http://localhost:3000/api-docs');
    });
})
    .catch((error) => console.log(error));
