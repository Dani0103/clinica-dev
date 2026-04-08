import {
  HiOutlineBell,
  // HiOutlineSearch,
  HiOutlineCog,
} from "react-icons/hi";
import { FiUser } from "react-icons/fi";
// Si aún necesitas tu logo aquí, puedes importarlo, pero usualmente
// en este tipo de layouts el logo ya está en la Sidebar (como lo dejamos antes).
// import { LogoPlaceholderIcon } from "@/assets/icons/LogoPlaceholderIcon";

function Header() {
  return (
    <header className="h-20 bg-clinic-bg-card flex justify-between items-center px-4 sm:px-6 lg:px-8 border-b border-gray-100 shadow-sm z-10 sticky">
      {/* Izquierda: Logo de la Clínica */}
      <div className="flex items-center gap-3 flex-1">
        {/* Círculo con la inicial (mantiene el branding del Login) */}
        <div className="bg-clinic-primary w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-xl font-bold">A</span>
        </div>

        {/* Si prefieres usar tu icono, comenta el div de arriba y usa esto: */}
        {/* <LogoPlaceholderIcon /> */}

        <div className="hidden sm:block">
          <h1 className="text-clinic-text-base text-lg font-bold tracking-tight leading-none">
            Avanzar IPS
          </h1>
          <p className="text-[10px] text-clinic-text-muted font-medium mt-0.5 uppercase tracking-wider">
            Portal Médico
          </p>
        </div>
      </div>

      {/* Derecha: Acciones de usuario */}
      <nav className="flex items-center gap-2 sm:gap-4">
        {/* Botón de Configuración */}
        <button className="p-2 text-clinic-icon-inactive hover:text-clinic-primary hover:bg-clinic-bg-soft rounded-full transition-all hidden sm:block">
          <HiOutlineCog size={22} />
        </button>

        {/* Botón de Notificaciones con "Puntito" de alerta */}
        <button className="relative p-2 text-clinic-icon-inactive hover:text-clinic-primary hover:bg-clinic-bg-soft rounded-full transition-all">
          <HiOutlineBell size={22} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Separador vertical */}
        <div className="h-8 border-r border-gray-200 mx-1 hidden sm:block"></div>

        {/* Perfil del Usuario Logueado */}
        <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-gray-200">
          <div className="w-10 h-10 rounded-full bg-clinic-primary-light/30 flex items-center justify-center text-clinic-primary border border-clinic-primary-light shadow-sm">
            <FiUser size={20} />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-bold text-clinic-text-base leading-tight">
              Administrador
            </span>
            <span className="text-xs text-clinic-text-muted font-medium">
              Avanzar IPS
            </span>
          </div>
        </button>
      </nav>
    </header>
  );
}

export default Header;
