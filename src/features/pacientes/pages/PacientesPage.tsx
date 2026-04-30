import { useEffect, useMemo, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { toast } from "react-toastify";
import { usePacienteService } from "@/services";
import DataTable from "@/components/common/DataTable";
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
  updated_at?: string;
  created_at?: string;
}

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { list, isLoading } = usePacienteService();

  const fetchPacientes = async () => {
    try {
      const response = await list({ per_page: 100 });
      if (response?.data) setPacientes(response.data);
    } catch (err: any) {
      toast.error(err?.message || "Error al cargar los pacientes");
    }
  };

  useEffect(() => {
    fetchPacientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="p-6 min-h-full space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base">
            {selectedPaciente ? "Historia Clínica del Paciente" : "Gestión de Pacientes"}
          </h1>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-1">
            {selectedPaciente
              ? `Expediente clínico de ${selectedPaciente.nombres} ${selectedPaciente.apellidos}`
              : "Busca por documento o nombre para abrir un expediente."}
          </p>
        </div>

        {!selectedPaciente ? (
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
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-clinic-primary mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Sincronizando con el servidor...</p>
        </div>
      ) : selectedPaciente ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-fit sticky top-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-clinic-primary/20 to-clinic-primary/5 flex items-center justify-center text-clinic-primary font-bold text-2xl shadow-inner">
                {selectedPaciente.nombres[0]}
                {selectedPaciente.apellidos[0]}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xl font-bold text-clinic-text-base truncate">
                  {selectedPaciente.nombres}
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  CC: {selectedPaciente.cedula}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
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

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-8 bg-clinic-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-clinic-primary/20 hover:bg-clinic-primary-light transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nueva terapia
            </button>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <PacienteHistoriaTabs
              key={`${selectedPaciente.id}-${refreshKey}`}
              pacienteId={selectedPaciente.id}
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
