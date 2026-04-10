import { useState } from "react";
import {
  HiOutlineUserRemove,
  HiOutlinePlus,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import type { USERINFO } from "@/types/AdminUser/UsersManagement";
import { MOCK_USERS } from "@/config/mocks/mockUsers";

// Componentes
import DataTable from "@/components/common/DataTable";
import NewUserModal from "@/features/adminUser/components/modal/NewUserModal";
import RemoveUserModal from "@/features/adminUser/components/modal/RemoveUserModal";
import EditPermissionsModal from "@/features/adminUser/components/modal/EditPermissionsModal";
import type { Column } from "@/types/tableData";

const UsersManagement = () => {
  const [selectedUser, setSelectedUser] = useState<USERINFO | null>(null);
  const [activeModal, setActiveModal] = useState<
    "new" | "edit" | "remove" | null
  >(null);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  // --- DEFINICIÓN DE COLUMNAS ---
  const columns: Column<USERINFO>[] = [
    {
      header: "Profesional / Usuario",
      accessor: "nombre",
      className: "font-medium",
    },
    {
      header: "Rol",
      accessor: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
            user.rol === "MÉDICO"
              ? "bg-blue-100 text-blue-700"
              : user.rol === "ADMIN"
                ? "bg-purple-100 text-purple-700"
                : "bg-orange-100 text-orange-700"
          }`}
        >
          {user.rol} {user.especialidad && `(${user.especialidad})`}
        </span>
      ),
    },
    {
      header: "Estado",
      accessor: (user) => (
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${user.estado ? "text-green-600" : "text-red-500"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${user.estado ? "bg-green-500" : "bg-red-500"}`}
          />
          {user.estado ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "Último Acceso",
      accessor: () => (
        <span className="text-xs italic text-clinic-text-muted">
          Hoy, 08:30 AM
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      accessor: (user) => (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita el click en la fila
              setSelectedUser(user);
              setActiveModal("edit");
            }}
            className="p-2 text-clinic-text-muted hover:text-clinic-primary hover:bg-clinic-primary/10 rounded-full transition-all"
          >
            <HiOutlinePencilAlt size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-clinic-text-base">
          Gestión de Personal
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveModal("remove")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <HiOutlineUserRemove size={16} className="text-red-500" />
            Baja y Reasignación
          </button>
          <button
            onClick={() => setActiveModal("new")}
            className="bg-clinic-primary text-white px-4 py-2 rounded-clinic-inner flex items-center gap-2 font-bold text-sm"
          >
            <HiOutlinePlus size={18} /> Nuevo Usuario
          </button>
        </div>
      </div>

      {/* --- USO DEL COMPONENTE GENÉRICO --- */}
      <DataTable data={MOCK_USERS} columns={columns} />

      <NewUserModal isOpen={activeModal === "new"} onClose={closeModal} />
      <RemoveUserModal isOpen={activeModal === "remove"} onClose={closeModal} />
      <EditPermissionsModal
        isOpen={activeModal === "edit"}
        onClose={closeModal}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersManagement;
