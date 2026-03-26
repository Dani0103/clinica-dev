import { NavLink } from "react-router-dom";
import type { SidebarItemProps } from "@/types/sidebar";

type Props = SidebarItemProps & {
  to: string;
};

function SidebarItem({ icon, label, collapsed, to }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        w-full flex items-center gap-3 px-3 py-2 rounded-md transition
        ${collapsed ? "justify-center" : ""}
        ${
          isActive
            ? "bg-gray-800 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }
      `
      }
    >
      {icon}
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );
}

export default SidebarItem;
