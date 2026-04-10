import React, { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

interface NewObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewObjectiveModal: React.FC<NewObjectiveModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    rol_asignado: "MÉDICO",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando nuevo objetivo:", formData);
    // Aquí conectarías con tu hook execute()
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-clinic-card shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
        {/* Header del Modal */}
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
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre del Objetivo */}
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

          {/* Rol Responsable */}
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
              Rol Responsable
            </label>
            <select
              value={formData.rol_asignado}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rol_asignado: e.target.value as any,
                })
              }
              className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm bg-white"
            >
              <option value="MÉDICO">Médico / Especialista</option>
              <option value="RECEPCIÓN">Recepción / Administrativo</option>
              <option value="ADMIN">Administrador</option>
            </select>
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

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-clinic-inner transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-clinic-primary text-white text-sm font-bold rounded-clinic-inner hover:bg-opacity-90 shadow-lg shadow-clinic-primary/20 transition-all"
            >
              Crear Objetivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewObjectiveModal;
