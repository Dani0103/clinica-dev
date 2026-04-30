import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useOrdenMedicaService } from "@/services";
import type { OrdenMedicaPayload } from "@/services";
import FormModalShell from "./FormModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
  onSuccess: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const initial: OrdenMedicaPayload = {
  paciente_id: 0,
  descripcion: "",
  fecha_orden: today(),
};

const OrdenMedicaModal = ({ isOpen, onClose, pacienteId, onSuccess }: Props) => {
  const { create, isLoading } = useOrdenMedicaService();
  const [form, setForm] = useState<OrdenMedicaPayload>(initial);

  useEffect(() => {
    if (isOpen) setForm({ ...initial, paciente_id: pacienteId });
  }, [isOpen, pacienteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({ ...form, paciente_id: pacienteId });
      toast.success("Orden médica registrada");
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((m: string) => toast.error(m)),
        );
      } else {
        toast.error(err.message || "No se pudo guardar la orden");
      }
    }
  };

  const fld =
    "w-full p-3 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none transition-all";
  const lbl = "block text-xs font-bold text-clinic-text-muted uppercase mb-1.5";

  return (
    <FormModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva orden médica"
      subtitle="Registra la indicación clínica para el paciente."
      isSubmitting={isLoading}
      submitLabel="Guardar orden"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <label className={lbl}>Fecha de la orden *</label>
          <input
            type="date"
            required
            value={form.fecha_orden}
            onChange={(e) => setForm({ ...form, fecha_orden: e.target.value })}
            className={fld}
          />
        </div>
        <div>
          <label className={lbl}>Descripción *</label>
          <textarea
            required
            rows={6}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="Detalle de la orden, medicamentos, exámenes, indicaciones..."
            className={`${fld} resize-y`}
          />
        </div>
      </div>
    </FormModalShell>
  );
};

export default OrdenMedicaModal;
