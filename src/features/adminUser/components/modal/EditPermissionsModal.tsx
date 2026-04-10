import React, { useState, useEffect } from "react";
import type { USERINFO } from "@/types/AdminUser/UsersManagement";

interface EditPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: USERINFO | null;
}

const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [role, setRole] = useState("");
  const [specialty, setSpecialty] = useState("");

  useEffect(() => {
    if (user) {
      setRole(user.rol || "");
      setSpecialty(user.especialidad || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos actualizados:", { id: user?.id, role, specialty });
    // Aquí llamarías a tu execute() del useApi
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-clinic-card p-6 shadow-2xl animate-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-clinic-text-base mb-1">
          Editar Permisos
        </h3>
        <p className="text-sm text-clinic-text-muted mb-6">
          Modificando acceso para:{" "}
          <span className="font-semibold text-clinic-primary">
            {user?.nombre}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Selector de Rol */}
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
              Rol de Sistema
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm"
            >
              <option value="ADMIN">Administrador</option>
              <option value="MÉDICO">Médico</option>
              <option value="RECEPCIÓN">Recepción / Administrativo</option>
            </select>
          </div>

          {/* Campo Especialidad: Solo visible si el rol es Médico */}
          {role === "MÉDICO" && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
                Especialidad Clínica
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ej. Cardiología, Pediatría..."
                className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm"
              />
              <p className="text-[10px] text-clinic-text-muted mt-1.5">
                * Requerido para la firma en historias clínicas.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPermissionsModal;
