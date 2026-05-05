import { useEffect, useState } from "react";
import {
  HiOutlineDocumentReport,
  HiOutlineDocumentDownload,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDashboardService } from "@/services";
import type { DashboardMetrics } from "@/services/dashboardService";

export default function ReportsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);

  const { metrics, isLoading: isLoadingMetrics } = useDashboardService();

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await metrics();
      if (response?.data) {
        setDashboardData(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching dashboard metrics:", err);
    }
  };

  return (
    <div className="min-h-full font-sans space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base flex items-center gap-2 animate-fade-in">
            <HiOutlineDocumentReport className="text-clinic-primary" />
            Supervisión y Reportes
          </h1>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-1 animate-fade-in">
            Indicadores generales del mes y desempeño por especialidad.
          </p>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {[
          {
            title: "Pacientes Totales",
            value: isLoadingMetrics
              ? "..."
              : dashboardData?.kpis.total_pacientes.toString() || "0",
            trend: "En base de datos",
            color: "text-blue-600",
          },
          {
            title: "Terapias (Mes)",
            value: isLoadingMetrics
              ? "..."
              : dashboardData?.kpis.terapias_mes_actual.toString() || "0",
            trend: "Realizadas este mes",
            color: "text-green-600",
          },
          {
            title: "Citas Pendientes",
            value: isLoadingMetrics
              ? "..."
              : dashboardData?.kpis.citas_pendientes.toString() || "0",
            trend: "Por atender",
            color: "text-orange-600",
          },
          {
            title: "Médicos Activos",
            value: isLoadingMetrics
              ? "..."
              : dashboardData?.kpis.medicos_activos.toString() || "0",
            trend: "Personal en servicio",
            color: "text-purple-600",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-clinic-card shadow-clinic-subtle border border-gray-100 flex flex-col justify-center hover:shadow-md transition-all h-[120px]"
          >
            <h3 className="text-sm font-semibold text-gray-500">{kpi.title}</h3>
            <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-2 font-medium">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Gráficos de Desempeño */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-clinic-card shadow-clinic-subtle border border-gray-100">
          <h3 className="text-lg font-bold text-clinic-text-base mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-clinic-primary rounded-full"></div>
            Terapias por Especialidad
          </h3>
          <div className="space-y-4">
            {isLoadingMetrics ? (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                Cargando datos...
              </div>
            ) : dashboardData?.graficos.terapias_por_especialidad.length ? (
              dashboardData.graficos.terapias_por_especialidad.map((esp, i) => {
                const max = Math.max(
                  ...dashboardData.graficos.terapias_por_especialidad.map(
                    (e) => e.total,
                  ),
                  1,
                );
                const percentage = (esp.total / max) * 100;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-clinic-text-base">
                      <span>{esp.especialidad}</span>
                      <span className="text-clinic-primary">
                        {esp.total} terapias
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-clinic-primary transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed border-gray-50 rounded-xl">
                No hay datos registrados este mes.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-clinic-card shadow-clinic-subtle border border-gray-100">
          <h3 className="text-lg font-bold text-clinic-text-base mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-clinic-primary rounded-full"></div>
            Top Profesionales del Mes
          </h3>
          <div className="space-y-3">
            {isLoadingMetrics ? (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                Cargando datos...
              </div>
            ) : dashboardData?.graficos.top_profesionales_mes.length ? (
              dashboardData.graficos.top_profesionales_mes.map((prof, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-clinic-primary/10 flex items-center justify-center text-clinic-primary text-xs font-bold">
                      {prof.nombre.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-clinic-text-base">
                      {prof.nombre}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-clinic-primary bg-clinic-primary/5 px-2 py-1 rounded-lg">
                      {prof.terapias_realizadas} evoluciones
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed border-gray-50 rounded-xl">
                No hay registros para este período.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acceso a la descarga de historias clínicas */}
      <Link
        to="/app/historias-descarga"
        className="block bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 p-6 hover:shadow-md hover:border-clinic-primary/30 transition-all animate-fade-in group"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-clinic-primary/10 text-clinic-primary group-hover:bg-clinic-primary group-hover:text-white transition-colors">
              <HiOutlineDocumentDownload size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-clinic-text-base">
                Descargar historias clínicas
              </h3>
              <p className="text-sm text-clinic-text-muted mt-1">
                Generación individual o por lotes (máx. 20 pacientes por ZIP).
              </p>
            </div>
          </div>
          <HiOutlineArrowRight
            className="text-clinic-text-muted group-hover:text-clinic-primary group-hover:translate-x-1 transition-all"
            size={24}
          />
        </div>
      </Link>
    </div>
  );
}
