import { useState } from "react";
import UsersManagement from "@/features/adminUser/components/UsersManagement";
import ClinicalManagement from "../components/ClinicalManagement";
import AuditLogs from "../components/AuditLogs";
import MassiveUploads from "../components/MassiveUploads";
// Importa los demás componentes cuando los tengas listos
// import ClinicalManagement from "./ClinicalManagement";
// import AuditLogs from "./AuditLogs";
// import MassiveUploads from "./MassiveUploads";

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState("usuarios");

  const tabs = [
    { id: "usuarios", label: "Gestión de Personal" },
    { id: "clinica", label: "Configuración Clínica" },
    { id: "auditoria", label: "Auditoría" },
    { id: "masivos", label: "Cargas Masivas" },
  ];

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
    <div className="space-y-3">
      {/* Título del Módulo */}
      <div>
        <h1 className="text-2xl font-bold text-clinic-text-base">
          Panel Administrativo
        </h1>
        <p className="text-sm text-clinic-text-muted">
          Configuración global y gestión de usuarios del sistema.
        </p>
      </div>

      {/* --- BARRA DE PESTAÑAS (TABS) --- */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-semibold transition-all relative ${
              activeTab === tab.id
                ? "text-clinic-primary"
                : "text-gray-500 hover:text-clinic-text-base"
            }`}
          >
            {tab.label}
            {/* Línea indicadora activa */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-clinic-primary animate-fade-in" />
            )}
          </button>
        ))}
      </div>

      {/* --- CONTENIDO DINÁMICO --- */}
      <div className="bg-white rounded-clinic-card shadow-clinic-subtle p-3">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminDashBoard;
