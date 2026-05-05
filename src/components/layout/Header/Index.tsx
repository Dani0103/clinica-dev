import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineMenu,
  HiOutlineLogout,
  HiOutlineKey,
  HiOutlineChevronDown,
} from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useAuthService } from "@/services/authService";

interface HeaderProps {
  onMenuToggle?: () => void;
}

function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout: clearSession } = useAuth();
  const { logout: apiLogout } = useAuthService();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al click fuera o al presionar Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleChangePassword = () => {
    setMenuOpen(false);
    // Reutilizamos el flujo de recuperación (envía código al correo).
    // Cuando el backend exponga POST /auth/change-password autenticado,
    // se reemplaza por un modal in-situ.
    navigate("/forgot-password");
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      // Intentar revocar el token en el backend; ignoramos errores para no
      // bloquear el cierre de sesión local.
      await apiLogout();
    } catch {
      /* noop */
    }
    clearSession();
    navigate("/");
  };

  const nombreCorto = user?.nombre?.split(" ")[0] || "Usuario";
  const inicial = (user?.nombre?.[0] || "U").toUpperCase();
  const rolNombre = user?.rol?.nombre || "Sin rol";

  return (
    <header className="h-20 bg-clinic-bg-card flex justify-between items-center px-4 sm:px-6 lg:px-8 border-b border-gray-100 shadow-sm z-10 sticky">
      {/* Izquierda: Logo de la Clínica */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 text-clinic-text-base hover:bg-gray-100 rounded-lg"
        >
          <HiOutlineMenu size={24} />
        </button>
        <div className="bg-clinic-primary w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-xl font-bold">A</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-clinic-text-base text-lg font-bold tracking-tight leading-none">
            Avanzar IPS
          </h1>
          <p className="text-[10px] text-clinic-text-muted font-medium mt-0.5 uppercase tracking-wider">
            Portal Médico
          </p>
        </div>
      </div>

      {/* Derecha: Menú de usuario */}
      <nav className="flex items-center">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-clinic-primary/20"
          >
            <div className="w-10 h-10 rounded-full bg-clinic-primary-light/30 flex items-center justify-center text-clinic-primary border border-clinic-primary-light shadow-sm font-bold">
              {user?.nombre ? inicial : <FiUser size={20} />}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-bold text-clinic-text-base leading-tight max-w-[180px] truncate">
                {nombreCorto}
              </span>
              <span className="text-xs text-clinic-text-muted font-medium">
                {rolNombre}
              </span>
            </div>
            <HiOutlineChevronDown
              size={16}
              className={`hidden md:block text-clinic-text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-72 bg-white rounded-clinic-card shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in"
            >
              {/* Cabecera con info del usuario */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-clinic-primary-light/30 flex items-center justify-center text-clinic-primary font-bold border border-clinic-primary-light shadow-sm">
                    {inicial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-clinic-text-base truncate">
                      {user?.nombre || "Usuario"}
                    </p>
                    <p className="text-xs text-clinic-text-muted truncate">
                      {user?.correo || "—"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-clinic-primary bg-clinic-primary/10 px-2 py-0.5 rounded-full uppercase">
                      {rolNombre}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="py-1">
                <button
                  role="menuitem"
                  onClick={handleChangePassword}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-clinic-text-base hover:bg-gray-50 transition-colors text-left"
                >
                  <HiOutlineKey size={18} className="text-clinic-text-muted" />
                  <div className="flex-1">
                    <p className="font-semibold">Cambiar contraseña</p>
                    <p className="text-[11px] text-clinic-text-muted">
                      Te enviaremos un código a tu correo
                    </p>
                  </div>
                </button>

                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                >
                  <HiOutlineLogout size={18} />
                  <span className="font-semibold">Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
