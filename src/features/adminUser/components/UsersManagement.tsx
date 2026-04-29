import { useState, useEffect } from "react";
import {
  Outlet,
  useNavigate,
  useOutlet,
  useOutletContext,
} from "react-router-dom";
import {
  HiOutlineUserRemove,
  HiOutlinePlus,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import type { USERINFO } from "@/types/AdminUser/UsersManagement";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

// Componentes
import DataTable from "@/components/common/DataTable";
import RemoveUserModal from "@/features/adminUser/components/modal/RemoveUserModal";
import EditPermissionsModal from "@/features/adminUser/components/modal/EditPermissionsModal";
import type { Column } from "@/types/tableData";

const UsersManagement = () => {
  const navigate = useNavigate();
  const hasChildRoute = useOutlet();
  const contextFromAdmin = useOutletContext();

  const [selectedUser, setSelectedUser] = useState<USERINFO | null>(null);
  const [activeModal, setActiveModal] = useState<
    "new" | "edit" | "remove" | null
  >(null);
  
  const [users, setUsers] = useState<USERINFO[]>([]);
  const { execute, isLoading } = useApi();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await execute(AppUrls.avanzarApi, API_ENDPOINTS.ADMIN.USERS, { method: "GET" });
      if (response && response.data) {
        // Mapeo defensivo por si el backend aún no retorna la estructura exacta
        const mappedUsers = response.data.map((u: any) => ({
          id: u.id,
          nombre: u.nombres ? `${u.nombres} ${u.apellidos || ''}` : (u.nombre || "Sin Nombre"),
          rol: u.rol?.nombre || (u.rol_id === 1 ? "ADMIN" : u.rol_id === 2 ? "MÉDICO" : "RECEPCIÓN"),
          especialidad: u.especialidad?.nombre || (u.especialidad_id ? `Especialidad ID: ${u.especialidad_id}` : ""),
          estado: u.activo !== undefined ? !!u.activo : true,
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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

  if (hasChildRoute) {
    return <Outlet context={contextFromAdmin} />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-clinic-text-base">
          Gestión de Personal
        </h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveModal("remove")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <HiOutlineUserRemove size={16} className="text-red-500" />
            <span className="truncate">Baja / Reasignación</span>
          </button>

          {/* Botón Médico */}
          <button
            onClick={() => navigate("nuevo-medico")}
            className="flex-1 sm:flex-none bg-clinic-primary text-white px-4 py-2 rounded-clinic-inner flex items-center justify-center gap-2 font-bold text-sm shadow-md hover:bg-clinic-primary/90 transition-all"
          >
            <HiOutlinePlus size={18} /> <span className="truncate">Nuevo Médico</span>
          </button>

          {/* Botón Paciente */}
          <button
            onClick={() => navigate("nuevo-paciente")}
            className="flex-1 sm:flex-none bg-white border-2 border-clinic-primary text-clinic-primary px-4 py-2 rounded-clinic-inner flex items-center justify-center gap-2 font-bold text-sm hover:bg-clinic-primary/5 transition-all"
          >
            <HiOutlinePlus size={18} /> <span className="truncate">Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* --- USO DEL COMPONENTE GENÉRICO --- */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-clinic-card border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-primary"></div>
        </div>
      ) : (
        <DataTable data={users} columns={columns} />
      )}

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
