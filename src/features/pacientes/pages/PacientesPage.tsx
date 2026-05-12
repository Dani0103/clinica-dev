import { useEffect, useMemo, useState } from "react";
import { HiOutlineSearch, HiChevronDown } from "react-icons/hi";
import { toast } from "react-toastify";
import { usePacienteService } from "@/services";
import type { EstadoPacienteFiltro } from "@/services/pacienteService";
import { useAuth } from "@/context/AuthContext";
import DataTable from "@/components/common/DataTable";
import PageLoader from "@/components/common/PageLoader";
import type { Column } from "@/types/tableData";
import NewTerapiaModal from "../components/NewTerapiaModal";
import PacienteHistoriaTabs from "../components/tabs/PacienteHistoriaTabs";

interface Paciente {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string;
  edad?: number;
  sexo: string;
  eps: string;
  esta_activo?: boolean;
  updated_at?: string;
  created_at?: string;
}

interface BalanceHoras {
  mes: string;
  horas_programadas: number;
  horas_ejecutadas: number;
  horas_disponibles: number;
  puede_registrar: boolean;
}

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPacienteFiltro>("activos");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [balance, setBalance] = useState<BalanceHoras | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [accionEstado, setAccionEstado] = useState(false);
  const [detallesAbiertos, setDetallesAbiertos] = useState(false);

  const { list, darAlta, reactivar, balanceHoras, isLoading } = usePacienteService();
  const { hasPermiso } = useAuth();
  const puedeGestionar = hasPermiso("pacientes.gestionar");

  const fetchPacientes = async (estado: EstadoPacienteFiltro = estadoFiltro) => {
    try {
      const response = await list({ per_page: 100, estado });
      if (response?.data) setPacientes(response.data);
    } catch (err: any) {
      toast.error(err?.message || "Error al cargar los pacientes");
    }
  };

  useEffect(() => {
    fetchPacientes(estadoFiltro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFiltro]);

  const fetchBalance = async (pacienteId: number) => {
    setLoadingBalance(true);
    try {
      const res = await balanceHoras(pacienteId);
      if (res?.data) {
        setBalance({
          mes: res.data.mes,
          horas_programadas: res.data.horas_programadas,
          horas_ejecutadas: res.data.horas_ejecutadas,
          horas_disponibles: res.data.horas_disponibles,
          puede_registrar: res.data.puede_registrar,
        });
      }
    } catch (err: any) {
      // No bloqueamos la vista del paciente si el balance falla
      setBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (selectedPaciente) {
      fetchBalance(selectedPaciente.id);
    } else {
      setBalance(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPaciente?.id, refreshKey]);

  const handleDarAlta = async () => {
    if (!selectedPaciente) return;
    if (!puedeGestionar) {
      toast.warning("No tienes permiso para dar de alta pacientes.");
      return;
    }
    if (!window.confirm(
      `¿Confirmas dar de alta a ${selectedPaciente.nombres} ${selectedPaciente.apellidos}? El historial clínico se conserva.`,
    )) return;

    setAccionEstado(true);
    try {
      await darAlta(selectedPaciente.id);
      toast.success("Paciente dado de alta correctamente.");
      setSelectedPaciente({ ...selectedPaciente, esta_activo: false });
      fetchPacientes();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo dar de alta al paciente.");
    } finally {
      setAccionEstado(false);
    }
  };

  const handleReactivar = async () => {
    if (!selectedPaciente) return;
    if (!puedeGestionar) {
      toast.warning("No tienes permiso para reactivar pacientes.");
      return;
    }
    setAccionEstado(true);
    try {
      await reactivar(selectedPaciente.id);
      toast.success("Paciente reactivado correctamente.");
      setSelectedPaciente({ ...selectedPaciente, esta_activo: true });
      fetchPacientes();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo reactivar al paciente.");
    } finally {
      setAccionEstado(false);
    }
  };

  const calcularEdad = (fecha?: string) => {
    if (!fecha) return "N/A";
    const diff = Date.now() - new Date(fecha).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
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

  const columns: Column<Paciente>[] = [
    { header: "Cédula", accessor: "cedula", className: "font-medium" },
    { header: "Nombre", accessor: (p) => `${p.nombres} ${p.apellidos}` },
    { header: "EPS", accessor: "eps" },
    {
      header: "Estado",
      accessor: (p) =>
        p.esta_activo === false ? (
          <span className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded-full uppercase">
            Dado de alta
          </span>
        ) : (
          <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full uppercase">
            Activo
          </span>
        ),
    },
    {
      header: "Acciones",
      className: "text-right",
      accessor: (p) => (
        <button
          onClick={() => setSelectedPaciente(p)}
          className="text-clinic-primary font-bold hover:underline transition-all"
        >
          Ver Detalle
        </button>
      ),
    },
  ];

  const formatearFecha = (fechaIso?: string) => {
    if (!fechaIso) return "N/A";
    return new Date(fechaIso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-full space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-3xl font-bold text-clinic-text-base leading-tight">
            {selectedPaciente ? "Historia Clínica del Paciente" : "Gestión de Pacientes"}
          </h1>
          <p className="text-xs sm:text-base text-clinic-text-muted mt-1 truncate">
            {selectedPaciente
              ? `Expediente clínico de ${selectedPaciente.nombres} ${selectedPaciente.apellidos}`
              : "Busca por documento o nombre para abrir un expediente."}
          </p>
        </div>

        {!selectedPaciente ? (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="inline-flex bg-gray-100 rounded-clinic-inner p-1 text-xs font-bold">
              {(["activos", "inactivos", "todos"] as EstadoPacienteFiltro[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setEstadoFiltro(e)}
                  className={`px-3 py-2 rounded-clinic-inner uppercase transition-all ${
                    estadoFiltro === e
                      ? "bg-white text-clinic-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {e === "activos" ? "Activos" : e === "inactivos" ? "Dados de alta" : "Todos"}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <HiOutlineSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Documento o nombre del paciente..."
                className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none bg-white"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setSelectedPaciente(null)}
            className="px-5 py-2.5 text-sm font-bold text-clinic-primary border-2 border-clinic-primary rounded-xl hover:bg-clinic-primary hover:text-white transition-all flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al listado
          </button>
        )}
      </div>

      {isLoading && pacientes.length === 0 ? (
        <PageLoader variant="page" text="Sincronizando con el servidor..." />
      ) : selectedPaciente ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 h-fit lg:sticky lg:top-6">
            <div className="flex items-center gap-3 sm:gap-4 lg:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-clinic-primary/20 to-clinic-primary/5 flex items-center justify-center text-clinic-primary font-bold text-lg sm:text-2xl shadow-inner shrink-0">
                {selectedPaciente.nombres[0]}
                {selectedPaciente.apellidos[0]}
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-clinic-text-base truncate">
                  {selectedPaciente.nombres}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                  CC: {selectedPaciente.cedula}
                </p>
              </div>
              {/* Toggle solo en móvil */}
              <button
                type="button"
                onClick={() => setDetallesAbiertos((v) => !v)}
                aria-label={detallesAbiertos ? "Ocultar detalles" : "Ver detalles"}
                aria-expanded={detallesAbiertos}
                className="lg:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-clinic-primary bg-clinic-primary/10 hover:bg-clinic-primary/20 transition-all"
              >
                <HiChevronDown
                  className={`w-5 h-5 transition-transform ${detallesAbiertos ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div className={`${detallesAbiertos ? "block" : "hidden"} lg:block mt-4 lg:mt-0 space-y-4 text-sm`}>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500">Estado</span>
                {selectedPaciente.esta_activo === false ? (
                  <span className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded-full uppercase">
                    Dado de alta
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full uppercase">
                    Activo
                  </span>
                )}
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500">Edad/Sexo</span>
                <span className="font-bold text-clinic-text-base">
                  {calcularEdad(selectedPaciente.fecha_nacimiento)} años,{" "}
                  {selectedPaciente.sexo}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500">EPS</span>
                <span className="font-bold text-clinic-text-base">
                  {selectedPaciente.eps}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-500">Registro</span>
                <span className="font-bold text-clinic-text-base">
                  {formatearFecha(selectedPaciente.created_at)}
                </span>
              </div>
            </div>

            {/* Balance de horas mensual */}
            <div className={`${detallesAbiertos ? "block" : "hidden"} lg:block mt-6 p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-clinic-primary/5 to-transparent`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  Balance del mes
                </span>
                {balance && (
                  <span className="text-[10px] text-gray-400 font-semibold">
                    {balance.mes}
                  </span>
                )}
              </div>
              {loadingBalance ? (
                <p className="text-xs text-gray-400 italic">Calculando…</p>
              ) : balance ? (
                <>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className={`text-2xl font-bold ${
                        balance.puede_registrar ? "text-clinic-primary" : "text-orange-500"
                      }`}
                    >
                      {balance.horas_ejecutadas}
                    </span>
                    <span className="text-sm text-gray-400 font-semibold">
                      / {balance.horas_programadas} sesiones
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        balance.puede_registrar ? "bg-clinic-primary" : "bg-orange-400"
                      }`}
                      style={{
                        width: `${
                          balance.horas_programadas > 0
                            ? Math.min(
                                100,
                                (balance.horas_ejecutadas / balance.horas_programadas) * 100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    {balance.puede_registrar
                      ? `${balance.horas_disponibles} sesión(es) disponible(s)`
                      : "Cupo del mes agotado — programa más citas"}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">Sin datos de balance.</p>
              )}
            </div>

            {puedeGestionar && (
              <div className={`${detallesAbiertos ? "block" : "hidden"} lg:block`}>
                {selectedPaciente.esta_activo === false ? (
                  <button
                    onClick={handleReactivar}
                    disabled={accionEstado}
                    className="w-full mt-6 font-bold py-2.5 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all disabled:opacity-50"
                  >
                    {accionEstado ? "Reactivando…" : "Reactivar paciente"}
                  </button>
                ) : (
                  <button
                    onClick={handleDarAlta}
                    disabled={accionEstado}
                    className="w-full mt-6 font-bold py-2.5 rounded-xl border-2 border-red-300 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    {accionEstado ? "Procesando…" : "Dar de alta"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <PacienteHistoriaTabs
              key={`${selectedPaciente.id}-${refreshKey}`}
              pacienteId={selectedPaciente.id}
              onNuevaTerapia={() => setIsModalOpen(true)}
              puedeRegistrarTerapia={selectedPaciente.esta_activo !== false}
            />
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-clinic-subtle">
          <DataTable data={filteredPatients} columns={columns} />
        </div>
      )}

      <NewTerapiaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paciente={selectedPaciente}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
          toast.success("Historial de terapias actualizado");
        }}
      />
    </div>
  );
}
