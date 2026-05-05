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

export type EstadoPacienteFiltro = "activos" | "inactivos" | "todos";

export interface ListPacientesParams {
  per_page?: number;
  page?: number;
  q?: string;
  estado?: EstadoPacienteFiltro;
}

export interface BalanceHorasResponse {
  status: "success" | "error";
  data?: {
    paciente_id: number;
    mes: string;
    horas_programadas: number;
    horas_ejecutadas: number;
    horas_disponibles: number;
    puede_registrar: boolean;
  };
  message?: string;
}

export const usePacienteService = () => {
  const api = useApi();

  const list = (params?: ListPacientesParams) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.LIST, {
      params: params as Record<string, any> | undefined,
    });

  const show = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.SHOW(id));

  const create = (payload: NewPacientePayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.CREATE, {
      method: "POST",
      body: payload,
    });

  /**
   * DELETE en backend equivale a desactivar (llama a darAlta internamente).
   * Mantener por compatibilidad; preferir `darAlta` para claridad semántica.
   */
  const remove = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.DELETE(id), {
      method: "DELETE",
    });

  const darAlta = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.ALTA(id), {
      method: "PUT",
    });

  const reactivar = (id: number | string) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.REACTIVAR(id), {
      method: "PUT",
    });

  /** mes en formato YYYY-MM. Si se omite, backend usa mes actual. */
  const balanceHoras = (
    id: number | string,
    mes?: string,
  ): Promise<BalanceHorasResponse> =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.BALANCE_HORAS(id), {
      params: mes ? { mes } : undefined,
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

  return {
    ...api,
    list,
    show,
    create,
    remove,
    darAlta,
    reactivar,
    balanceHoras,
    descargarPlantilla,
    importarPacientes,
  };
};
