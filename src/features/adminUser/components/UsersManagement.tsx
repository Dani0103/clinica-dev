import { useState } from "react";
import { HiOutlineUserRemove, HiOutlinePlus } from "react-icons/hi";

// Importación de sub-componentes
import NewUserModal from "./modal/NewUserModal";
import RemoveUserModal from "./modal/RemoveUserModal";

const UsersManagement = () => {
  const [activeModal, setActiveModal] = useState<
    "new" | "reset" | "remove" | null
  >(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="w-full h-full flex flex-col gap-3 animate-fade-in relative">
      {/* --- ENCABEZADO Y BOTONES --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-clinic-text-base">
          Gestión de Personal
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveModal("remove")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <HiOutlineUserRemove size={16} className="text-red-500" />
            Baja y Reasignación
          </button>
          <button
            onClick={() => setActiveModal("new")}
            className="flex items-center gap-2 px-4 py-2 bg-clinic-primary text-white rounded-clinic-inner text-sm font-bold hover:bg-opacity-90 transition-all shadow-sm"
          >
            <HiOutlinePlus size={18} />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* --- TABLA DE USUARIOS --- */}
      <div className="overflow-x-auto border border-gray-100 rounded-clinic-inner">
        <table className="w-full text-left text-sm text-clinic-text-base">
          <thead className="bg-clinic-bg-soft text-xs uppercase text-clinic-text-muted font-bold border-b border-gray-100">
            <tr>
              <th className="px-4 py-3">Profesional / Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Último Acceso</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 font-medium">Dr. Carlos Mendoza</td>
              <td className="px-4 py-3">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold">
                  MÉDICO
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{" "}
                  Activo
                </span>
              </td>
              <td className="px-4 py-3 text-clinic-text-muted text-xs">
                Hoy, 08:30 AM
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-clinic-primary hover:underline text-xs font-semibold">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- RENDERIZADO CONDICIONAL DE MODALES --- */}
      <NewUserModal isOpen={activeModal === "new"} onClose={closeModal} />

      <RemoveUserModal isOpen={activeModal === "remove"} onClose={closeModal} />

      {/* Aquí podrías agregar el ResetPasswordModal de la misma forma */}
    </div>
  );
};

export default UsersManagement;
