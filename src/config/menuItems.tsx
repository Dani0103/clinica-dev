// src/config/menuItems.tsx
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCog,
} from "react-icons/hi";

export const MENU_ITEMS = [
  {
    path: "/home",
    label: "Dashboard",
    icon: <HiOutlineViewGrid size={22} />,
    description: "Vista general del sistema",
  },
  {
    path: "/pacientes",
    label: "Pacientes",
    icon: <HiOutlineUsers size={22} />,
    description: "Gestión y registro de pacientes",
  },
  {
    path: "/agenda",
    label: "Agenda y Citas",
    icon: <HiOutlineCalendar size={22} />,
    description: "Calendario y programación",
  },
  {
    path: "/admin/usuarios",
    label: "Administración",
    icon: <HiOutlineCog size={22} />,
    description: "Configuración de usuarios y roles",
    isAdmin: true, // Opcional por si quieres filtrar por rol
  },
];
