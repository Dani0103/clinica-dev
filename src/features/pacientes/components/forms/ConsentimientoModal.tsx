import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useConsentimientoService } from "@/services";
import type {
  ConsentimientoPayload,
  EstadoConsentimiento,
} from "@/services";
import FormModalShell from "./FormModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
  onSuccess: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const initial: ConsentimientoPayload = {
  paciente_id: 0,
  tipo_consentimiento: "",
  estado: "Pendiente",
  firmado_por_representante: false,
  nombre_firmante: "",
  documento_firmante: "",
  fecha_firma: today(),
};

const ConsentimientoModal = ({
  isOpen,
  onClose,
  pacienteId,
  onSuccess,
}: Props) => {
  const { create, isLoading } = useConsentimientoService();
  const [form, setForm] = useState<ConsentimientoPayload>(initial);

  useEffect(() => {
    if (isOpen) setForm({ ...initial, paciente_id: pacienteId });
  }, [isOpen, pacienteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      form.firmado_por_representante &&
      (!form.nombre_firmante || !form.documento_firmante)
    ) {
      toast.warning("Completa nombre y documento del representante.");
      return;
    }
    try {
      await create({
        ...form,
        paciente_id: pacienteId,
        nombre_firmante: form.firmado_por_representante
          ? form.nombre_firmante
          : undefined,
        documento_firmante: form.firmado_por_representante
          ? form.documento_firmante
          : undefined,
      });
      toast.success("Consentimiento registrado");
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((m: string) => toast.error(m)),
        );
      } else {
        toast.error(err.message || "No se pudo guardar el consentimiento");
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
      title="Nuevo consentimiento legal"
      subtitle="Registra el consentimiento informado del paciente."
      isSubmitting={isLoading}
      submitLabel="Guardar consentimiento"
      onSubmit={handleSubmit}
    >
      <div className="space-y-5">
        <div>
          <label className={lbl}>Tipo de consentimiento *</label>
          <input
            required
            value={form.tipo_consentimiento}
            onChange={(e) =>
              setForm({ ...form, tipo_consentimiento: e.target.value })
            }
            placeholder="Ej. Consentimiento informado para terapia"
            className={fld}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Estado *</label>
            <select
              value={form.estado}
              onChange={(e) =>
                setForm({
                  ...form,
                  estado: e.target.value as EstadoConsentimiento,
                })
              }
              className={`${fld} bg-white`}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Firmado">Firmado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Fecha de firma *</label>
            <input
              type="date"
              required
              value={form.fecha_firma}
              onChange={(e) => setForm({ ...form, fecha_firma: e.target.value })}
              className={fld}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
          <span className="text-sm font-bold text-blue-800">
            ¿Firmado por representante?
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.firmado_por_representante}
              onChange={(e) =>
                setForm({
                  ...form,
                  firmado_por_representante: e.target.checked,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-clinic-primary"></div>
          </label>
        </div>

        {form.firmado_por_representante && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <div>
              <label className={lbl}>Nombre del representante *</label>
              <input
                required
                value={form.nombre_firmante}
                onChange={(e) =>
                  setForm({ ...form, nombre_firmante: e.target.value })
                }
                className={fld}
              />
            </div>
            <div>
              <label className={lbl}>Documento del representante *</label>
              <input
                required
                value={form.documento_firmante}
                onChange={(e) =>
                  setForm({ ...form, documento_firmante: e.target.value })
                }
                className={fld}
              />
            </div>
          </div>
        )}
      </div>
    </FormModalShell>
  );
};

export default ConsentimientoModal;
