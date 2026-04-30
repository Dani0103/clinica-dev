import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useConsultaEspecialistaService,
  useUserService,
} from "@/services";
import type { ConsultaEspecialistaPayload } from "@/services";
import { useAuth } from "@/context/AuthContext";
import FormModalShell from "./FormModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
  onSuccess: () => void;
}

interface EspecialidadOption {
  id: number;
  nombre: string;
}

const initial: ConsultaEspecialistaPayload = {
  paciente_id: 0,
  especialidad_id: 0,
  motivo_consulta: "",
  examen_mental: "",
  diagnostico: "",
  concepto: "",
  escala_eeag: "",
  firma_electronica: "",
};

const ConsultaEspecialistaModal = ({
  isOpen,
  onClose,
  pacienteId,
  onSuccess,
}: Props) => {
  const { user } = useAuth();
  const { create, isLoading } = useConsultaEspecialistaService();
  const userService = useUserService();

  const [form, setForm] = useState<ConsultaEspecialistaPayload>(initial);
  const [especialidades, setEspecialidades] = useState<EspecialidadOption[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      ...initial,
      paciente_id: pacienteId,
      especialidad_id: user?.especialidad_id || 0,
      firma_electronica: user?.nombre || "",
    });

    (async () => {
      try {
        const res = await userService.especialidades();
        setEspecialidades(res?.data ?? []);
      } catch {
        /* silencioso */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pacienteId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.especialidad_id) {
      toast.warning("Selecciona la especialidad de la consulta.");
      return;
    }
    if (!form.firma_electronica) {
      toast.warning("Falta la firma electrónica del profesional.");
      return;
    }
    try {
      await create({
        ...form,
        paciente_id: pacienteId,
        examen_mental: form.examen_mental || undefined,
        escala_eeag: form.escala_eeag || undefined,
      });
      toast.success("Consulta especialista registrada");
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((m: string) => toast.error(m)),
        );
      } else {
        toast.error(err.message || "No se pudo guardar la consulta");
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
      title="Nueva consulta de especialista"
      subtitle="El registro se almacena cifrado y se firma con tu identidad."
      isSubmitting={isLoading}
      submitLabel="Firmar y guardar"
      onSubmit={handleSubmit}
      size="xl"
    >
      <div className="space-y-5">
        <div>
          <label className={lbl}>Especialidad *</label>
          <select
            value={form.especialidad_id || ""}
            onChange={(e) =>
              setForm({
                ...form,
                especialidad_id: e.target.value ? Number(e.target.value) : 0,
              })
            }
            className={`${fld} bg-white`}
            required
          >
            <option value="">Seleccionar especialidad...</option>
            {especialidades.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={lbl}>Motivo de consulta *</label>
          <textarea
            required
            value={form.motivo_consulta}
            onChange={(e) =>
              setForm({ ...form, motivo_consulta: e.target.value })
            }
            className={ta}
          />
        </div>

        <div>
          <label className={lbl}>Examen mental</label>
          <textarea
            value={form.examen_mental}
            onChange={(e) =>
              setForm({ ...form, examen_mental: e.target.value })
            }
            className={ta}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Diagnóstico *</label>
            <textarea
              required
              value={form.diagnostico}
              onChange={(e) =>
                setForm({ ...form, diagnostico: e.target.value })
              }
              className={ta}
            />
          </div>
          <div>
            <label className={lbl}>Concepto *</label>
            <textarea
              required
              value={form.concepto}
              onChange={(e) => setForm({ ...form, concepto: e.target.value })}
              className={ta}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Escala EEAG</label>
            <input
              value={form.escala_eeag}
              onChange={(e) =>
                setForm({ ...form, escala_eeag: e.target.value })
              }
              maxLength={255}
              placeholder="Ej. 70 - Síntomas leves"
              className={fld}
            />
          </div>
          <div>
            <label className={lbl}>Firma electrónica *</label>
            <input
              required
              value={form.firma_electronica}
              onChange={(e) =>
                setForm({ ...form, firma_electronica: e.target.value })
              }
              readOnly
              className={`${fld} bg-gray-50 text-gray-600 font-bold text-center`}
            />
          </div>
        </div>
      </div>
    </FormModalShell>
  );
};

export default ConsultaEspecialistaModal;
