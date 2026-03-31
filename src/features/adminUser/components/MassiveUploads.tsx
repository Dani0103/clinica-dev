import { HiOutlineUpload } from "react-icons/hi";

const MassiveUploads = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-clinic-text-muted animate-fade-in">
      <HiOutlineUpload
        size={48}
        className="mb-4 opacity-50 text-clinic-primary"
      />
      <h3 className="text-lg font-bold text-clinic-text-base">
        Carga Masiva de Pacientes y Agendas
      </h3>
      <p className="text-sm mt-2 text-center max-w-md">
        Zona de Drag & Drop para subir archivos Excel/CSV y procesar evoluciones
        masivas.
      </p>
    </div>
  );
};

export default MassiveUploads;
