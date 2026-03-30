import { useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineShieldCheck,
  HiOutlineUpload,
  HiOutlinePlus,
  HiOutlineKey,
  HiOutlineUserRemove,
} from "react-icons/hi";

// Definimos las pestañas principales del módulo
const ADMIN_TABS = [
  {
    id: "usuarios",
    label: "Usuarios y Roles",
    icon: <HiOutlineUsers size={20} />,
  },
  {
    id: "clinica",
    label: "Gestión Clínica",
    icon: <HiOutlineClipboardList size={20} />,
  },
  {
    id: "auditoria",
    label: "Seguridad y Auditoría",
    icon: <HiOutlineShieldCheck size={20} />,
  },
  {
    id: "masivos",
    label: "Cargas Masivas",
    icon: <HiOutlineUpload size={20} />,
  },
];

function AdminDashBoard() {
  const [activeTab, setActiveTab] = useState("usuarios");

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Encabezado del Módulo */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base tracking-tight">
          Administración del Sistema
        </h1>
        <p className="text-clinic-text-muted mt-1 text-sm">
          Gestión centralizada de usuarios, objetivos clínicos, auditoría (Ley
          2015) y cargas masivas.
        </p>
      </div>

      {/* Navegación por Pestañas */}
      <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
        {ADMIN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? "border-clinic-primary text-clinic-primary"
                : "border-transparent text-clinic-text-muted hover:text-clinic-text-base hover:border-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Área de Contenido Dinámico */}
      <div className="flex-1 bg-clinic-bg-card rounded-clinic-card shadow-clinic-subtle p-6">
        {/* --- PESTAÑA 1: USUARIOS Y ROLES --- */}
        {activeTab === "usuarios" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-clinic-text-base">
                Gestión de Personal
              </h2>

              {/* Botones de Acción Rápida */}
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors">
                  <HiOutlineKey size={16} className="text-orange-500" />
                  Reset Claves
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors">
                  <HiOutlineUserRemove size={16} className="text-red-500" />
                  Baja y Reasignación
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-clinic-primary text-white rounded-clinic-inner text-sm font-bold hover:bg-opacity-90 transition-all shadow-sm">
                  <HiOutlinePlus size={18} />
                  Nuevo Usuario
                </button>
              </div>
            </div>

            {/* Tabla Placeholder */}
            <div className="overflow-x-auto border border-gray-100 rounded-clinic-inner">
              <table className="w-full text-left text-sm text-clinic-text-base">
                <thead className="bg-clinic-bg-soft text-xs uppercase text-clinic-text-muted font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Profesional / Usuario</th>
                    <th className="px-4 py-3">Rol</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Último Acceso</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      Dr. Carlos Mendoza
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold">
                        MÉDICO
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Activo
                      </span>
                    </td>
                    <td className="px-4 py-3 text-clinic-text-muted text-xs">
                      Hoy, 08:30 AM
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-clinic-primary hover:underline text-xs font-semibold">
                        Editar
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium">Ana Gómez</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-[10px] font-bold">
                        AUDITOR
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Activo
                      </span>
                    </td>
                    <td className="px-4 py-3 text-clinic-text-muted text-xs">
                      Ayer, 15:45 PM
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-clinic-primary hover:underline text-xs font-semibold">
                        Editar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- PESTAÑA 2: GESTIÓN CLÍNICA --- */}
        {activeTab === "clinica" && (
          <div className="flex flex-col items-center justify-center h-64 text-clinic-text-muted animate-fade-in">
            <HiOutlineClipboardList size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-clinic-text-base">
              Gestión de Objetivos y Actividades
            </h3>
            <p className="text-sm mt-2 text-center max-w-md">
              Aquí construiremos la interfaz para crear objetivos, actividades,
              respuestas de requisitos y asignarlos a roles específicos.
            </p>
          </div>
        )}

        {/* --- PESTAÑA 3: AUDITORÍA Y SEGURIDAD --- */}
        {activeTab === "auditoria" && (
          <div className="flex flex-col items-center justify-center h-64 text-clinic-text-muted animate-fade-in">
            <HiOutlineShieldCheck
              size={48}
              className="mb-4 opacity-50 text-green-600"
            />
            <h3 className="text-lg font-bold text-clinic-text-base">
              Log de Auditoría (Ley 2015)
            </h3>
            <p className="text-sm mt-2 text-center max-w-md">
              Registro inmutable de trazabilidad. Veremos quién hizo qué, a qué
              hora, y configuración de políticas de contraseñas.
            </p>
          </div>
        )}

        {/* --- PESTAÑA 4: CARGAS MASIVAS --- */}
        {activeTab === "masivos" && (
          <div className="flex flex-col items-center justify-center h-64 text-clinic-text-muted animate-fade-in">
            <HiOutlineUpload
              size={48}
              className="mb-4 opacity-50 text-clinic-primary"
            />
            <h3 className="text-lg font-bold text-clinic-text-base">
              Carga Masiva de Pacientes y Agendas
            </h3>
            <p className="text-sm mt-2 text-center max-w-md">
              Zona de Drag & Drop para subir archivos Excel/CSV y procesar
              evoluciones masivas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashBoard;
