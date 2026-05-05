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
import { toast } from "react-toastify";
import type { USERINFO } from "@/types/AdminUser/UsersManagement";
import { useUserService } from "@/services";
import { rolDisplayName } from "@/utils/roles";

import DataTable from "@/components/common/DataTable";
import PageLoader from "@/components/common/PageLoader";
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
  const { list, activar, desactivar, isLoading } = useUserService();

  const fetchUsers = async () => {
    try {
      const response = await list();
      if (response && response.data) {
        const mappedUsers: USERINFO[] = response.data.map((u: any) => ({
          id: u.id,
          nombre: u.nombres
            ? `${u.nombres} ${u.apellidos || ""}`.trim()
            : u.nombre || "Sin Nombre",
          // Leer SIEMPRE del backend (rol.nombre). Si por alguna razón no llega,
          // mostramos un placeholder neutro en vez de inventar el rol por id.
          rol: rolDisplayName(u.rol?.nombre),
          rol_id: u.rol_id ?? u.rol?.id,
          especialidad: u.especialidad?.nombre,
          especialidad_id: u.especialidad_id ?? u.especialidad?.id,
          correo: u.correo,
          estado:
            u.esta_activo !== undefined
              ? !!u.esta_activo
              : u.activo !== undefined
                ? !!u.activo
                : true,
        }));
        setUsers(mappedUsers);
      }
    } catch (error: any) {
      toast.error(error?.message || "Error al cargar los usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  const handleToggleActivo = async (user: USERINFO) => {
    try {
      if (user.estado) {
        await desactivar(user.id);
        toast.success(`Usuario ${user.nombre} desactivado`);
      } else {
        await activar(user.id);
        toast.success(`Usuario ${user.nombre} activado`);
      }
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar el estado");
    }
  };

  const columns: Column<USERINFO>[] = [
    {
      header: "Profesional / Usuario",
      accessor: "nombre",
      className: "font-medium",
    },
    {
      header: "Rol",
      accessor: (user) => {
        const colorByRol: Record<string, string> = {
          Administrador: "bg-purple-100 text-purple-700",
          Médico: "bg-blue-100 text-blue-700",
          Coordinador: "bg-emerald-100 text-emerald-700",
          Recepcionista: "bg-orange-100 text-orange-700",
        };
        const cls = colorByRol[user.rol] || "bg-gray-100 text-gray-700";
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${cls}`}>
            {user.rol} {user.especialidad && `(${user.especialidad})`}
          </span>
        );
      },
    },
    {
      header: "Estado",
      accessor: (user) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActivo(user);
          }}
          className={`flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70 ${user.estado ? "text-green-600" : "text-red-500"}`}
          title={user.estado ? "Click para desactivar" : "Click para activar"}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${user.estado ? "bg-green-500" : "bg-red-500"}`}
          />
          {user.estado ? "Activo" : "Inactivo"}
        </button>
      ),
    },
    {
      header: "Correo",
      accessor: (user) => (
        <span className="text-xs text-clinic-text-muted">
          {user.correo || "—"}
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
              e.stopPropagation();
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
    return <Outlet context={{ ...(contextFromAdmin as any), onUserCreated: fetchUsers }} />;
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

          <button
            onClick={() => navigate("nuevo-medico")}
            className="flex-1 sm:flex-none bg-clinic-primary text-white px-4 py-2 rounded-clinic-inner flex items-center justify-center gap-2 font-bold text-sm shadow-md hover:bg-clinic-primary/90 transition-all"
          >
            <HiOutlinePlus size={18} /> <span className="truncate">Nuevo Médico</span>
          </button>

          <button
            onClick={() => navigate("nuevo-paciente")}
            className="flex-1 sm:flex-none bg-white border-2 border-clinic-primary text-clinic-primary px-4 py-2 rounded-clinic-inner flex items-center justify-center gap-2 font-bold text-sm hover:bg-clinic-primary/5 transition-all"
          >
            <HiOutlinePlus size={18} /> <span className="truncate">Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <PageLoader variant="section" />
      ) : (
        <DataTable data={users} columns={columns} />
      )}

      <RemoveUserModal
        isOpen={activeModal === "remove"}
        users={users}
        onClose={closeModal}
        onSuccess={() => {
          fetchUsers();
          closeModal();
        }}
      />
      <EditPermissionsModal
        isOpen={activeModal === "edit"}
        onClose={closeModal}
        user={selectedUser}
        onSuccess={() => {
          fetchUsers();
          closeModal();
        }}
      />
    </div>
  );
};

export default UsersManagement;
