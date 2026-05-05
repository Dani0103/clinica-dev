import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
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
  const { hasPermiso } = useAuth();

  const visibleItems = useMemo(
    () =>
      MENU_ITEMS.filter((item) =>
        !item.permiso || item.permiso.length === 0
          ? true
          : hasPermiso(item.permiso),
      ),
    [hasPermiso],
  );

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
        {/* Navegación Principal */}
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

        {/* Sección Inferior: Colapsar/Expandir menú */}
        <div className="p-4 border-t border-white/15">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            title={collapsed ? "Expandir menú" : "Ocultar menú"}
            aria-label={collapsed ? "Expandir menú" : "Ocultar menú"}
            aria-expanded={!collapsed}
            className={`
              w-full flex items-center gap-2 px-3 py-3 rounded-clinic-inner
              bg-white text-clinic-primary font-bold text-sm
              hover:bg-gray-100 hover:text-clinic-primary
              active:scale-[0.98] active:bg-gray-200
              shadow-md hover:shadow-lg
              transition-all duration-200
              ${collapsed ? "justify-center" : "justify-center"}
            `}
          >
            {collapsed ? (
              <HiOutlineChevronRight size={22} />
            ) : (
              <>
                <HiOutlineChevronLeft size={18} />
                <span>Ocultar menú</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
