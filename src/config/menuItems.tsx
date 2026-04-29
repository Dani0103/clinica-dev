import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCog,
  HiOutlineDocumentReport,
} from "react-icons/hi";

export const MENU_ITEMS = [
  {
    path: "/app/home",
    label: "Dashboard",
    icon: <HiOutlineViewGrid size={22} />,
    description: "Vista general del sistema",
  },
  {
    path: "/app/pacientes",
    label: "Pacientes",
    icon: <HiOutlineUsers size={22} />,
    description: "Gestión de historias clínicas y pacientes",
  },
  {
    path: "/app/agenda",
    label: "Agenda",
    icon: <HiOutlineCalendar size={22} />,
    description: "Citas y terapias programadas",
  },
  {
    path: "/app/reportes",
    label: "Reportes",
    icon: <HiOutlineDocumentReport size={22} />,
    description: "Supervisión y KPIs",
  },
  {
    path: "/app/admin/",
    label: "Administración",
    icon: <HiOutlineCog size={22} />,
    description: "Configuración de usuarios y roles",
    isAdmin: true, // Opcional por si quieres filtrar por rol
  },
];
