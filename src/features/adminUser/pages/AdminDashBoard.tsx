import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";
import { useApi } from "@/hooks/useApi";
import type {
  AdminContextType,
  OptionItem,
} from "@/types/AdminUser/UsersManagement";

const AdminDashBoard = () => {
  const [rol, setRol] = useState<OptionItem[]>([]);
  const [especialidad, setEspecialidad] = useState<OptionItem[]>([]);
  const { execute } = useApi();

  const tabs = [
    { path: "usuarios", label: "Gestión de Personal" },
    { path: "clinica", label: "Configuración Clínica" },
    { path: "auditoria", label: "Auditoría" },
    { path: "masivos", label: "Cargas Masivas" },
  ];

  useEffect(() => {
    const traerData = async () => {
      try {
        const [rolesRes, espRes] = await Promise.all([
          execute(AppUrls.avanzarApi, API_ENDPOINTS.ADMIN.ROLES, {
            method: "GET",
          }),
          execute(AppUrls.avanzarApi, API_ENDPOINTS.ADMIN.ESPECIALIDADES, {
            method: "GET",
          }),
        ]);

        if (rolesRes?.status === "success") setRol(rolesRes.data);
        if (espRes?.status === "success") setEspecialidad(espRes.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    traerData();
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-3 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-clinic-text-base">
          Panel Administrativo
        </h1>
        <p className="text-sm text-clinic-text-muted">
          Configuración global y gestión de usuarios.
        </p>
      </div>

      {/* --- BARRA DE NAVEGACIÓN (TABS) --- */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-6 py-3 text-sm font-semibold transition-all relative ${
                isActive
                  ? "text-clinic-primary"
                  : "text-gray-500 hover:text-clinic-text-base"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-clinic-primary animate-fade-in" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* --- CONTENIDO DINÁMICO (Aquí se renderizan los hijos del router) --- */}
      <div className="w-full h-full bg-white rounded-clinic-card shadow-clinic-subtle p-3">
        {/* Pasamos los datos de roles/especialidades vía context o simplemente envolviendo si es necesario */}
        <Outlet context={{ rol, especialidad } satisfies AdminContextType} />
      </div>
    </div>
  );
};

export default AdminDashBoard;
