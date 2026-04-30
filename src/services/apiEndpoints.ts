const AVANZAR_API = import.meta.env.VITE_API_URL_AVANZAR;

export const AppUrls = {
  avanzarApi: AVANZAR_API,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
  },

  PASSWORD: {
    FORGOT: "password/forgot",
    VALIDATE: "password/validate",
    RESET: "password/reset",
  },

  ADMIN: {
    ROLES: "roles",
    ESPECIALIDADES: "especialidades",
    USERS: "usuarios",
  },

  USERS: {
    LIST: "usuarios",
    CREATE: "usuarios",
    SHOW: (id: number | string) => `usuarios/${id}`,
    UPDATE: (id: number | string) => `usuarios/${id}`,
    DELETE: (id: number | string) => `usuarios/${id}`,
    ACTIVAR: (id: number | string) => `usuarios/${id}/activar`,
    DESACTIVAR: (id: number | string) => `usuarios/${id}/desactivar`,
    MEDICOS: "medicos",
  },

  PACIENTES: {
    LIST: "pacientes",
    CREATE: "pacientes",
    SHOW: (id: number | string) => `pacientes/${id}`,
    DELETE: (id: number | string) => `pacientes/${id}`,
    EXPORTAR_HISTORIA: (id: number | string) => `pacientes/${id}/exportar-historia`,
  },

  CITAS: {
    CREATE: "citas",
  },

  CLINIC: {
    OBJETIVOS: "objetivos",
    TERAPIAS: "terapias",
  },

  OBJETIVOS: {
    LIST: "objetivos",
    CREATE: "objetivos",
    SHOW: (id: number | string) => `objetivos/${id}`,
    UPDATE: (id: number | string) => `objetivos/${id}`,
    DELETE: (id: number | string) => `objetivos/${id}`,
  },

  ACTIVIDADES: {
    CREATE: "actividades",
    UPDATE: (id: number | string) => `actividades/${id}`,
    DELETE: (id: number | string) => `actividades/${id}`,
  },

  RESPUESTAS: {
    CREATE: "respuestas",
    UPDATE: (id: number | string) => `respuestas/${id}`,
    DELETE: (id: number | string) => `respuestas/${id}`,
  },

  TERAPIAS: {
    LIST: "terapias",
    CREATE: "terapias",
  },

  HISTORIAS_INGRESO: {
    LIST: "historias-ingreso",
    CREATE: "historias-ingreso",
  },

  CONSENTIMIENTOS: {
    LIST: "consentimientos",
    CREATE: "consentimientos",
  },

  ORDENES_MEDICAS: {
    LIST: "ordenes-medicas",
    CREATE: "ordenes-medicas",
  },

  CONSULTAS_ESPECIALISTAS: {
    LIST: "consultas-especialistas",
    CREATE: "consultas-especialistas",
  },

  ESCALAS_WEEFIM: {
    LIST: "escalas-weefim",
    CREATE: "escalas-weefim",
  },

  DASHBOARD: {
    METRICS: "dashboard/metrics",
  },

  AUDITORIA: {
    LIST: "auditoria",
  },
} as const;

export type ApiEndpoint = string;
