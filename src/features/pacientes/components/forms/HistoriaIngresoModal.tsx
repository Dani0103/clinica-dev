import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHistoriaIngresoService } from "@/services";
import type { HistoriaIngresoPayload } from "@/services";
import FormModalShell from "./FormModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
  onSuccess: () => void;
}

const initial: HistoriaIngresoPayload = {
  paciente_id: 0,
  motivo_consulta: "",
  enfermedad_actual: "",
  anamnesis: "",
  ant_personales: "",
  ant_familiares: "",
  ant_quirurgicos: "",
  ant_patologicos: "",
  ant_farmacologicos: "",
  ant_ginecolologicos: "",
  impresion_diagnostica: "",
  origen_enfermedad: "",
  plan_tratamiento: "",
  pronostico: "",
};

const HistoriaIngresoModal = ({ isOpen, onClose, pacienteId, onSuccess }: Props) => {
  const { create, isLoading } = useHistoriaIngresoService();
  const [form, setForm] = useState<HistoriaIngresoPayload>(initial);

  useEffect(() => {
    if (isOpen) setForm({ ...initial, paciente_id: pacienteId });
  }, [isOpen, pacienteId]);

  const setField = (k: keyof HistoriaIngresoPayload, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({
        ...form,
        paciente_id: pacienteId,
        // limpiamos opcionales vacíos para no enviar strings vacíos
        ant_personales: form.ant_personales || undefined,
        ant_familiares: form.ant_familiares || undefined,
        ant_quirurgicos: form.ant_quirurgicos || undefined,
        ant_patologicos: form.ant_patologicos || undefined,
        ant_farmacologicos: form.ant_farmacologicos || undefined,
        ant_ginecolologicos: form.ant_ginecolologicos || undefined,
      });
      toast.success("Historia de ingreso guardada");
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((m: string) => toast.error(m)),
        );
      } else {
        toast.error(err.message || "No se pudo guardar la historia");
      }
    }
  };

  const fld =
    "w-full p-3 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none transition-all";
  const lbl = "block text-xs font-bold text-clinic-text-muted uppercase mb-1.5";
  const ta = `${fld} resize-y min-h-[80px]`;

  return (
    <FormModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva historia clínica de ingreso"
      subtitle="Captura completa del ingreso del paciente."
      isSubmitting={isLoading}
      submitLabel="Guardar historia"
      onSubmit={handleSubmit}
      size="xl"
    >
      <div className="space-y-6">
        <section className="space-y-4">
          <h4 className="text-xs font-black text-gray-400 uppercase">
            Motivo y enfermedad
          </h4>
          <div>
            <label className={lbl}>Motivo de consulta *</label>
            <textarea
              required
              value={form.motivo_consulta}
              onChange={(e) => setField("motivo_consulta", e.target.value)}
              className={ta}
            />
          </div>
          <div>
            <label className={lbl}>Enfermedad actual *</label>
            <textarea
              required
              value={form.enfermedad_actual}
              onChange={(e) => setField("enfermedad_actual", e.target.value)}
              className={ta}
            />
          </div>
          <div>
            <label className={lbl}>Anamnesis *</label>
            <textarea
              required
              value={form.anamnesis}
              onChange={(e) => setField("anamnesis", e.target.value)}
              className={ta}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-black text-gray-400 uppercase">
            Antecedentes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Personales</label>
              <textarea
                value={form.ant_personales}
                onChange={(e) => setField("ant_personales", e.target.value)}
                className={ta}
              />
            </div>
            <div>
              <label className={lbl}>Familiares</label>
              <textarea
                value={form.ant_familiares}
                onChange={(e) => setField("ant_familiares", e.target.value)}
                className={ta}
              />
            </div>
            <div>
              <label className={lbl}>Quirúrgicos</label>
              <textarea
                value={form.ant_quirurgicos}
                onChange={(e) => setField("ant_quirurgicos", e.target.value)}
                className={ta}
              />
            </div>
            <div>
              <label className={lbl}>Patológicos</label>
              <textarea
                value={form.ant_patologicos}
                onChange={(e) => setField("ant_patologicos", e.target.value)}
                className={ta}
              />
            </div>
            <div>
              <label className={lbl}>Farmacológicos</label>
              <textarea
                value={form.ant_farmacologicos}
                onChange={(e) => setField("ant_farmacologicos", e.target.value)}
                className={ta}
              />
            </div>
            <div>
              <label className={lbl}>Ginecológicos</label>
              <textarea
                value={form.ant_ginecolologicos}
                onChange={(e) => setField("ant_ginecolologicos", e.target.value)}
                className={ta}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-black text-gray-400 uppercase">
            Diagnóstico y plan
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Impresión diagnóstica *</label>
              <textarea
                required
                value={form.impresion_diagnostica}
                onChange={(e) => setField("impresion_diagnostica", e.target.value)}
                className={ta}
              />
            </div>
            <div>
              <label className={lbl}>Origen de la enfermedad *</label>
              <input
                required
                value={form.origen_enfermedad}
                onChange={(e) => setField("origen_enfermedad", e.target.value)}
                placeholder="Ej. Común, Profesional, Accidente..."
                className={fld}
              />
            </div>
            <div className="md:col-span-2">
              <label className={lbl}>Plan de tratamiento *</label>
              <textarea
                required
                value={form.plan_tratamiento}
                onChange={(e) => setField("plan_tratamiento", e.target.value)}
                className={ta}
              />
            </div>
            <div className="md:col-span-2">
              <label className={lbl}>Pronóstico *</label>
              <textarea
                required
                value={form.pronostico}
                onChange={(e) => setField("pronostico", e.target.value)}
                className={ta}
              />
            </div>
          </div>
        </section>
      </div>
    </FormModalShell>
  );
};

export default HistoriaIngresoModal;
