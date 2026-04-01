import { useState } from "react";
import { HiOutlineUserRemove, HiX, HiUser, HiUserGroup } from "react-icons/hi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RemoveUserModal = ({ isOpen, onClose }: Props) => {
  // Estado para alternar entre Médico y Paciente
  const [userType, setUserType] = useState<"MEDICO" | "PACIENTE">("MEDICO");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-clinic-card shadow-xl flex flex-col overflow-hidden">
        {/* ENCABEZADO - Temática Roja (Peligro/Baja) */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-red-50/50">
          <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
            <HiOutlineUserRemove className="text-red-500" />
            {userType === "MEDICO" ? "Baja Profesional" : "Inactivar Paciente"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiX size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* SELECTOR DE TIPO (Igual al de creación para consistencia) */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setUserType("MEDICO")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${
                userType === "MEDICO"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <HiUser /> Médico
            </button>
            <button
              onClick={() => setUserType("PACIENTE")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${
                userType === "PACIENTE"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <HiUserGroup /> Paciente
            </button>
          </div>

          <form className="space-y-4">
            {/* --- FLUJO PARA MÉDICO --- */}
            {userType === "MEDICO" && (
              <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-[11px] font-medium border border-red-100 leading-tight">
                  ⚠️ <b>IMPORTANTE:</b> Al dar de baja a un profesional, el
                  sistema requiere que reasigne sus citas pendientes y registros
                  de historias clínicas a un sustituto activo.
                </div>

                <div>
                  <label className="block text-xs font-bold text-clinic-text-base uppercase mb-1">
                    Médico a retirar
                  </label>
                  <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-red-400 outline-none bg-white">
                    <option value="">Seleccione profesional...</option>
                    <option value="1">Dr. Carlos Mendoza - Cardiología</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-clinic-text-base uppercase mb-1">
                    Asignar carga prestacional a:
                  </label>
                  <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white">
                    <option value="">Seleccione sustituto...</option>
                    <option value="3">Dra. Luisa Fernanda Perez</option>
                    <option value="4">Dr. Andrés Ramírez</option>
                  </select>
                </div>
              </div>
            )}

            {/* --- FLUJO PARA PACIENTE --- */}
            {userType === "PACIENTE" && (
              <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-[11px] font-medium border border-amber-100 leading-tight">
                  ℹ️ <b>NOTA:</b> El paciente será marcado como "Inactivo". Sus
                  datos históricos permanecerán en el archivo de la clínica,
                  pero no podrá agendar nuevas citas.
                </div>

                <div>
                  <label className="block text-xs font-bold text-clinic-text-base uppercase mb-1">
                    Buscar Paciente
                  </label>
                  <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-red-400 outline-none bg-white">
                    <option value="">Seleccione paciente...</option>
                    <option value="10">Daniel Ruiz - CC 1020...</option>
                    <option value="11">Juan Pérez - CC 80...</option>
                  </select>
                </div>
              </div>
            )}

            {/* CAMPO COMÚN: MOTIVO */}
            <div>
              <label className="block text-xs font-bold text-clinic-text-base uppercase mb-1">
                Motivo de la Baja
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-red-400 outline-none resize-none h-20"
                placeholder="Describa brevemente el motivo..."
              />
            </div>
          </form>
        </div>

        {/* PIE DE MODAL */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm">
            Confirmar Procesar {userType === "MEDICO" ? "Baja" : "Inactivación"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveUserModal;
