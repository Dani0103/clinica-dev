import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface DashboardKpis {
  total_pacientes: number;
  terapias_mes_actual: number;
  citas_pendientes: number;
  medicos_activos: number;
}

export interface DashboardMetrics {
  kpis: DashboardKpis;
  graficos: {
    terapias_por_especialidad: { especialidad: string; total: number }[];
    top_profesionales_mes: { nombre: string; terapias_realizadas: number }[];
  };
}

export const useDashboardService = () => {
  const api = useApi<{ status: string; data: DashboardMetrics }>();

  const metrics = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.DASHBOARD.METRICS);

  return { ...api, metrics };
};
