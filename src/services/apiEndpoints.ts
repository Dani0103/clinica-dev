const AVANZAR_API = import.meta.env.VITE_API_URL_AVANZAR;

export const AppUrls = {
  avanzarApi: AVANZAR_API,
};

export const API_ENDPOINTS = {
  // Módulo de Autenticación
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    GET_USER: 'user',
  },

  // Módulo de Recuperación de Contraseña
  PASSWORD: {
    FORGOT: 'password/forgot',
    VALIDATE: 'password/validate',
    RESET: 'password/reset',
  },

} as const;

// Tipo para obligar a que las rutas salgan de este objeto
export type ApiEndpoint = string;