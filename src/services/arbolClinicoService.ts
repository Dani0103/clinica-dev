import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface ObjetivoPayload {
  nombre: string;
  descripcion?: string;
  especialidad_id?: number | null;
}

export interface ActividadPayload {
  objetivo_id: number;
  nombre: string;
}

export interface RespuestaPayload {
  actividad_id: number;
  texto_predeterminado: string;
}

export const useObjetivoService = () => {
  const api = useApi();

  const list = (especialidadId?: number | null) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.OBJETIVOS.LIST, {
      params: especialidadId ? { especialidad_id: especialidadId } : undefined,
    });

  const show = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.OBJETIVOS.SHOW(id));

  const create = (payload: ObjetivoPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.OBJETIVOS.CREATE, {
      method: "POST",
      body: payload,
    });

  const update = (id: number | string, payload: Partial<ObjetivoPayload>) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.OBJETIVOS.UPDATE(id), {
      method: "PUT",
      body: payload,
    });

  const remove = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.OBJETIVOS.DELETE(id), {
      method: "DELETE",
    });

  return { ...api, list, show, create, update, remove };
};

export const useActividadService = () => {
  const api = useApi();

  const create = (payload: ActividadPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ACTIVIDADES.CREATE, {
      method: "POST",
      body: payload,
    });

  const update = (id: number | string, payload: Partial<ActividadPayload>) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ACTIVIDADES.UPDATE(id), {
      method: "PUT",
      body: payload,
    });

  const remove = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.ACTIVIDADES.DELETE(id), {
      method: "DELETE",
    });

  return { ...api, create, update, remove };
};

export const useRespuestaService = () => {
  const api = useApi();

  const create = (payload: RespuestaPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.RESPUESTAS.CREATE, {
      method: "POST",
      body: payload,
    });

  const update = (id: number | string, payload: Partial<RespuestaPayload>) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.RESPUESTAS.UPDATE(id), {
      method: "PUT",
      body: payload,
    });

  const remove = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.RESPUESTAS.DELETE(id), {
      method: "DELETE",
    });

  return { ...api, create, update, remove };
};
