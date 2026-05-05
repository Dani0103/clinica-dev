// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import Login from "@/features/auth/pages/Login";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminDashBoard from "@/features/adminUser/pages/AdminDashBoard";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import UsersManagement from "@/features/adminUser/components/UsersManagement";
import ClinicalManagement from "@/features/adminUser/components/ClinicalManagement";
import AuditLogs from "@/features/adminUser/components/AuditLogs";
import CargasMasivasPage from "@/features/adminUser/pages/CargasMasivasPage";
import EspecialidadesManagement from "@/features/adminUser/components/EspecialidadesManagement";
import NewDoctorModal from "@/features/adminUser/components/modal/NewUserModal/modal/NewDoctorModal";
import NewPatientModal from "@/features/adminUser/components/modal/NewUserModal/modal/NewPatientModal";
import NotFoundPage from "@/features/home/pages/NotFoundPage";

// NOTA: Cuando crees los componentes reales, los importarás aquí arriba. Ejemplo:
// import PacientesPage from "@/features/pacientes/pages/PacientesPage";
// import UsuariosPage from "@/features/admin/pages/UsuariosPage";
import PacientesPage from "@/features/pacientes/pages/PacientesPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import HistoriasDescargaPage from "@/features/reports/pages/HistoriasDescargaPage";
import AgendaPage from "@/features/agenda/pages/AgendaPage";

export const router = createBrowserRouter([
  // 1. Ruta Pública: Login
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  // 2. Rutas Privadas: Protegidas por el ProtectedRoute
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />,
          },
          {
            path: "home",
            element: <DashboardPage />,
          },
          // --- NUEVAS RUTAS DEL SIDEBAR ---
          {
            path: "pacientes",
            element: <PacientesPage />
          },
          {
            path: "agenda",
            element: <AgendaPage />,
          },
          {
            path: "reportes",
            element: <ReportsPage />,
          },
          {
            path: "historias-descarga",
            element: <HistoriasDescargaPage />,
          },
          {
            // Ruta directa (fuera de /admin) para que Recepcionista pueda
            // acceder sin ver el resto del panel administrativo.
            path: "cargas-masivas",
            element: <CargasMasivasPage />,
          },
          {
            path: "admin",
            element: <AdminDashBoard />,
            children: [
              { index: true, element: <Navigate to="usuarios" replace /> }, // Redirige /admin a /admin/usuarios
              {
                path: "usuarios",
                element: <UsersManagement />,
                children: [
                  { path: "nuevo-medico", element: <NewDoctorModal /> },
                  { path: "nuevo-paciente", element: <NewPatientModal /> },
                ],
              }, // Ver nota abajo
              { path: "nuevo-medico", element: <NewDoctorModal /> },
              { path: "nuevo-paciente", element: <NewPatientModal /> },
              { path: "clinica", element: <ClinicalManagement /> },
              { path: "auditoria", element: <AuditLogs /> },
              { path: "especialidades", element: <EspecialidadesManagement /> },
            ],
          },
        ],
      },
    ],
  },

  // 3. Ruta comodín (404 / no encontrada)
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
