// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/features/home/pages/HomePage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import Login from "@/features/auth/Login";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

// NOTA: Cuando crees los componentes reales, los importarás aquí arriba. Ejemplo:
// import PacientesPage from "@/features/pacientes/pages/PacientesPage";
// import UsuariosPage from "@/features/admin/pages/UsuariosPage";

export const router = createBrowserRouter([
  // 1. Ruta Pública: Login
  {
    path: "/login",
    element: <Login />,
  },

  // 2. Rutas Privadas: Protegidas por el ProtectedRoute
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />,
          },
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          // --- NUEVAS RUTAS DEL SIDEBAR ---
          {
            path: "pacientes",
            element: (
              <div className="p-8 flex items-center justify-center h-full">
                <h1 className="text-2xl font-bold text-clinic-text-base bg-white p-6 rounded-clinic-card shadow-clinic-subtle">
                  Vista de Pacientes (En construcción 🚧)
                </h1>
              </div>
            ),
          },
          {
            path: "agenda",
            element: (
              <div className="p-8 flex items-center justify-center h-full">
                <h1 className="text-2xl font-bold text-clinic-text-base bg-white p-6 rounded-clinic-card shadow-clinic-subtle">
                  Agenda y Citas (En construcción 📅)
                </h1>
              </div>
            ),
          },
          {
            path: "admin/usuarios",
            element: (
              <div className="p-8 flex items-center justify-center h-full">
                <h1 className="text-2xl font-bold text-clinic-text-base bg-white p-6 rounded-clinic-card shadow-clinic-subtle border-l-4 border-clinic-primary">
                  Módulo 1: Administración de Usuarios ⚙️
                </h1>
              </div>
            ),
          },
        ],
      },
    ],
  },

  // 3. Ruta comodín (404 / no encontrada)
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
