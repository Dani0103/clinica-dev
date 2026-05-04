import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import SidebarItem from "@/components/layout/SideBar/SidebarItem/Index";
import { MENU_ITEMS } from "@/config/menuItems";

interface SidebarProps {
  mobileMenuOpen?: boolean;
  closeMobileMenu?: () => void;
}

function Sidebar({ mobileMenuOpen, closeMobileMenu }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, hasPermiso } = useAuth();
  const navigate = useNavigate();

  const visibleItems = useMemo(
    () =>
      MENU_ITEMS.filter((item) =>
        !item.permiso || item.permiso.length === 0
          ? true
          : hasPermiso(item.permiso),
      ),
    [hasPermiso],
  );

  // Función para cerrar sesión de forma segura
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`
          ${collapsed ? "w-20" : "w-64"} 
          bg-clinic-primary text-white flex flex-col transition-all duration-300 h-full shadow-lg
          fixed md:static inset-y-0 left-0 z-50
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Navegación Principal (Le agregamos un pt-8 para que no quede pegado arriba ya que quitamos el logo) */}
        <nav className="flex-1 px-3 pt-8 pb-6 space-y-2 overflow-y-auto">
          {visibleItems.map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          ))}
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
            className="w-full bg-red-500 flex items-center justify-center gap-3 px-3 py-2.5 rounded-clinic-inner text-white hover:bg-red-600 transition-colors duration-200"
            title="Cerrar Sesión"
          >
            <HiOutlineLogout size={22} />
            {!collapsed && (
              <span className="text-sm font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
