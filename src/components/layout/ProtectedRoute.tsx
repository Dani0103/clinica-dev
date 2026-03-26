// src/components/layout/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Si no está autenticado, lo devolvemos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, lo dejamos pasar a las rutas hijas (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
