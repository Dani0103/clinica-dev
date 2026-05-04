import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCog,
  HiOutlineDocumentReport,
} from "react-icons/hi";

export interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  /**
   * Permisos que habilitan esta vista. Con que el usuario tenga UNO alcanza.
   * Si está vacío o no se define, la vista es visible para todos los autenticados.
   */
  permiso?: string[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    path: "/app/home",
    label: "Dashboard",
    icon: <HiOutlineViewGrid size={22} />,
    description: "Vista general del sistema",
    // Visible para todos los usuarios autenticados
  },
  {
    path: "/app/pacientes",
    label: "Pacientes",
    icon: <HiOutlineUsers size={22} />,
    description: "Gestión de historias clínicas y pacientes",
    permiso: ["pacientes.buscar", "pacientes.crear"],
  },
  {
    path: "/app/agenda",
    label: "Agenda",
    icon: <HiOutlineCalendar size={22} />,
    description: "Citas y terapias programadas",
    permiso: ["agenda.ver"],
  },
  {
    path: "/app/reportes",
    label: "Reportes",
    icon: <HiOutlineDocumentReport size={22} />,
    description: "Supervisión y KPIs",
    permiso: ["historial.ver", "datos.exportar", "dashboards.ver"],
  },
  {
    path: "/app/admin/",
    label: "Administración",
    icon: <HiOutlineCog size={22} />,
    description: "Configuración de usuarios y roles",
    permiso: [
      "usuarios.ver",
      "usuarios.crear",
      "usuarios.editar",
      "roles.gestionar",
      "objetivos.gestionar",
      "especialidades.gestionar",
      "auditoria.ver",
      "pacientes.carga_masiva",
      "usuarios.reset_password",
    ],
  },
];
