import { useState, useRef } from "react";
import {
  HiOutlineUpload,
  HiOutlineDocumentDownload,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { toast } from "react-toastify"; // Asumiendo que usas toastify para alertas más limpias

const MassiveUploads = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- VALIDACIÓN ROBUSTA DE ARCHIVOS ---
  const handleFileChange = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();

    // 1. Lista negra de extensiones peligrosas (prevenir dobles extensiones)
    const forbiddenPatterns = [".bat", ".exe", ".sh", ".js", ".vbs"];
    const hasForbiddenPattern = forbiddenPatterns.some((ext) =>
      fileName.includes(ext),
    );

    // 2. Validar extensión final permitida
    const isAllowedExtension =
      fileName.endsWith(".xlsx") || fileName.endsWith(".csv");

    if (hasForbiddenPattern || !isAllowedExtension) {
      // Si detectamos algo como .bat.xlsx o una extensión no permitida
      toast.error(
        "Archivo no permitido. Se detectó una extensión potencialmente peligrosa o no válida.",
      );

      // Limpiamos el input por seguridad
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Si pasa todas las pruebas
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 animate-fade-in">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files?.[0])}
        accept=".csv, .xlsx"
        className="hidden"
      />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-lg font-bold text-clinic-text-base">
            Procesamiento Masivo
          </h2>
          <p className="text-xs text-clinic-text-muted">
            Actualiza la base de datos de pacientes o agenda citas.
          </p>
        </div>
        <button className="flex items-center gap-2 text-clinic-primary text-sm font-bold hover:underline">
          <HiOutlineDocumentDownload size={20} />
          Descargar Plantilla Excel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
        {/* Lado Izquierdo: Configuración */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-4 bg-clinic-bg-soft rounded-clinic-inner border border-gray-100 shadow-sm">
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-3">
              Tipo de Carga
            </label>
            <div className="space-y-2">
              {[
                "Base de Pacientes",
                "Agenda de Citas",
                "Evoluciones Médicas",
              ].map((label, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-clinic-primary transition-all group"
                >
                  <input
                    type="radio"
                    name="uploadType"
                    className="w-4 h-4 text-clinic-primary focus:ring-clinic-primary border-gray-300"
                    defaultChecked={idx === 0}
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-clinic-primary">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-clinic-inner border border-amber-100">
            <HiOutlineExclamationCircle
              className="text-amber-500 shrink-0"
              size={20}
            />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Seguridad:</strong> El sistema bloquea archivos con
              múltiples extensiones o scripts ejecutables por integridad de los
              datos.
            </p>
          </div>
        </div>

        {/* Lado Derecho: Dropzone */}
        <div className="lg:col-span-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleContainerClick}
            className={`h-64 border-2 border-dashed rounded-clinic-card flex flex-col items-center justify-center transition-all cursor-pointer ${
              isDragging
                ? "border-clinic-primary bg-clinic-primary/5 scale-[1.01] shadow-lg shadow-clinic-primary/10"
                : "border-gray-200 bg-gray-50 hover:bg-white hover:border-clinic-primary/40"
            }`}
          >
            {!file ? (
              <>
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <HiOutlineUpload size={32} className="text-clinic-primary" />
                </div>
                <p className="text-sm font-bold text-clinic-text-base">
                  Arrastra tu archivo aquí
                </p>
                <p className="text-xs text-clinic-text-muted mt-1">
                  o haz clic para buscar
                </p>
              </>
            ) : (
              <div
                className="flex flex-col items-center animate-bounce-in"
                onClick={(e) => e.stopPropagation()}
              >
                <HiOutlineCheckCircle
                  size={52}
                  className="text-green-500 mb-2"
                />
                <p className="text-sm font-bold text-clinic-text-base text-center px-4">
                  {file.name}
                </p>
                <p className="text-xs text-clinic-text-muted">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <button
                  onClick={() => setFile(null)}
                  className="mt-6 text-xs text-red-500 font-bold hover:text-red-700 hover:underline px-4 py-2 bg-red-50 rounded-full transition-colors"
                >
                  Quitar archivo y elegir otro
                </button>
              </div>
            )}
          </div>

          <button
            disabled={!file}
            className={`w-full mt-6 py-4 rounded-clinic-inner font-bold text-white shadow-lg transition-all ${
              file
                ? "bg-clinic-primary hover:bg-opacity-90 shadow-clinic-primary/20 active:scale-[0.99]"
                : "bg-gray-300 cursor-not-allowed opacity-60"
            }`}
          >
            Iniciar Procesamiento Masivo
          </button>
        </div>
      </div>
    </div>
  );
};

export default MassiveUploads;
