import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineDocumentDownload,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { usePacienteService, usePdfService } from "@/services";
import PageLoader from "@/components/common/PageLoader";

interface Paciente {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  eps: string;
  esta_activo?: boolean;
  horasMes?: number;
  horasObjetivo?: number;
}

/** Tope de descarga simultánea (CL-9 — proteger equipos de la clínica). */
const MAX_DESCARGA_LOTE = 20;

/** Llamadas concurrentes máximas a balance-horas. Más alto = más rápido pero
 * satura el backend. 6 funciona bien con 50–200 pacientes. */
const BALANCE_CONCURRENCY = 6;

export default function HistoriasDescargaPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingList, setIsLoadingList] = useState(false);
  /** IDs de pacientes cuyo balance aún se está cargando. */
  const [loadingBalances, setLoadingBalances] = useState<Set<number>>(new Set());

  const { list, balanceHoras } = usePacienteService();
  const { exportarHistoria, exportarHistoriasMasivo, isLoading: isExporting } = usePdfService();

  useEffect(() => {
    fetchPacientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPacientes = async () => {
    setIsLoadingList(true);
    try {
      const response = await list({ per_page: 100 });
      if (response?.data) {
        const base: Paciente[] = response.data.map((p: any) => ({
          ...p,
          horasMes: undefined,
          horasObjetivo: undefined,
        }));
        // Mostrar la tabla de inmediato — los balances se llenan después.
        setPacientes(base);
        setIsLoadingList(false);
        loadBalancesIncremental(base);
      } else {
        setIsLoadingList(false);
      }
    } catch (err: any) {
      setIsLoadingList(false);
      toast.error(err?.message || "Error al cargar los pacientes");
    }
  };

  /**
   * Carga el balance de horas paciente por paciente con concurrencia limitada.
   * Cada respuesta actualiza solo la fila correspondiente — la tabla queda
   * usable mientras los datos siguen llegando en segundo plano.
   */
  const loadBalancesIncremental = async (lista: Paciente[]) => {
    setLoadingBalances(new Set(lista.map((p) => p.id)));
    const queue = [...lista];

    const worker = async () => {
      while (queue.length > 0) {
        const p = queue.shift();
        if (!p) break;
        try {
          const res = await balanceHoras(p.id);
          if (res?.data) {
            const ejecutadas = res.data.horas_ejecutadas;
            const programadas = res.data.horas_programadas;
            setPacientes((prev) =>
              prev.map((x) =>
                x.id === p.id
                  ? { ...x, horasMes: ejecutadas, horasObjetivo: programadas }
                  : x,
              ),
            );
          }
        } catch {
          // Si falla el balance de un paciente, queda con "—".
        } finally {
          setLoadingBalances((prev) => {
            const next = new Set(prev);
            next.delete(p.id);
            return next;
          });
        }
      }
    };

    await Promise.all(
      Array.from({ length: BALANCE_CONCURRENCY }, () => worker()),
    );
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
      const ids = filteredPatients.slice(0, MAX_DESCARGA_LOTE).map((p) => p.id);
      if (filteredPatients.length > MAX_DESCARGA_LOTE) {
        toast.info(
          `Se seleccionaron los primeros ${MAX_DESCARGA_LOTE} pacientes. Para volúmenes mayores procesa en lotes.`,
        );
      }
      setSelectedPatients(ids);
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (id: number) => {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(selectedPatients.filter((pid) => pid !== id));
    } else {
      if (selectedPatients.length >= MAX_DESCARGA_LOTE) {
        toast.warning(
          `Máximo ${MAX_DESCARGA_LOTE} pacientes por lote. Deselecciona alguno antes de añadir otro.`,
        );
        return;
      }
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

    if (selectedPatients.length > MAX_DESCARGA_LOTE) {
      toast.error(
        `Máximo ${MAX_DESCARGA_LOTE} historias por lote para no saturar el equipo.`,
      );
      return;
    }

    const incomplete = pacientes.filter(
      (p) =>
        selectedPatients.includes(p.id) &&
        p.horasObjetivo !== undefined &&
        (p.horasMes ?? 0) < (p.horasObjetivo ?? 0),
    );
    if (incomplete.length > 0) {
      const confirm = window.confirm(
        `Hay ${incomplete.length} paciente(s) que no han cumplido el cupo mensual. ¿Generar el reporte de todas formas? (Requiere aprobación del coordinador)`,
      );
      if (!confirm) return;
    }

    setIsGenerating(true);
    try {
      const selectedData = pacientes
        .filter((p) => selectedPatients.includes(p.id))
        .map((p) => ({ id: p.id, nombre: `${p.nombres} ${p.apellidos}` }));

      await exportarHistoriasMasivo(selectedData);
      toast.success(
        `Se ha generado un archivo ZIP con ${selectedPatients.length} historias clínicas.`,
      );
      setSelectedPatients([]);
    } catch (error: any) {
      toast.error(error?.message || "Error al generar el archivo ZIP.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-full font-sans space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base flex items-center gap-2 animate-fade-in">
            <HiOutlineDocumentDownload className="text-clinic-primary" />
            Descarga de Historias Clínicas
          </h1>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-1 animate-fade-in">
            Descarga individual o por lotes (máx. {MAX_DESCARGA_LOTE} pacientes por
            ZIP).
          </p>
        </div>
        <Link
          to="/app/reportes"
          className="text-sm font-bold text-clinic-primary hover:underline"
        >
          ← Volver a Supervisión
        </Link>
      </div>

      {/* Resumen de selección */}
      <div className="bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="text-sm text-clinic-text-muted">
          <span className="font-bold text-clinic-text-base">
            {selectedPatients.length}
          </span>{" "}
          de <span className="font-bold">{MAX_DESCARGA_LOTE}</span> seleccionados ·{" "}
          <span className="text-gray-400">
            {pacientes.length} pacientes disponibles
          </span>
          {loadingBalances.size > 0 && (
            <span className="ml-3 inline-flex items-center gap-1.5 text-[11px] text-clinic-text-muted">
              <div className="w-3 h-3 border-2 border-gray-200 border-t-clinic-primary rounded-full animate-spin" />
              Calculando sesiones del mes ({loadingBalances.size} restantes)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedPatients.length > 0 && (
            <button
              onClick={() => setSelectedPatients([])}
              className="px-3 py-2 text-xs font-bold text-clinic-text-muted hover:text-clinic-text-base border border-gray-200 rounded-clinic-inner hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={handleGenerateZIP}
            disabled={isGenerating || isExporting || selectedPatients.length === 0}
            className={`flex items-center gap-2 px-5 py-2 text-white font-bold rounded-clinic-inner transition-all shadow-md text-sm ${
              isGenerating || isExporting || selectedPatients.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-clinic-primary hover:bg-opacity-90 transform hover:scale-[1.02]"
            }`}
          >
            {isGenerating || (isExporting && selectedPatients.length > 1) ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineDownload size={18} />
            )}
            {isGenerating || (isExporting && selectedPatients.length > 1)
              ? "Generando ZIP..."
              : `Descargar ZIP (${selectedPatients.length})`}
          </button>
        </div>
      </div>

      {/* Tabla de pacientes */}
      <div className="bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 overflow-hidden flex flex-col animate-fade-in">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 w-full sm:max-w-md relative">
            <HiOutlineSearch className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por documento o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-clinic-inner w-full focus:border-clinic-primary focus:ring-1 focus:ring-clinic-primary outline-none bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-clinic-text-base">
            <thead className="bg-gray-50 text-clinic-text-muted text-[11px] uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-clinic-primary rounded border-gray-300 focus:ring-clinic-primary"
                    checked={
                      filteredPatients.length > 0 &&
                      selectedPatients.length ===
                        Math.min(filteredPatients.length, MAX_DESCARGA_LOTE)
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Cédula</th>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">EPS</th>
                <th className="px-6 py-4 text-center">Sesiones del mes</th>
                <th className="px-6 py-4 text-center">Estado mensual</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingList ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4">
                    <PageLoader variant="inline" text="Cargando pacientes..." />
                  </td>
                </tr>
              ) : (
                <>
                  {filteredPatients.map((p) => {
                    const cargandoBalance = loadingBalances.has(p.id);
                    const sinDatos =
                      p.horasObjetivo === undefined || p.horasMes === undefined;
                    const isComplete =
                      !sinDatos && (p.horasMes ?? 0) >= (p.horasObjetivo ?? 0);
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-clinic-primary rounded border-gray-300 focus:ring-clinic-primary"
                            checked={selectedPatients.includes(p.id)}
                            onChange={() => handleSelectPatient(p.id)}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{p.cedula}</td>
                        <td className="px-6 py-4 font-bold">
                          {p.nombres} {p.apellidos}
                          {p.esta_activo === false && (
                            <span className="ml-2 text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-full uppercase">
                              Dado de alta
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">
                            {p.eps}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {cargandoBalance ? (
                            <div className="inline-flex items-center justify-center">
                              <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-clinic-primary rounded-full animate-spin" />
                            </div>
                          ) : sinDatos ? (
                            <span className="text-gray-300 text-xs font-semibold">—</span>
                          ) : (
                            <>
                              <span
                                className={`font-bold ${isComplete ? "text-green-600" : "text-orange-500"}`}
                              >
                                {p.horasMes}
                              </span>
                              <span className="text-gray-400 text-xs ml-1 font-semibold">
                                / {p.horasObjetivo}
                              </span>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {cargandoBalance ? (
                            <span className="text-[10px] bg-gray-50 text-gray-400 font-bold px-3 py-1 rounded-full uppercase animate-pulse">
                              Calculando…
                            </span>
                          ) : sinDatos ? (
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-3 py-1 rounded-full uppercase">
                              Sin datos
                            </span>
                          ) : isComplete ? (
                            <span className="text-[10px] bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full uppercase">
                              Completo
                            </span>
                          ) : (
                            <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full uppercase">
                              Incompleto
                            </span>
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
                          <svg
                            className="w-12 h-12 text-gray-300 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <p className="text-sm font-bold text-gray-500">
                            No se encontraron pacientes
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Intenta con otro término de búsqueda.
                          </p>
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
