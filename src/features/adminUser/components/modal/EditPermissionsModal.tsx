import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import type {
  USERINFO,
  AdminContextType,
} from "@/types/AdminUser/UsersManagement";
import { useUserService } from "@/services";

interface EditPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: USERINFO | null;
  onSuccess?: () => void;
}

const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const ctx = useOutletContext<AdminContextType | undefined>();
  const { update, isLoading } = useUserService();

  const [rolId, setRolId] = useState<number | "">("");
  const [especialidadId, setEspecialidadId] = useState<number | "">("");

  useEffect(() => {
    if (user && isOpen) {
      setRolId(user.rol_id ?? "");
      setEspecialidadId(user.especialidad_id ?? "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const selectedRolNombre =
    ctx?.rol.find((r) => Number(r.id) === Number(rolId))?.nombre?.toUpperCase() ||
    "";
  const isMedico = selectedRolNombre.includes("MÉDICO") || selectedRolNombre.includes("MEDICO");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rolId) {
      toast.warning("Selecciona un rol válido.");
      return;
    }

    try {
      await update(user.id, {
        rol_id: Number(rolId),
        especialidad_id: isMedico && especialidadId ? Number(especialidadId) : undefined,
      });
      toast.success("Permisos actualizados correctamente");
      onSuccess?.();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg)),
        );
      } else {
        toast.error(err.message || "No se pudieron actualizar los permisos");
      }
    }
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
            {user.nombre}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
              Rol de Sistema
            </label>
            <select
              value={rolId}
              onChange={(e) => setRolId(e.target.value ? Number(e.target.value) : "")}
              className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm bg-white"
            >
              <option value="" disabled>
                Selecciona un rol...
              </option>
              {ctx?.rol.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {isMedico && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-1.5">
                Especialidad Clínica
              </label>
              <select
                value={especialidadId}
                onChange={(e) =>
                  setEspecialidadId(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full p-3 border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/10 transition-all text-sm bg-white"
              >
                <option value="">Sin especialidad</option>
                {ctx?.especialidad.map((es) => (
                  <option key={es.id} value={es.id}>
                    {es.nombre}
                  </option>
                ))}
              </select>
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
              disabled={isLoading}
              className={`flex-1 py-3 text-white text-sm font-bold rounded-clinic-inner shadow-lg shadow-clinic-primary/20 transition-all ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-clinic-primary hover:bg-opacity-90"}`}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPermissionsModal;
