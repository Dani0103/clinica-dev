import { HiOutlineHome, HiOutlineViewGrid, HiOutlineCog } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { LogoPlaceholderIcon } from "@/assets/icons/LogoPlaceholderIcon";

function Header() {
  return (
    <header className="h-20 bg-black text-white flex justify-between items-center px-6">
      {/* Logo + título */}
      <div className="flex items-center gap-4">
        <LogoPlaceholderIcon />

        <div className="h-6 border-r border-gray-600"></div>

        <span className="text-lg font-semibold">Titulo proyecto</span>
      </div>

      {/* Navegación */}
      <nav className="flex items-center gap-6">
        <button className="hover:text-gray-500 transition">
          <HiOutlineHome size={22} />
        </button>

        <button className="hover:text-gray-500 transition">
          <HiOutlineViewGrid size={22} />
        </button>

        <button className="hover:text-gray-500 transition">
          <HiOutlineCog size={22} />
        </button>

        <button className="hover:text-gray-500 transition">
          <FiUser size={20} />
        </button>
      </nav>
    </header>
  );
}

export default Header;
