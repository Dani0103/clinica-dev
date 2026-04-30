import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export const useAuditoriaService = () => {
  const api = useApi();

  const list = (params?: { from?: string; to?: string; usuario_id?: number }) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.AUDITORIA.LIST, { params });

  return { ...api, list };
};
