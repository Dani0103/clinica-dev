import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface ResultadoTerapiaPayload {
  respuesta_id: number;
  marcado: boolean;
  notas_libres?: string;
}

export interface NewTerapiaPayload {
  paciente_id: number;
  objetivo_id: number;
  actividad_id: number;
  especialidad_id: number;
  firma_electronica: string;
  resultados: ResultadoTerapiaPayload[];
}

export const useTerapiaService = () => {
  const api = useApi();

  const list = (params?: { paciente_id?: number; profesional_id?: number }) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.TERAPIAS.LIST, { params });

  const create = (payload: NewTerapiaPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.TERAPIAS.CREATE, {
      method: "POST",
      body: payload,
    });

  return { ...api, list, create };
};
