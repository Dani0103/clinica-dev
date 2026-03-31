import { HiOutlineClipboardList } from "react-icons/hi";

const ClinicalManagement = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-clinic-text-muted animate-fade-in">
      <HiOutlineClipboardList size={48} className="mb-4 opacity-50" />
      <h3 className="text-lg font-bold text-clinic-text-base">
        Gestión de Objetivos y Actividades
      </h3>
      <p className="text-sm mt-2 text-center max-w-md">
        Aquí construiremos la interfaz para crear objetivos, actividades,
        respuestas de requisitos y asignarlos a roles específicos.
      </p>
    </div>
  );
};

export default ClinicalManagement;
