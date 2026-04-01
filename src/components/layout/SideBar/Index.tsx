import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import SidebarItem from "@/components/layout/SideBar/SidebarItem/Index";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Función para cerrar sesión de forma segura
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-clinic-primary text-white flex flex-col transition-all duration-300 h-full shadow-lg`}
    >
      {/* Navegación Principal (Le agregamos un pt-8 para que no quede pegado arriba ya que quitamos el logo) */}
      <nav className="flex-1 px-3 pt-8 pb-6 space-y-2 overflow-y-auto">
        <SidebarItem
          to="/home"
          icon={<HiOutlineViewGrid size={22} />}
          label="Dashboard"
          collapsed={collapsed}
        />

        <SidebarItem
          to="/pacientes"
          icon={<HiOutlineUsers size={22} />}
          label="Pacientes"
          collapsed={collapsed}
        />

        <SidebarItem
          to="/agenda"
          icon={<HiOutlineCalendar size={22} />}
          label="Agenda y Citas"
          collapsed={collapsed}
        />

        {/* Separador Visual para el Módulo 1 */}
        <div className="pt-4 pb-2">
          {!collapsed && (
            <p className="px-4 text-[10px] uppercase tracking-wider text-clinic-primary-light font-semibold">
              Módulo 1
            </p>
          )}
          {collapsed && (
            <div className="border-t border-white/10 mx-2 mt-2"></div>
          )}
        </div>

        <SidebarItem
          to="/admin/usuarios"
          icon={<HiOutlineCog size={22} />}
          label="Administración"
          collapsed={collapsed}
        />
      </nav>

      {/* Sección Inferior: Salir y Colapsar */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {/* Botón Colapsar Sidebar hacia la izquierda */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-clinic-inner text-clinic-primary-light hover:text-white hover:bg-white/10 transition-colors duration-200"
          title={collapsed ? "Expandir Menú" : "Ocultar Menú"}
        >
          {collapsed ? (
            <HiOutlineChevronRight size={20} />
          ) : (
            <>
              <HiOutlineChevronLeft size={20} />
              <span className="text-sm font-medium">Ocultar Menú</span>
            </>
          )}
        </button>
        {/* Botón de Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/80 flex items-center justify-center gap-3 px-3 py-2.5 rounded-clinic-inner text-white hover:bg-red-600 transition-colors duration-200"
          title="Cerrar Sesión"
        >
          <HiOutlineLogout size={22} />
          {!collapsed && (
            <span className="text-sm font-medium">Cerrar Sesión</span>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
