import { useMemo, useState } from "react";
import { HiOutlineUserRemove, HiX } from "react-icons/hi";
import { toast } from "react-toastify";
import type { USERINFO } from "@/types/AdminUser/UsersManagement";
import { useUserService } from "@/services";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: USERINFO[];
  onSuccess?: () => void;
}

const RemoveUserModal = ({ isOpen, onClose, users, onSuccess }: Props) => {
  const { desactivar, isLoading } = useUserService();
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [motivo, setMotivo] = useState("");

  const usuariosActivos = useMemo(
    () => users.filter((u) => u.estado),
    [users],
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.warning("Selecciona el profesional a inactivar.");
      return;
    }

    try {
      await desactivar(selectedUserId);
      toast.success(
        motivo
          ? "Usuario desactivado. Motivo registrado en la sesión."
          : "Usuario desactivado correctamente.",
      );
      setSelectedUserId("");
      setMotivo("");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo desactivar al usuario.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-clinic-card shadow-xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-red-50/50">
          <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
            <HiOutlineUserRemove className="text-red-500" />
            Baja de Usuario
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-[11px] font-medium border border-red-100 leading-tight">
            ⚠️ <b>IMPORTANTE:</b> El usuario quedará marcado como inactivo. Los
            registros históricos permanecen intactos, pero perderá acceso al
            sistema y no podrá tomar nuevas terapias.
          </div>

          <div>
            <label className="block text-xs font-bold text-clinic-text-base uppercase mb-1">
              Usuario a inactivar
            </label>
            <select
              value={selectedUserId}
              onChange={(e) =>
                setSelectedUserId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-red-400 outline-none bg-white"
            >
              <option value="">Seleccione usuario...</option>
              {usuariosActivos.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} — {u.rol}
                  {u.especialidad ? ` (${u.especialidad})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-clinic-text-base uppercase mb-1">
              Motivo de la Baja
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-red-400 outline-none resize-none h-20"
              placeholder="Describa brevemente el motivo..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedUserId}
              className={`px-4 py-2 text-sm font-bold text-white rounded-md transition-colors shadow-sm ${isLoading || !selectedUserId ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              {isLoading ? "Procesando..." : "Confirmar Inactivación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemoveUserModal;
