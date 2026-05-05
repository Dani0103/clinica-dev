import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface NewCitaPayload {
  paciente_id: number;
  medico_id: number;
  especialidad_id: number;
  /** ISO 8601. Debe ser fecha futura (`after:now` en backend). */
  programada_para: string;
}

export interface CitaBatchItem {
  medico_id: number;
  especialidad_id: number;
  /** ISO 8601. Debe ser fecha futura. */
  programada_para: string;
}

export interface NewCitaBatchPayload {
  paciente_id: number;
  citas: CitaBatchItem[];
}

export interface CitaFiltros {
  paciente_id?: number;
  medico_id?: number;
  /** ISO 8601 o fecha YYYY-MM-DD — citas desde esta fecha */
  desde?: string;
  /** ISO 8601 o fecha YYYY-MM-DD — citas hasta esta fecha */
  hasta?: string;
}

export interface CitaDeApi {
  id: number;
  paciente_id: number;
  medico_id: number;
  especialidad_id: number;
  programada_para: string;
  created_at: string;
  updated_at: string;
  paciente: { id: number; nombres: string; apellidos: string; cedula: string; eps?: string };
  /**
   * El backend serializa `User` con un único campo `nombre` (la tabla `usuarios`
   * no tiene `nombres`/`apellidos`). Mantenemos ambos como opcionales por
   * compatibilidad con futuras versiones del Resource.
   */
  medico: {
    id: number;
    nombre?: string;
    nombres?: string;
    apellidos?: string;
  };
  especialidad: { id: number; nombre: string } | null;
}

export const useCitaService = () => {
  const api = useApi();

  const list = (filtros?: CitaFiltros) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.CITAS.LIST, {
      params: filtros as Record<string, any>,
    });

  const create = (payload: NewCitaPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.CITAS.CREATE, {
      method: "POST",
      body: payload,
    });

  const createBatch = (payload: NewCitaBatchPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.CITAS.BATCH, {
      method: "POST",
      body: payload,
    });

  return { ...api, list, create, createBatch };
};
