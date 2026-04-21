import type { OptionItem } from "@/types/AdminUser/UsersManagement";
import { useState } from "react";
import { HiOutlinePlus, HiX, HiUserGroup, HiUser } from "react-icons/hi";
import NewDoctorModal from "./modal/NewDoctorModal";
import NewPatientModal from "./modal/NewPatientModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rol: OptionItem[];
  especialidad: OptionItem[];
}

const NewUserModal = ({ isOpen, onClose, rol, especialidad }: Props) => {
  const [userType, setUserType] = useState<"MEDICO" | "PACIENTE">("MEDICO");
  const [hasTutor, setHasTutor] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-clinic-card shadow-xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
            <HiOutlinePlus className="text-clinic-primary" /> Nuevo Registro
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiX size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-hidden">
          {/* SELECTOR DE TIPO DE USUARIO */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setUserType("MEDICO")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                userType === "MEDICO"
                  ? "bg-white text-clinic-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <HiUser /> Médico
            </button>
            <button
              onClick={() => setUserType("PACIENTE")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                userType === "PACIENTE"
                  ? "bg-white text-clinic-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <HiUserGroup /> Paciente
            </button>
          </div>
          <div className="space-y-4 overflow-auto">
            {/* --- SECCIÓN MÉDICO --- */}
            {userType === "MEDICO" && (
              <NewDoctorModal rol={rol} especialidad={especialidad} />
            )}

            {/* --- SECCIÓN PACIENTE (Se mantiene igual) --- */}
            {userType === "PACIENTE" && <NewPatientModal />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUserModal;
