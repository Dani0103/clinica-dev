import { useEffect, useState, useMemo } from "react";
import { HiOutlineDownload, HiOutlineDocumentReport, HiOutlineSearch } from "react-icons/hi";
import { toast } from "react-toastify";
import { usePacienteService, usePdfService, useDashboardService } from "@/services";
import type { DashboardMetrics } from "@/services/dashboardService";

interface Paciente {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  eps: string;
  horasMes?: number; // These might be optional if not yet implemented in backend
  horasObjetivo?: number;
}

export default function ReportsPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);

  const { list, isLoading: isLoadingPacientes } = usePacienteService();
  const { exportarHistoria, exportarHistoriasMasivo, isLoading: isExporting } = usePdfService();
  const { metrics, isLoading: isLoadingMetrics } = useDashboardService();

  useEffect(() => {
    fetchPacientes();
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPacientes = async () => {
    try {
      const response = await list({ per_page: 100 });
      if (response?.data) {
        // Mapping to ensure we have the structure we need, adding mock hours if not present
        const mapped = response.data.map((p: any) => ({
          ...p,
          horasMes: p.horasMes ?? Math.floor(Math.random() * 20), // Placeholder if not in backend
          horasObjetivo: p.horasObjetivo ?? 20, // Placeholder if not in backend
        }));
        setPacientes(mapped);
      }
    } catch (err: any) {
      toast.error(err?.message || "Error al cargar los pacientes");
    }
  };

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

  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return pacientes;
    return pacientes.filter(
      (p) =>
        p.cedula.toLowerCase().includes(q) ||
        `${p.nombres} ${p.apellidos}`.toLowerCase().includes(q),
    );
  }, [searchTerm, pacientes]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPatients(filteredPatients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (id: number) => {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(selectedPatients.filter(pid => pid !== id));
    } else {
      setSelectedPatients([...selectedPatients, id]);
    }
  };

  const handleDownloadSingle = async (p: Paciente) => {
    try {
      await exportarHistoria(p.id, `historia_${p.nombres}_${p.apellidos}.pdf`);
      toast.success(`Historia de ${p.nombres} descargada correctamente.`);
    } catch (error: any) {
      toast.error(error?.message || "Error al descargar la historia.");
    }
  };

  const handleGenerateZIP = async () => {
    if (selectedPatients.length === 0) {
      toast.warning("Seleccione al menos un paciente para generar el reporte.");
      return;
    }

    // Check if any selected patient hasn't completed their hours
    const incomplete = pacientes.filter(p => selectedPatients.includes(p.id) && (p.horasMes || 0) < (p.horasObjetivo || 20));
    if (incomplete.length > 0) {
      const confirm = window.confirm(`Hay ${incomplete.length} paciente(s) que no han cumplido sus horas objetivo. ¿Desea generar el reporte de todas formas? (Requiere aprobación del coordinador)`);
      if (!confirm) return;
    }

    setIsGenerating(true);
    try {
      const selectedData = pacientes
        .filter(p => selectedPatients.includes(p.id))
        .map(p => ({ id: p.id, nombre: `${p.nombres} ${p.apellidos}` }));
      
      await exportarHistoriasMasivo(selectedData);
      toast.success(`Se ha generado un archivo ZIP con ${selectedPatients.length} historias clínicas.`);
      setSelectedPatients([]); // clear selection
    } catch (error: any) {
      toast.error(error?.message || "Error al generar el archivo ZIP.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className=" min-h-full font-sans space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base flex items-center gap-2 animate-fade-in">
            <HiOutlineDocumentReport className="text-clinic-primary" />
            Supervisión y Reportes
          </h1>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-1 animate-fade-in">Generación de historias clínicas en PDF y seguimiento de horas evolucionadas.</p>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {[
          { 
            title: "Pacientes Totales", 
            value: isLoadingMetrics ? "..." : dashboardData?.kpis.total_pacientes.toString() || "0", 
            trend: "En base de datos", 
            color: "text-blue-600", 
            bg: "bg-blue-50" 
          },
          { 
            title: "Terapias (Mes)", 
            value: isLoadingMetrics ? "..." : dashboardData?.kpis.terapias_mes_actual.toString() || "0", 
            trend: "Realizadas este mes", 
            color: "text-green-600", 
            bg: "bg-green-50" 
          },
          { 
            title: "Citas Pendientes", 
            value: isLoadingMetrics ? "..." : dashboardData?.kpis.citas_pendientes.toString() || "0", 
            trend: "Por atender", 
            color: "text-orange-600", 
            bg: "bg-orange-50" 
          },
          { 
            title: "Médicos Activos", 
            value: isLoadingMetrics ? "..." : dashboardData?.kpis.medicos_activos.toString() || "0", 
            trend: "Personal en servicio", 
            color: "text-purple-600", 
            bg: "bg-purple-50" 
          },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-clinic-card shadow-clinic-subtle border border-gray-100 flex flex-col justify-center hover:shadow-md transition-all h-[120px]">
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
               <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Cargando datos...</div>
            ) : dashboardData?.graficos.terapias_por_especialidad.length ? (
              dashboardData.graficos.terapias_por_especialidad.map((esp, i) => {
                const max = Math.max(...dashboardData.graficos.terapias_por_especialidad.map(e => e.total), 1);
                const percentage = (esp.total / max) * 100;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-clinic-text-base">
                      <span>{esp.especialidad}</span>
                      <span className="text-clinic-primary">{esp.total} terapias</span>
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
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed border-gray-50 rounded-xl">No hay datos registrados este mes.</div>
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
               <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Cargando datos...</div>
            ) : dashboardData?.graficos.top_profesionales_mes.length ? (
              dashboardData.graficos.top_profesionales_mes.map((prof, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-clinic-primary/10 flex items-center justify-center text-clinic-primary text-xs font-bold">
                      {prof.nombre.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-clinic-text-base">{prof.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-clinic-primary bg-clinic-primary/5 px-2 py-1 rounded-lg">
                      {prof.terapias_realizadas} evoluciones
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed border-gray-50 rounded-xl">No hay registros para este período.</div>
            )}
          </div>
        </div>
      </div>

      {/* Pacientes para PDF */}
      <div className="bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 overflow-hidden flex flex-col animate-fade-in">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <HiOutlineSearch className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-clinic-inner w-full sm:w-64 focus:border-clinic-primary focus:ring-1 focus:ring-clinic-primary outline-none bg-white transition-all"
            />
          </div>
          <button
            onClick={handleGenerateZIP}
            disabled={isGenerating || isExporting || selectedPatients.length === 0}
            className={`flex items-center gap-2 px-5 py-2 text-white font-bold rounded-clinic-inner transition-all shadow-md text-sm ${isGenerating || isExporting || selectedPatients.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-clinic-primary hover:bg-opacity-90 transform hover:scale-[1.02]'}`}
          >
            {isGenerating || (isExporting && selectedPatients.length > 1) ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineDownload size={18} />
            )}
            {isGenerating || (isExporting && selectedPatients.length > 1) ? 'Generando ZIP...' : `Descargar PDFs (${selectedPatients.length})`}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-clinic-text-base">
            <thead className="bg-gray-50 text-clinic-text-muted text-[11px] uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-clinic-primary rounded border-gray-300 focus:ring-clinic-primary"
                    checked={filteredPatients.length > 0 && selectedPatients.length === filteredPatients.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Cédula</th>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">EPS</th>
                <th className="px-6 py-4 text-center">Horas Evolucionadas</th>
                <th className="px-6 py-4 text-center">Estado Mensual</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPacientes ? (
                 <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-gray-100 border-t-clinic-primary rounded-full animate-spin mb-3"></div>
                      <p className="text-sm font-medium text-gray-500">Cargando pacientes...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredPatients.map(p => {
                    const isComplete = (p.horasMes || 0) >= (p.horasObjetivo || 20);
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-clinic-primary rounded border-gray-300 focus:ring-clinic-primary"
                            checked={selectedPatients.includes(p.id)}
                            onChange={() => handleSelectPatient(p.id)}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{p.cedula}</td>
                        <td className="px-6 py-4 font-bold">{p.nombres} {p.apellidos}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">{p.eps}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-bold ${isComplete ? 'text-green-600' : 'text-orange-500'}`}>
                            {p.horasMes}h
                          </span>
                          <span className="text-gray-400 text-xs ml-1 font-semibold">/ {p.horasObjetivo}h</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isComplete ? (
                            <span className="text-[10px] bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full uppercase">Completo</span>
                          ) : (
                            <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full uppercase">Incompleto</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDownloadSingle(p)}
                            title="Descargar Historia"
                            className="text-clinic-primary hover:text-clinic-primary-light transition-colors p-1"
                          >
                            <HiOutlineDownload size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-clinic-text-muted">
                          <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <p className="text-sm font-bold text-gray-500">No se encontraron pacientes</p>
                          <p className="text-xs text-gray-400 mt-1">Intenta con otro término de búsqueda.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
