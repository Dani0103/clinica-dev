import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";
import { toast } from "react-toastify";
import NewTerapiaModal from "../components/NewTerapiaModal";

// Interfaces simuladas para la UI (luego las moveremos a types/)
interface Paciente {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string;
  edad?: number;
  sexo: string;
  eps: string;
  // ultimoIngreso?: string;
  updated_at?: string;
  created_at?: string;
}

// interface HistorialTerapia {
//   id: number;
//   fecha: string;
//   objetivo: string;
//   actividad: string;
//   especialidad: string;
//   profesional: string;
// }

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Terapias state
  const [historialTerapias, setHistorialTerapias] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const { execute } = useApi();

  useEffect(() => {
    fetchPacientes();
    fetchTerapias();
  }, []);

  const fetchTerapias = async () => {
    try {
      const response = await execute(AppUrls.avanzarApi, API_ENDPOINTS.CLINIC.TERAPIAS, { method: "GET" });
      if (response && response.data) {
        setHistorialTerapias(response.data);
      }
    } catch (error) {
      // toast.error("Error al cargar el historial de terapias");
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.LIST, {
        method: "GET",
      });
      if (response && response.data) {
        setPacientes(response.data);
      }
    } catch (error) {
      toast.error("Error al cargar los pacientes");
    }
  };

  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return "N/A";
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  };

  // Filtramos las terapias reales por el paciente seleccionado
  const terapiasDelPaciente = selectedPaciente
    ? historialTerapias.filter(t => t.paciente_id === selectedPaciente.id)
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!value.trim()) {
      setSelectedPaciente(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // Agregamos un pequeño delay para mostrar el loader y evitar buscar en cada tecla
    searchTimeout.current = setTimeout(() => {
      const found = pacientes.find(p =>
        p.cedula === value ||
        (p.nombres + " " + p.apellidos).toLowerCase().includes(value.toLowerCase())
      );

      if (found) {
        setSelectedPaciente(found);
      } else {
        setSelectedPaciente(null);
      }
      setIsSearching(false);
    }, 600); // 600ms de "pageload"
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatearFecha = (fechaIso?: string) => {
    if (!fechaIso) return "Reciente";

    const fecha = new Date(fechaIso);

    // Convierte a formato local, ej: "29/04/2026, 12:22:55 a.m."
    return fecha.toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Ponlo en false si prefieres formato militar (24h)
    });
  };

  return (
    <div className=" min-h-full font-sans space-y-4 sm:space-y-6">

      {/* Header y Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base">Gestión de Pacientes</h1>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-1">Busca un paciente por cédula o nombre para ver su historial clínico.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Buscar paciente por cédula..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-80 pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-full border border-gray-100 shadow-clinic-subtle focus:ring-2 focus:ring-clinic-primary outline-none transition-all"
          />
          <svg className="w-5 h-5 absolute left-4 top-[10px] sm:top-3.5 text-clinic-icon-inactive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </form>
      </div>

      {/* Contenido Principal */}
      {isSearching ? (
        <div className="bg-white rounded-clinic-card shadow-clinic-subtle p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] animate-pulse">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-clinic-bg-soft border-t-clinic-primary rounded-full animate-spin mb-4 sm:mb-6"></div>
          <h3 className="text-lg sm:text-xl font-bold text-clinic-text-base">Buscando paciente...</h3>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-2 max-w-md">Consultando la base de datos de Avanzar IPS.</p>
        </div>
      ) : selectedPaciente ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">

          {/* Tarjeta del Paciente (Izquierda) */}
          <div className="bg-clinic-bg-card rounded-clinic-card shadow-clinic-subtle p-5 sm:p-6 lg:col-span-1 h-fit border border-gray-100">
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center sm:items-start lg:items-center xl:items-start gap-4 mb-6 text-center sm:text-left lg:text-center xl:text-left">
              <div className="w-16 h-16 rounded-full bg-clinic-primary-light/20 flex shrink-0 items-center justify-center text-clinic-primary font-bold text-xl">
                {selectedPaciente.nombres.charAt(0)}{selectedPaciente.apellidos.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-clinic-text-base break-words">{selectedPaciente.nombres} {selectedPaciente.apellidos}</h2>
                <p className="text-xs sm:text-sm text-clinic-text-muted">C.C. {selectedPaciente.cedula}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-clinic-text-muted text-sm">Edad/Sexo</span>
                <span className="font-medium text-clinic-text-base">
                  {selectedPaciente.edad || calcularEdad(selectedPaciente.fecha_nacimiento || "")} años, {selectedPaciente.sexo}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-clinic-text-muted text-sm">EPS</span>
                <span className="font-medium text-clinic-text-base">{selectedPaciente.eps}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-clinic-text-muted text-xs sm:text-sm">Último Ingreso</span>
                <span className="font-medium text-clinic-text-base text-xs sm:text-sm text-right">{formatearFecha(selectedPaciente.updated_at)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-clinic-primary to-indigo-600 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-clinic-inner shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              <span>Registrar Nueva Terapia</span>
            </button>
          </div>

          {/* Historial Clínico (Derecha) */}
          <div className="bg-clinic-bg-card rounded-clinic-card shadow-clinic-subtle p-5 sm:p-6 lg:col-span-2 border border-gray-100 flex flex-col h-full">
            <h3 className="text-base sm:text-lg font-bold text-clinic-text-base mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-clinic-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Historial de Terapias
            </h3>

            <div className="space-y-3 sm:space-y-4 flex-1">
              {terapiasDelPaciente.length > 0 ? (
                terapiasDelPaciente.map((terapia) => (
                  <div key={terapia.id} className="p-3 sm:p-4 rounded-clinic-inner bg-gray-50 hover:bg-clinic-bg-soft/50 transition-colors border border-gray-100/50 flex flex-col md:flex-row justify-between gap-3 sm:gap-4">

                    {/* Contenido de la Terapia (Izquierda) */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-1">
                        <span className="text-[10px] sm:text-xs font-semibold bg-clinic-badge-fisio text-teal-800 px-2 py-0.5 sm:py-1 rounded-md">
                          {/* Fallback en caso de que no venga el objeto especialidad */}
                          {terapia.especialidad?.nombre || "Terapia Física"}
                        </span>
                        <span className="text-xs sm:text-sm text-clinic-text-muted whitespace-nowrap">
                          {/* Aplicamos la función para que se vea bonita la fecha */}
                          {formatearFecha(terapia.created_at)}
                        </span>
                      </div>

                      <h4 className="font-semibold text-clinic-text-base text-sm sm:text-base leading-tight">
                        {terapia.objetivo?.nombre || "Objetivo no registrado"}
                      </h4>

                      <p className="text-xs sm:text-sm text-clinic-text-muted mt-1 leading-snug">
                        {/* Como no viene 'actividad', usamos la descripción del objetivo que sí viene en tu JSON */}
                        {terapia.objetivo?.descripcion || "Sin descripción detallada"}
                      </p>

                      {/* Resultados (si existen) */}
                      {terapia.resultados && terapia.resultados.length > 0 && (
                        <div className="mt-3 pl-3 border-l-2 border-clinic-primary/20 space-y-1">
                          {terapia.resultados.map((res: any, idx: number) => (
                            <p key={idx} className="text-xs text-gray-500 italic">
                              • {res.respuesta?.texto_predeterminado || "Resultado registrado"}
                              {res.notas_libres && <span> - {res.notas_libres}</span>}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Información del Profesional y Firma (Derecha) */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200/60 md:pl-4 text-xs sm:text-sm text-clinic-text-muted shrink-0">

                      <span className="flex items-center gap-1 font-medium text-clinic-text-base md:text-clinic-text-muted">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {/* CORREGIDO: Usamos profesional.nombre */}
                          {terapia.profesional?.nombre || "Profesional Asignado"}
                        </span>
                      </span>

                      {/* Indicador de Firma Electrónica */}
                      {terapia.firma_electronica && (
                        <span className="text-[10px] sm:text-xs text-green-600 mt-1 flex items-center gap-1 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Firmado
                        </span>
                      )}

                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-clinic-inner border-2 border-dashed border-gray-100">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <p className="text-clinic-text-muted text-sm font-medium">El paciente no tiene terapias registradas aún.</p>
                  <p className="text-xs text-gray-400 mt-1">Haga clic en "Registrar Nueva Terapia" para comenzar.</p>
                </div>
              )}
            </div>
            <button className="mt-5 sm:mt-6 text-sm text-clinic-primary font-medium hover:underline flex items-center justify-center sm:justify-start gap-1 w-full sm:w-auto p-2 sm:p-0">
              Ver historial completo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-clinic-card shadow-clinic-subtle p-6 sm:p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-clinic-bg-soft rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-clinic-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-clinic-text-base">No hay ningún paciente seleccionado</h3>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-2 max-w-sm sm:max-w-md">Utiliza la barra de búsqueda superior para encontrar a un paciente por su cédula o nombre y gestionar sus terapias.</p>
        </div>
      )}

      {/* MODAL DE NUEVA TERAPIA */}
      <NewTerapiaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paciente={selectedPaciente}
        onSuccess={() => {
          fetchTerapias(); // Recargamos para ver la nueva
        }}
      />
    </div>
  );
}
