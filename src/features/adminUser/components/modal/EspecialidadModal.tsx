import React, { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { toast } from "react-toastify";
import { useEspecialidadService } from "@/services";
import type { Especialidad } from "@/services/especialidadService";

interface EspecialidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** Si se pasa, el modal opera en modo edición */
  especialidad?: Especialidad | null;
}

const EspecialidadModal: React.FC<EspecialidadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  especialidad,
}) => {
  const { create, update, isLoading } = useEspecialidadService();
  const [nombre, setNombre] = useState("");

  const esEdicion = !!especialidad;

  useEffect(() => {
    setNombre(especialidad?.nombre ?? "");
  }, [especialidad, isOpen]);

  if (!isOpen) return null;

  const close = () => {
    setNombre("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nombre.trim();
    if (!trimmed) {
      toast.warning("El nombre de la especialidad es obligatorio.");
      return;
    }

    try {
      if (esEdicion) {
        await update(especialidad!.id, { nombre: trimmed });
        toast.success("Especialidad actualizada correctamente");
      } else {
        await create({ nombre: trimmed });
        toast.success("Especialidad creada correctamente");
      }
      onSuccess();
      close();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg)),
        );
      } else {
        toast.error(err.message || "No se pudo guardar la especialidad");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-clinic-card shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-clinic-text-base">
              {esEdicion ? "Editar Especialidad" : "Nueva Especialidad"}
            </h3>
            <p className="text-xs text-clinic-text-muted">
              {esEdicion
                ? "Modifica el nombre de la especialidad."
                : "Agrega una nueva especialidad al sistema."}
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
              Nombre
            </label>
            <input
              type="text"
              required
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Fisioterapia"
              maxLength={120}
              className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={close}
              className="flex-1 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-clinic-inner transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-3 text-white text-sm font-bold rounded-clinic-inner shadow-lg shadow-clinic-primary/20 transition-all ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-clinic-primary hover:bg-opacity-90"
              }`}
            >
              {isLoading
                ? "Guardando..."
                : esEdicion
                  ? "Guardar cambios"
                  : "Crear Especialidad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EspecialidadModal;
