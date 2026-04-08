import { MENU_ITEMS } from "@/config/menuItems";
import { useAuth } from "@/context/AuthContext"; // Importa tu hook
import { Link } from "react-router-dom";

function DashboardPage() {
  // Extraemos el usuario desde el contexto
  const { user } = useAuth();

  const modules = MENU_ITEMS.filter((item) => item.path !== "/home");

  return (
    <section className="space-y-6">
      {/* Encabezado Personalizado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Bienvenid@, {user?.nombre || "Usuario"}! 👋
        </h1>
        <p className="text-sm text-gray-500">
          Resumen general de la información para {user?.correo}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-clinic-primary/20 transition-all duration-200 flex items-start gap-4"
          >
            <div className="p-3 rounded-lg bg-clinic-primary/5 text-clinic-primary group-hover:bg-clinic-primary group-hover:text-white transition-colors">
              {module.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{module.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{module.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
