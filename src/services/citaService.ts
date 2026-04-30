import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface NewCitaPayload {
  paciente_id: number;
  profesional_id: number;
  programada_para: string;
  motivo?: string;
  duracion_minutos?: number;
}

export const useCitaService = () => {
  const api = useApi();

  const create = (payload: NewCitaPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.CITAS.CREATE, {
      method: "POST",
      body: payload,
    });

  return { ...api, create };
};
