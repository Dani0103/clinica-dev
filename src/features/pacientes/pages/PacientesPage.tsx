import React, { useState, useEffect, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";
import { toast } from "react-toastify";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/types/tableData";
import NewTerapiaModal from "../components/NewTerapiaModal";

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
  const [historialTerapias, setHistorialTerapias] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { execute, isLoading } = useApi();

  useEffect(() => {
    fetchPacientes();
    fetchTerapias();
  }, []);

  const fetchPacientes = async () => {
    try {
      const response = await execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.LIST, { method: "GET" });
      if (response && response.data) setPacientes(response.data);
    } catch (error) {
      toast.error("Error al cargar los pacientes");
    }
  };

  const fetchTerapias = async () => {
    try {
      const response = await execute(AppUrls.avanzarApi, API_ENDPOINTS.CLINIC.TERAPIAS, { method: "GET" });
      if (response && response.data) setHistorialTerapias(response.data);
    } catch (error) { /* Silencioso */ }
  };

  const calcularEdad = (fecha?: string) => {
    if (!fecha) return "N/A";
    const diff = Date.now() - new Date(fecha).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return pacientes;
    return pacientes.filter(p =>
      p.cedula.includes(searchTerm) ||
      `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
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
        >Ver Detalle</button>
      )
    }
  ];

  const terapiasDelPaciente = selectedPaciente
    ? historialTerapias.filter(t => t.paciente_id === selectedPaciente.id)
    : [];

  const formatearFecha = (fechaIso?: string) => {
    if (!fechaIso) return "N/A";
    return new Date(fechaIso).toLocaleString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true
    });
  };

  return (
    <div className="p-6 min-h-full space-y-6 animate-fade-in">
      {/* Header Dinámico */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base">
            {selectedPaciente ? "Evolución del Paciente" : "Gestión de Pacientes"}
          </h1>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-1">
            {selectedPaciente
              ? `Expediente clínico de ${selectedPaciente.nombres} ${selectedPaciente.apellidos}`
              : "Busca y gestiona la información de todos los pacientes."}
          </p>
        </div>

        {!selectedPaciente ? (
          <div className="relative w-full md:w-80">

          </div>
        ) : (
          <button
            onClick={() => setSelectedPaciente(null)}
            className="px-5 py-2.5 text-sm font-bold text-clinic-primary border-2 border-clinic-primary rounded-xl hover:bg-clinic-primary hover:text-white transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al listado
          </button>
        )}
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-clinic-primary mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Sincronizando con el servidor...</p>
        </div>
      ) : selectedPaciente ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil (Izquierda) */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-fit sticky top-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-clinic-primary/20 to-clinic-primary/5 flex items-center justify-center text-clinic-primary font-bold text-2xl shadow-inner">
                {selectedPaciente.nombres[0]}{selectedPaciente.apellidos[0]}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xl font-bold text-clinic-text-base truncate">{selectedPaciente.nombres}</h2>
                <p className="text-sm text-gray-500 font-medium">CC: {selectedPaciente.cedula}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500">Edad/Sexo</span>
                <span className="font-bold text-clinic-text-base">{calcularEdad(selectedPaciente.fecha_nacimiento)} años, {selectedPaciente.sexo}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500">EPS</span>
                <span className="font-bold text-clinic-text-base">{selectedPaciente.eps}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-500">Registro</span>
                <span className="font-bold text-clinic-text-base">{formatearFecha(selectedPaciente.created_at)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-8 bg-clinic-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-clinic-primary/20 hover:bg-clinic-primary-light transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Nueva Terapia
            </button>
          </div>

          {/* Historial (Derecha) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 text-clinic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Historial de Evoluciones
                </h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                  {terapiasDelPaciente.length} Registros
                </span>
              </div>

              <div className="space-y-4">
                {terapiasDelPaciente.length > 0 ? (
                  terapiasDelPaciente.map((t) => (
                    <div key={t.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-clinic-primary/30 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold bg-white border border-teal-200 text-teal-700 px-2.5 py-1 rounded-lg uppercase shadow-sm">
                          {t.especialidad?.nombre || "Fisioterapia"}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{formatearFecha(t.created_at)}</span>
                      </div>
                      <h4 className="font-bold text-clinic-text-base group-hover:text-clinic-primary transition-colors">{t.objetivo?.nombre}</h4>
                      <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{t.objetivo?.descripcion}</p>

                      <div className="mt-4 pt-4 border-t border-gray-200/50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                            {t.profesional?.nombre[0]}
                          </div>
                          <span>Por: <span className="font-bold text-gray-700">{t.profesional?.nombre}</span></span>
                        </div>
                        {t.firma_electronica && (
                          <span className="text-[10px] text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            Firmado
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <p className="italic">No hay terapias registradas aún.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-clinic-subtle">
          <DataTable data={filteredPatients} columns={columns} />
        </div>
      )}

      {/* Modal Reutilizado */}
      <NewTerapiaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paciente={selectedPaciente}
        onSuccess={() => {
          fetchTerapias();
          toast.success("Historial de terapias actualizado");
        }}
      />
    </div>
  );
}
