import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PageLoader from "@/components/common/PageLoader";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Mientras el Contexto está verificando el localStorage,
  // mostramos una pantalla de carga o nada para evitar el salto al login.
  if (isLoading) {
    return <PageLoader variant="fullscreen" />;
  }

  // 2. Si ya terminó de cargar y NO está autenticado, ahí sí lo devolvemos al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Si está autenticado, lo dejamos pasar a las rutas hijas (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
