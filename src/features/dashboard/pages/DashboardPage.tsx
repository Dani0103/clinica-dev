import KpiCard from "@/features/dashboard/pages/KpiCard";
import StatusItem from "@/features/dashboard/pages/StatusItem";

function DashboardPage() {
  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel principal</h1>
        <p className="text-sm text-gray-500">
          Resumen general de la información del sistema
        </p>
      </div>

      {/* KPIs / Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total registros" value="—" />
        <KpiCard title="Elementos activos" value="—" />
        <KpiCard title="Pendientes" value="—" />
        <KpiCard title="Alertas" value="—" highlight />
      </div>

      {/* Secciones principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen / Actividad */}
        <div className="lg:col-span-2 bg-white border rounded-lg p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Resumen reciente</h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Última actualización registrada</span>
              <span className="text-gray-400">—</span>
            </li>
            <li className="flex justify-between">
              <span>Cambios recientes en el sistema</span>
              <span className="text-gray-400">—</span>
            </li>
            <li className="flex justify-between">
              <span>Eventos relevantes</span>
              <span className="text-gray-400">—</span>
            </li>
          </ul>
        </div>

        {/* Estado del sistema */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Estado general</h2>

          <div className="space-y-3 text-sm">
            <StatusItem label="Servicios" status="ok" />
            <StatusItem label="Procesos" status="ok" />
            <StatusItem label="Integraciones" status="warning" />
            <StatusItem label="Notificaciones" status="error" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
