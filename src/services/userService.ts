import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface NewUserPayload {
  nombre: string;
  apellidos: string;
  cedula: string;
  correo: string;
  password: string;
  telefono?: string;
  rol_id: number;
  especialidad_id?: number;
}

export type UpdateUserPayload = Partial<NewUserPayload>;

export const useUserService = () => {
  const api = useApi();

  const list = (params?: { per_page?: number; page?: number }) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.USERS.LIST, { params });

  const show = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.USERS.SHOW(id));

  const create = (payload: NewUserPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.USERS.CREATE, {
      method: "POST",
      body: payload,
    });

  const update = (id: number | string, payload: UpdateUserPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.USERS.UPDATE(id), {
      method: "PUT",
      body: payload,
    });

  const remove = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.USERS.DELETE(id), {
      method: "DELETE",
    });

  const activar = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.USERS.ACTIVAR(id), {
      method: "PUT",
    });

  const desactivar = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.USERS.DESACTIVAR(id), {
      method: "PUT",
    });

  const medicos = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.USERS.MEDICOS);

  const roles = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ADMIN.ROLES);

  const especialidades = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ADMIN.ESPECIALIDADES);

  return {
    ...api,
    list,
    show,
    create,
    update,
    remove,
    activar,
    desactivar,
    medicos,
    roles,
    especialidades,
  };
};
