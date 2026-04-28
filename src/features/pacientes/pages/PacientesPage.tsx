import React, { useState } from "react";

// Interfaces simuladas para la UI (luego las moveremos a types/)
interface Paciente {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  edad: number;
  sexo: string;
  eps: string;
  ultimoIngreso: string;
}

interface HistorialTerapia {
  id: number;
  fecha: string;
  objetivo: string;
  actividad: string;
  especialidad: string;
  profesional: string;
}

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

  // Datos simulados (Mock) para que veamos el diseño antes de conectar al backend
  const mockPacientes: Paciente[] = [
    { id: 1, cedula: "1098765432", nombres: "Juan Carlos", apellidos: "Gómez Pérez", edad: 45, sexo: "M", eps: "Sanitas", ultimoIngreso: "2023-10-15" },
    { id: 2, cedula: "987654321", nombres: "María Teresa", apellidos: "López Silva", edad: 32, sexo: "F", eps: "Sura", ultimoIngreso: "2023-10-20" },
  ];

  const mockHistorial: HistorialTerapia[] = [
    { id: 101, fecha: "2023-10-20", objetivo: "Mejorar movilidad articular", actividad: "Ejercicios de estiramiento pasivo", especialidad: "Fisioterapia", profesional: "Dr. Andrés Silva" },
    { id: 102, fecha: "2023-10-15", objetivo: "Reducción de dolor lumbar", actividad: "Terapia con calor y masajes", especialidad: "Fisioterapia", profesional: "Dr. Andrés Silva" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos la búsqueda
    const found = mockPacientes.find(p => p.cedula === searchTerm || p.nombres.toLowerCase().includes(searchTerm.toLowerCase()));
    setSelectedPaciente(found || null);
  };

  return (
    <div className="p-6 md:p-10 min-h-full bg-clinic-bg-soft font-sans space-y-6">
      
      {/* Header y Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-clinic-text-base">Gestión de Pacientes</h1>
          <p className="text-clinic-text-muted mt-1">Busca un paciente por cédula o nombre para ver su historial clínico.</p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Buscar paciente (ej. 1098...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 pl-10 pr-4 py-3 rounded-full border-none shadow-clinic-subtle focus:ring-2 focus:ring-clinic-primary outline-none transition-all"
          />
          <svg className="w-5 h-5 absolute left-4 top-3.5 text-clinic-icon-inactive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <button type="submit" className="hidden">Buscar</button>
        </form>
      </div>

      {/* Contenido Principal */}
      {selectedPaciente ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Tarjeta del Paciente (Izquierda) */}
          <div className="bg-clinic-bg-card rounded-clinic-card shadow-clinic-subtle p-6 lg:col-span-1 h-fit border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-clinic-primary-light/20 flex items-center justify-center text-clinic-primary font-bold text-xl">
                {selectedPaciente.nombres.charAt(0)}{selectedPaciente.apellidos.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-clinic-text-base">{selectedPaciente.nombres} {selectedPaciente.apellidos}</h2>
                <p className="text-sm text-clinic-text-muted">C.C. {selectedPaciente.cedula}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-clinic-text-muted text-sm">Edad/Sexo</span>
                <span className="font-medium text-clinic-text-base">{selectedPaciente.edad} años, {selectedPaciente.sexo}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-clinic-text-muted text-sm">EPS</span>
                <span className="font-medium text-clinic-text-base">{selectedPaciente.eps}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-clinic-text-muted text-sm">Último Ingreso</span>
                <span className="font-medium text-clinic-text-base">{selectedPaciente.ultimoIngreso}</span>
              </div>
            </div>

            <button className="w-full mt-8 bg-gradient-to-r from-clinic-primary to-indigo-600 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-clinic-inner shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Registrar Nueva Terapia
            </button>
          </div>

          {/* Historial Clínico (Derecha) */}
          <div className="bg-clinic-bg-card rounded-clinic-card shadow-clinic-subtle p-6 lg:col-span-2 border border-gray-100">
            <h3 className="text-lg font-bold text-clinic-text-base mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-clinic-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Historial de Terapias
            </h3>
            
            <div className="space-y-4">
              {mockHistorial.map((terapia) => (
                <div key={terapia.id} className="p-4 rounded-clinic-inner bg-gray-50 hover:bg-clinic-bg-soft/50 transition-colors border border-gray-100/50 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold bg-clinic-badge-fisio text-teal-800 px-2 py-1 rounded-md">{terapia.especialidad}</span>
                      <span className="text-sm text-clinic-text-muted">{terapia.fecha}</span>
                    </div>
                    <h4 className="font-semibold text-clinic-text-base">{terapia.objetivo}</h4>
                    <p className="text-sm text-clinic-text-muted mt-1">{terapia.actividad}</p>
                  </div>
                  <div className="flex items-center md:items-start text-sm text-clinic-text-muted">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      {terapia.profesional}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 text-sm text-clinic-primary font-medium hover:underline flex items-center gap-1">
              Ver historial completo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-clinic-card shadow-clinic-subtle p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-clinic-bg-soft rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-clinic-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-clinic-text-base">No hay ningún paciente seleccionado</h3>
          <p className="text-clinic-text-muted mt-2 max-w-md">Utiliza la barra de búsqueda superior para encontrar a un paciente por su cédula o nombre y gestionar sus terapias.</p>
        </div>
      )}
    </div>
  );
}
