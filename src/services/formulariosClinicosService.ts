import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface HistoriaIngresoPayload {
  paciente_id: number;
  motivo_consulta: string;
  enfermedad_actual?: string;
  antecedentes?: string;
  examen_fisico?: string;
  diagnostico?: string;
  plan?: string;
  [key: string]: any;
}

export interface ConsentimientoPayload {
  paciente_id: number;
  tipo: string;
  contenido: string;
  firma_paciente?: string;
  firma_responsable?: string;
}

export interface OrdenMedicaPayload {
  paciente_id: number;
  descripcion: string;
  medicamentos?: string;
  examenes?: string;
  observaciones?: string;
}

export interface ConsultaEspecialistaPayload {
  paciente_id: number;
  especialidad_id: number;
  motivo: string;
  observaciones?: string;
}

export interface EscalaWeefimPayload {
  paciente_id: number;
  puntuaciones: Record<string, number>;
  observaciones?: string;
}

const buildResource = <TPayload>(endpoints: { LIST: string; CREATE: string }) =>
  () => {
    const api = useApi();

    const list = (params?: Record<string, any>) =>
      api.execute(AppUrls.avanzarApi, endpoints.LIST, { params });

    const create = (payload: TPayload) =>
      api.execute(AppUrls.avanzarApi, endpoints.CREATE, {
        method: "POST",
        body: payload,
      });

    return { ...api, list, create };
  };

export const useHistoriaIngresoService = buildResource<HistoriaIngresoPayload>(
  API_ENDPOINTS.HISTORIAS_INGRESO,
);

export const useConsentimientoService = buildResource<ConsentimientoPayload>(
  API_ENDPOINTS.CONSENTIMIENTOS,
);

export const useOrdenMedicaService = buildResource<OrdenMedicaPayload>(
  API_ENDPOINTS.ORDENES_MEDICAS,
);

export const useConsultaEspecialistaService = buildResource<ConsultaEspecialistaPayload>(
  API_ENDPOINTS.CONSULTAS_ESPECIALISTAS,
);

export const useEscalaWeefimService = buildResource<EscalaWeefimPayload>(
  API_ENDPOINTS.ESCALAS_WEEFIM,
);
