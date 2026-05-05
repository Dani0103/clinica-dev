import React, { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { toast } from "react-toastify";
import { useObjetivoService } from "@/services";
import { useEspecialidadService } from "@/services/especialidadService";

interface Especialidad {
  id: number;
  nombre: string;
}

interface NewObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialState = { nombre: "", descripcion: "", especialidad_id: "" };

const NewObjectiveModal: React.FC<NewObjectiveModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { create, isLoading } = useObjetivoService();
  const { list: listEspecialidades } = useEspecialidadService();
  const [formData, setFormData] = useState(initialState);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loadingEsp, setLoadingEsp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadEspecialidades();
    }
  }, [isOpen]);

  const loadEspecialidades = async () => {
    setLoadingEsp(true);
    try {
      const res = await listEspecialidades();
      if (res?.data) setEspecialidades(res.data);
    } catch {
      toast.error("No se pudieron cargar las especialidades.");
    } finally {
      setLoadingEsp(false);
    }
  };

  if (!isOpen) return null;

  const close = () => {
    setFormData(initialState);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      toast.warning("El nombre del objetivo es obligatorio.");
      return;
    }

    try {
      await create({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        especialidad_id: formData.especialidad_id
          ? Number(formData.especialidad_id)
          : null,
      });
      toast.success("Objetivo clínico creado correctamente");
      onSuccess?.();
      close();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg)),
        );
      } else {
        toast.error(err.message || "No se pudo crear el objetivo");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-clinic-card shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-clinic-text-base">
              Nuevo Objetivo Clínico
            </h3>
            <p className="text-xs text-clinic-text-muted">
              Define una meta general para los profesionales.
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
          {/* Especialidad */}
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
              Especialidad{" "}
              <span className="text-gray-400 font-normal normal-case">
                (opcional — sin especialidad = visible para todos)
              </span>
            </label>
            <select
              value={formData.especialidad_id}
              onChange={(e) =>
                setFormData({ ...formData, especialidad_id: e.target.value })
              }
              disabled={loadingEsp}
              className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm bg-white"
            >
              <option value="">
                {loadingEsp ? "Cargando especialidades..." : "Sin especialidad (general)"}
              </option>
              {especialidades.map((esp) => (
                <option key={esp.id} value={esp.id}>
                  {esp.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
              Nombre del Objetivo
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              placeholder="Ej: Valoración por Fisioterapia"
              className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
              Descripción o Propósito
            </label>
            <textarea
              rows={3}
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              placeholder="Describe brevemente de qué trata este proceso..."
              className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm resize-none"
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
              className={`flex-1 py-3 text-white text-sm font-bold rounded-clinic-inner shadow-lg shadow-clinic-primary/20 transition-all ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-clinic-primary hover:bg-opacity-90"}`}
            >
              {isLoading ? "Creando..." : "Crear Objetivo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewObjectiveModal;
