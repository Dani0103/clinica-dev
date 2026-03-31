import { useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineShieldCheck,
  HiOutlineUpload,
} from "react-icons/hi";

// Importamos los componentes
import UsersManagement from "@/features/adminUser/components/UsersManagement";
import ClinicalManagement from "@/features/adminUser/components/ClinicalManagement";
import AuditLogs from "@/features/adminUser/components/AuditLogs";
import MassiveUploads from "@/features/adminUser/components/MassiveUploads";

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

  // Función auxiliar para renderizar el componente correcto
  const renderActiveTab = () => {
    switch (activeTab) {
      case "usuarios":
        return <UsersManagement />;
      case "clinica":
        return <ClinicalManagement />;
      case "auditoria":
        return <AuditLogs />;
      case "masivos":
        return <MassiveUploads />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col gap-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base tracking-tight">
          Administración del Sistema
        </h1>
        <p className="text-clinic-text-muted mt-1 text-sm">
          Gestión centralizada de usuarios, objetivos clínicos, auditoría y
          cargas masivas.
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
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default AdminDashBoard;
