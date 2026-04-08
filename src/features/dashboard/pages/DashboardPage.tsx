import { useAuth } from "@/context/AuthContext"; // Importa tu hook
import KpiCard from "@/features/dashboard/pages/KpiCard";
import StatusItem from "@/features/dashboard/pages/StatusItem";

function DashboardPage() {
  // Extraemos el usuario desde el contexto
  const { user } = useAuth();

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
    </section>
  );
}

export default DashboardPage;
