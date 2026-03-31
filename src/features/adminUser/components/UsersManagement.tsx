import { useState } from "react";
import {
  HiOutlineKey,
  HiOutlineUserRemove,
  HiOutlinePlus,
  HiX,
} from "react-icons/hi";

const UsersManagement = () => {
  // Estados para controlar qué modal está abierto
  const [activeModal, setActiveModal] = useState<
    "new" | "reset" | "remove" | null
  >(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* --- ENCABEZADO Y BOTONES --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-clinic-text-base">
          Gestión de Personal
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveModal("reset")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <HiOutlineKey size={16} className="text-orange-500" />
            Reset Claves
          </button>
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
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
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

      {/* =========================================
          MODAL 1: NUEVO USUARIO
          ========================================= */}
      {activeModal === "new" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-clinic-card shadow-xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
                <HiOutlinePlus className="text-clinic-primary" /> Crear Usuario
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-clinic-text-base mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-clinic-primary"
                  placeholder="Ej. Dra. Laura Gómez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-clinic-text-base mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-clinic-primary"
                  placeholder="usuario@avanzarips.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-clinic-text-base mb-1">
                    Identificación
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-clinic-primary"
                    placeholder="C.C. o T.P."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-clinic-text-base mb-1">
                    Rol en el Sistema
                  </label>
                  <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-clinic-primary bg-white">
                    <option value="">Seleccione...</option>
                    <option value="MEDICO">Médico/Especialista</option>
                    <option value="AUDITOR">Auditor Clínico</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-clinic-primary hover:bg-opacity-90 rounded-md transition-colors shadow-sm">
                Guardar Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL 2: RESET DE CLAVES
          ========================================= */}
      {activeModal === "reset" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-clinic-card shadow-xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-orange-50/50">
              <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
                <HiOutlineKey className="text-orange-500" /> Resetear Contraseña
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-clinic-text-muted leading-relaxed">
                Seleccione el usuario al que desea restablecerle el acceso. El
                sistema generará una contraseña temporal segura (Ley 2015) y se
                enviará por correo.
              </p>
              <div>
                <label className="block text-sm font-semibold text-clinic-text-base mb-1">
                  Usuario a resetear
                </label>
                <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-400 bg-white">
                  <option value="">Seleccione un usuario...</option>
                  <option value="1">Dr. Carlos Mendoza</option>
                  <option value="2">Ana Gómez (Auditor)</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors shadow-sm">
                Confirmar Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL 3: BAJA Y REASIGNACIÓN
          ========================================= */}
      {activeModal === "remove" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-clinic-card shadow-xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-red-50/50">
              <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
                <HiOutlineUserRemove className="text-red-500" /> Baja
                Profesional
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-xs font-medium border border-red-100">
                ⚠️ Al dar de baja a un médico, debe reasignar sus historias
                clínicas y agenda a otro profesional activo.
              </div>

              <div>
                <label className="block text-sm font-semibold text-clinic-text-base mb-1">
                  Profesional a dar de baja
                </label>
                <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-red-400 bg-white">
                  <option value="">Seleccione...</option>
                  <option value="1">Dr. Carlos Mendoza</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-clinic-text-base mb-1">
                  Reasignar pacientes/agenda a:
                </label>
                <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-clinic-primary bg-white">
                  <option value="">Seleccione profesional sustituto...</option>
                  <option value="3">Dra. Luisa Fernanda Perez</option>
                  <option value="4">Dr. Andrés Ramírez</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-clinic-text-base mb-1">
                  Motivo de la baja
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-red-400 resize-none h-20"
                  placeholder="Ej. Fin de contrato, Licencia..."
                ></textarea>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm">
                Procesar Baja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
