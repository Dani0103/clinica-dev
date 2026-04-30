import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface NewCitaPayload {
  paciente_id: number;
  medico_id: number;
  especialidad_id: number;
  /** ISO 8601 string. Debe ser una fecha futura (validado en backend con `after:now`). */
  programada_para: string;
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
