import Keycloak from 'keycloak-connect';
import session from 'express-session';

// Configurar el almacén de sesiones en la memoria
const memoryStore = new session.MemoryStore();

// Configuración de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, '/usr/src/app/keycloak.json');

export { keycloak, memoryStore };
