import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface Especialidad {
  id: number;
  nombre: string;
}

export const useEspecialidadService = () => {
  const api = useApi();

  const list = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ESPECIALIDADES.LIST);

  const create = (payload: { nombre: string }) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ESPECIALIDADES.CREATE, {
      method: "POST",
      body: payload,
    });

  const update = (id: number | string, payload: { nombre: string }) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ESPECIALIDADES.UPDATE(id), {
      method: "PUT",
      body: payload,
    });

  const remove = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ESPECIALIDADES.DELETE(id), {
      method: "DELETE",
    });

  return { ...api, list, create, update, remove };
};
