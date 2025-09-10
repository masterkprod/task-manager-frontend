/**
 * Configuración de la aplicación
 * Valida y proporciona las variables de entorno necesarias
 */

// Validar que las variables de entorno requeridas estén definidas
const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const;

// Verificar que todas las variables requeridas estén definidas
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(
      `❌ Variable de entorno requerida no encontrada: ${key}\n` +
      `📝 Por favor, crea un archivo .env.local con la siguiente configuración:\n\n` +
      `NEXT_PUBLIC_API_URL=http://localhost:5000\n\n` +
      `🔗 O configura la variable en tu plataforma de despliegue (Vercel, Netlify, etc.)`
    );
  }
}

// Validar que la URL del API sea válida
if (!requiredEnvVars.NEXT_PUBLIC_API_URL.startsWith('http')) {
  throw new Error(
    `❌ URL del API inválida: ${requiredEnvVars.NEXT_PUBLIC_API_URL}\n` +
    `📝 La URL debe comenzar con 'http://' o 'https://'\n` +
    `💡 Ejemplo: http://localhost:5000 o https://tu-backend.com`
  );
}

// Configuración validada
export const config = {
  // URL del backend API
  apiUrl: requiredEnvVars.NEXT_PUBLIC_API_URL,
  
  // Configuración de la aplicación
  app: {
    name: 'Task Manager',
    description: 'Aplicación moderna para gestión de tareas',
    version: '1.0.0',
  },
  
  // Configuración de la API
  api: {
    baseURL: requiredEnvVars.NEXT_PUBLIC_API_URL,
    timeout: 10000, // 10 segundos
    retries: 3,
  },
  
  // Configuración de autenticación
  auth: {
    tokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    tokenExpiryKey: 'tokenExpiry',
  },
  
  // Configuración de la UI
  ui: {
    itemsPerPage: 10,
    maxItemsPerPage: 100,
    toastDuration: 4000,
  },
} as const;

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.api.baseURL?.replace(/\/$/, '') || ''; // Remover barra final si existe
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Función para validar si estamos en desarrollo
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Función para validar si estamos en producción
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

// Función para obtener información del entorno
export const getEnvironmentInfo = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: config.api.baseURL,
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
  };
};

export default config;
