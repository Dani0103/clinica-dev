import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useEscalaWeefimService } from "@/services";
import type { EscalaWeefimPayload } from "@/services";
import FormModalShell from "./FormModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
  onSuccess: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const initial: EscalaWeefimPayload = {
  paciente_id: 0,
  fecha_evaluacion: today(),
  subtotal_autocuidado: 0,
  subtotal_movilidad: 0,
  subtotal_cognicion: 0,
};

const MAX_SCORE = 126;

const EscalaWeefimModal = ({
  isOpen,
  onClose,
  pacienteId,
  onSuccess,
}: Props) => {
  const { create, isLoading } = useEscalaWeefimService();
  const [form, setForm] = useState<EscalaWeefimPayload>(initial);

  useEffect(() => {
    if (isOpen) setForm({ ...initial, paciente_id: pacienteId });
  }, [isOpen, pacienteId]);

  const total = useMemo(
    () =>
      Number(form.subtotal_autocuidado) +
      Number(form.subtotal_movilidad) +
      Number(form.subtotal_cognicion),
    [form],
  );

  const porcentaje = ((total / MAX_SCORE) * 100).toFixed(2);

  const setNum = (k: keyof EscalaWeefimPayload, v: string) => {
    const n = Math.max(0, Number(v) || 0);
    setForm((prev) => ({ ...prev, [k]: n }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({ ...form, paciente_id: pacienteId });
      toast.success("Escala WeeFIM registrada");
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((m: string) => toast.error(m)),
        );
      } else {
        toast.error(err.message || "No se pudo guardar la escala");
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
      title="Nueva escala WeeFIM"
      subtitle="Registra los subtotales por área para calcular la funcionalidad."
      isSubmitting={isLoading}
      submitLabel="Guardar evaluación"
      onSubmit={handleSubmit}
    >
      <div className="space-y-5">
        <div>
          <label className={lbl}>Fecha de evaluación *</label>
          <input
            type="date"
            required
            value={form.fecha_evaluacion}
            onChange={(e) =>
              setForm({ ...form, fecha_evaluacion: e.target.value })
            }
            className={fld}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={lbl}>Subtotal autocuidado *</label>
            <input
              type="number"
              min={0}
              required
              value={form.subtotal_autocuidado}
              onChange={(e) => setNum("subtotal_autocuidado", e.target.value)}
              className={fld}
            />
          </div>
          <div>
            <label className={lbl}>Subtotal movilidad *</label>
            <input
              type="number"
              min={0}
              required
              value={form.subtotal_movilidad}
              onChange={(e) => setNum("subtotal_movilidad", e.target.value)}
              className={fld}
            />
          </div>
          <div>
            <label className={lbl}>Subtotal cognición *</label>
            <input
              type="number"
              min={0}
              required
              value={form.subtotal_cognicion}
              onChange={(e) => setNum("subtotal_cognicion", e.target.value)}
              className={fld}
            />
          </div>
        </div>

        <div className="bg-clinic-bg-soft rounded-clinic-inner p-4 border border-clinic-primary/20">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-clinic-text-muted uppercase">
              Puntaje total
            </span>
            <span className="text-2xl font-bold text-clinic-primary">
              {total}
              <span className="text-base text-clinic-text-muted ml-1">
                / {MAX_SCORE}
              </span>
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs font-bold text-clinic-text-muted uppercase">
              Funcionalidad
            </span>
            <span className="text-base font-bold text-clinic-text-base">
              {porcentaje}%
            </span>
          </div>
          <p className="text-[10px] text-clinic-text-muted mt-2 italic">
            * El backend recalcula y persiste estos valores oficialmente.
          </p>
        </div>
      </div>
    </FormModalShell>
  );
};

export default EscalaWeefimModal;
