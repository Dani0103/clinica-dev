import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface HistoriaIngresoPayload {
  paciente_id: number;
  motivo_consulta: string;
  enfermedad_actual: string;
  anamnesis: string;
  ant_personales?: string;
  ant_familiares?: string;
  ant_quirurgicos?: string;
  ant_patologicos?: string;
  ant_farmacologicos?: string;
  /** Mantenemos el typo del backend (`ant_ginecolologicos`) para alinear el contrato. */
  ant_ginecolologicos?: string;
  impresion_diagnostica: string;
  origen_enfermedad: string;
  plan_tratamiento: string;
  pronostico: string;
}

export type EstadoConsentimiento = "Firmado" | "Rechazado" | "Pendiente";

export interface ConsentimientoPayload {
  paciente_id: number;
  tipo_consentimiento: string;
  estado: EstadoConsentimiento;
  firmado_por_representante: boolean;
  nombre_firmante?: string;
  documento_firmante?: string;
  /** ISO date (YYYY-MM-DD) */
  fecha_firma: string;
}

export interface OrdenMedicaPayload {
  paciente_id: number;
  descripcion: string;
  /** ISO date (YYYY-MM-DD) */
  fecha_orden: string;
}

export interface ConsultaEspecialistaPayload {
  paciente_id: number;
  especialidad_id: number;
  motivo_consulta: string;
  examen_mental?: string;
  diagnostico: string;
  concepto: string;
  escala_eeag?: string;
  firma_electronica: string;
}

export interface EscalaWeefimPayload {
  paciente_id: number;
  /** ISO date (YYYY-MM-DD) */
  fecha_evaluacion: string;
  subtotal_autocuidado: number;
  subtotal_movilidad: number;
  subtotal_cognicion: number;
}

const buildResource =
  <TPayload>(endpoints: { LIST: string; CREATE: string }) =>
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

export const useConsultaEspecialistaService =
  buildResource<ConsultaEspecialistaPayload>(API_ENDPOINTS.CONSULTAS_ESPECIALISTAS);

export const useEscalaWeefimService = buildResource<EscalaWeefimPayload>(
  API_ENDPOINTS.ESCALAS_WEEFIM,
);
