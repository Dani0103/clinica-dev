import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Mientras el Contexto está verificando el localStorage,
  // mostramos una pantalla de carga o nada para evitar el salto al login.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {/* Puedes usar un spinner de tu librería de UI o uno simple de CSS */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // 2. Si ya terminó de cargar y NO está autenticado, ahí sí lo devolvemos al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Si está autenticado, lo dejamos pasar a las rutas hijas (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
