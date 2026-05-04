import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface NewPacientePayload {
  tipo_documento: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string;
  sexo: string;
  direccion?: string;
  barrio?: string;
  telefono?: string;
  correo?: string;
  ocupacion?: string;
  eps: string;
  regimen_salud?: string;
  categoria_eps?: string;
  nombre_responsable?: string;
  telefono_responsable?: string;
  parentesco_responsable?: string;
}

export const usePacienteService = () => {
  const api = useApi();

  const list = (params?: { per_page?: number; page?: number; q?: string }) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.LIST, { params });

  const show = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.SHOW(id));

  const create = (payload: NewPacientePayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.CREATE, {
      method: "POST",
      body: payload,
    });

  const remove = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.DELETE(id), {
      method: "DELETE",
    });

  const descargarPlantilla = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.PLANTILLA_EXCEL, {
      responseType: "blob",
    });

  const importarPacientes = (file: File) => {
    const formData = new FormData();
    formData.append("archivo", file);
    return api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.IMPORTAR_EXCEL, {
      method: "POST",
      body: formData,
    });
  };

  return { ...api, list, show, create, remove, descargarPlantilla, importarPacientes };
};
