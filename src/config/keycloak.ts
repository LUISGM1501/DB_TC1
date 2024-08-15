import Keycloak from 'keycloak-connect';
import session from 'express-session';
import path from 'path';

// Configurar el almacén de sesiones en la memoria
const memoryStore = new session.MemoryStore();

// Configuración de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, path.join(__dirname, '../../keycloak.json'));

export { keycloak, memoryStore };
