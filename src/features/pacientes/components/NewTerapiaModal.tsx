import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { AppUrls } from "@/services/apiEndpoints";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

interface Respuesta {
  id: number;
  texto_predeterminado: string;
}

interface Actividad {
  id: number;
  nombre: string;
  respuestas: Respuesta[];
}

interface Objetivo {
  id: number;
  nombre: string;
  actividades: Actividad[];
}

interface NewTerapiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: any;
  onSuccess: () => void;
}

export default function NewTerapiaModal({ isOpen, onClose, paciente, onSuccess }: NewTerapiaModalProps) {
  const { user, hasPermiso } = useAuth();
  const { execute, isLoading } = useApi();
  const puedeRetroactivo = hasPermiso("terapias.retroactivo");

  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [step, setStep] = useState(1);

  // Selecciones del usuario
  const [selectedObjetivoId, setSelectedObjetivoId] = useState<number | "">("");
  const [selectedActividadId, setSelectedActividadId] = useState<number | "">("");

  // Resultados: key es respuesta_id
  const [resultados, setResultados] = useState<Record<number, { marcado: boolean; notas_libres: string }>>({});
  const [firma, setFirma] = useState("");
  const [fechaHora, setFechaHora] = useState<string>(""); // datetime-local; vacío = ahora

  useEffect(() => {
    if (isOpen) {
      fetchObjetivos();
      setStep(1);
      setSelectedObjetivoId("");
      setSelectedActividadId("");
      setResultados({});
      setFirma(user?.nombre || "");
      setFechaHora("");
    }
  }, [isOpen, user]);

  const fetchObjetivos = async () => {
    try {
      // Filtra por la especialidad del médico autenticado.
      // Si el usuario no tiene especialidad asignada, trae todos los objetivos.
      const params: Record<string, any> = {};
      if (user?.especialidad_id) {
        params.especialidad_id = user.especialidad_id;
      }

      const res = await execute(AppUrls.avanzarApi, "objetivos", {
        method: "GET",
        params,
      });
      if (res && res.data) {
        setObjetivos(res.data);
      }
    } catch (error) {
      toast.error("No se pudieron cargar los objetivos terapéuticos.");
    }
  };

  if (!isOpen || !paciente) return null;

  const currentObjetivo = objetivos.find(o => o.id === selectedObjetivoId);
  const currentActividad = currentObjetivo?.actividades.find(a => a.id === selectedActividadId);

  const handleNext = () => {
    if (step === 1) {
      if (!selectedObjetivoId || !selectedActividadId) {
        toast.warning("Debes seleccionar un objetivo y una actividad.");
        return;
      }

      const hasResults = Object.values(resultados).some(r => r.marcado || r.notas_libres);
      if (!hasResults) {
        toast.warning("Debes marcar al menos un resultado o añadir notas.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleRespuestaChange = (respuestaId: number, marcado: boolean) => {
    setResultados(prev => ({
      ...prev,
      [respuestaId]: { ...prev[respuestaId], marcado, notas_libres: prev[respuestaId]?.notas_libres || "" }
    }));
  };

  const handleNotasChange = (respuestaId: number, notas_libres: string) => {
    setResultados(prev => ({
      ...prev,
      [respuestaId]: { ...prev[respuestaId], marcado: prev[respuestaId]?.marcado || false, notas_libres }
    }));
  };

  const handleSubmit = async () => {
    if (!firma) {
      toast.warning("Debes ingresar tu firma electrónica para guardar la evolución.");
      return;
    }

    // Preparar el payload
    const resultadosArray = Object.entries(resultados)
      .filter(([_, data]) => data.marcado || data.notas_libres)
      .map(([id, data]) => ({
        respuesta_id: Number(id),
        marcado: data.marcado || false,
        notas_libres: data.notas_libres || ""
      }));

    const payload: Record<string, any> = {
      paciente_id: paciente.id,
      objetivo_id: selectedObjetivoId,
      actividad_id: selectedActividadId,
      especialidad_id: user?.especialidad_id || 1,
      firma_electronica: firma,
      resultados: resultadosArray,
    };

    // Solo enviar fecha_hora si el usuario la modificó (sino backend usa now()).
    if (fechaHora) {
      payload.fecha_hora = new Date(fechaHora).toISOString();
    }

    try {
      await execute(AppUrls.avanzarApi, "terapias", {
        method: "POST",
        body: payload,
      });
      toast.success("Evolución registrada exitosamente.");
      onSuccess();
      onClose();
    } catch (error: any) {
      // Mensajes específicos según validaciones del backend (cupo, franja, retroactivo).
      if (error?.status === 403) {
        toast.error(
          error?.message ||
            "No tienes permiso para registrar terapias retroactivas. Solicita al administrador.",
        );
      } else if (error?.status === 422) {
        const data = error?.payload?.data;
        if (data?.horas_programadas !== undefined) {
          toast.error(
            `Cupo mensual agotado (${data.horas_ejecutadas}/${data.horas_programadas}). Programa más citas antes de registrar.`,
          );
        } else {
          toast.error(error?.message || "No se pudo registrar la terapia.");
        }
      } else {
        toast.error(error?.message || "Error al registrar la terapia.");
      }
    }
  };

  const isRetroactivo = fechaHora ? new Date(fechaHora) < new Date(new Date().toDateString()) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-clinic-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* ENCABEZADO */}
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-clinic-text-base text-lg sm:text-xl">
              Registro de Terapia Clínica
            </h3>
            <p className="text-sm text-clinic-text-muted">
              Paciente:{" "}
              <span className="font-semibold text-clinic-primary">
                {paciente.nombres} {paciente.apellidos}
              </span>
            </p>
            {user?.especialidad && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-clinic-primary/10 text-clinic-primary">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {user.especialidad.nombre}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* CONTENIDO SCROLL */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

          {/* STEP INDICATOR */}
          <div className="flex items-center mb-8 justify-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 1 ? 'bg-clinic-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`w-16 h-1 mx-2 rounded ${step >= 2 ? 'bg-clinic-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 2 ? 'bg-clinic-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          </div>

          {/* --- PASO 1: OBJETIVO, ACTIVIDAD Y RESULTADOS --- */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-clinic-text-base mb-2">1. Seleccione el Objetivo Terapéutico</label>
                <select
                  className="w-full border border-gray-200 rounded-clinic-inner p-3 text-sm focus:border-clinic-primary outline-none bg-white"
                  value={selectedObjetivoId}
                  onChange={(e) => {
                    setSelectedObjetivoId(Number(e.target.value));
                    setSelectedActividadId(""); // reset actividad
                  }}
                >
                  <option value="" disabled>
                  {objetivos.length === 0
                    ? "No hay objetivos para tu especialidad"
                    : "Seleccionar objetivo..."}
                </option>
                  {objetivos.map(obj => (
                    <option key={obj.id} value={obj.id}>{obj.nombre}</option>
                  ))}
                </select>
              </div>

              {selectedObjetivoId !== "" && currentObjetivo && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-semibold text-clinic-text-base mb-2">2. Seleccione la Actividad Realizada</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentObjetivo.actividades.map(act => (
                      <button
                        key={act.id}
                        onClick={() => setSelectedActividadId(act.id)}
                        className={`p-3 text-sm text-left border rounded-clinic-inner transition-all ${selectedActividadId === act.id ? 'border-clinic-primary bg-clinic-primary-light/10 text-clinic-primary font-bold shadow-sm' : 'border-gray-200 hover:border-clinic-primary/50 text-clinic-text-base'}`}
                      >
                        {act.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedActividadId !== "" && currentActividad && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
                  <div className="bg-clinic-bg-soft p-4 rounded-clinic-inner border border-clinic-primary/20 mb-6">
                    <p className="text-xs text-clinic-text-muted font-bold uppercase mb-1">Evaluando Actividad</p>
                    <p className="text-lg text-clinic-text-base font-semibold">{currentActividad.nombre}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-clinic-text-base mb-3">3. Marque los resultados observados:</label>
                    <div className="space-y-4">
                      {currentActividad.respuestas.map(resp => (
                        <div key={resp.id} className="border border-gray-100 p-4 rounded-clinic-inner bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3 mb-3">
                            <input
                              type="checkbox"
                              id={`resp-${resp.id}`}
                              className="mt-1 w-4 h-4 text-clinic-primary rounded border-gray-300 focus:ring-clinic-primary"
                              checked={resultados[resp.id]?.marcado || false}
                              onChange={(e) => handleRespuestaChange(resp.id, e.target.checked)}
                            />
                            <label htmlFor={`resp-${resp.id}`} className="text-sm font-medium text-clinic-text-base cursor-pointer">
                              {resp.texto_predeterminado}
                            </label>
                          </div>

                          <textarea
                            placeholder="Notas adicionales sobre este resultado (Opcional)"
                            className="w-full text-sm p-3 border border-gray-200 rounded-md focus:border-clinic-primary outline-none min-h-[60px]"
                            value={resultados[resp.id]?.notas_libres || ""}
                            onChange={(e) => handleNotasChange(resp.id, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- PASO 2: FIRMA --- */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-clinic-text-base">Evolución lista para guardar</h3>
              <p className="text-sm text-clinic-text-muted">Por regulaciones clínicas, debe firmar este registro antes de guardarlo en la historia clínica del paciente.</p>

              <div className="max-w-md mx-auto text-left mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-clinic-text-base mb-2">
                    Fecha y hora de la sesión
                    <span className="ml-2 text-[10px] font-normal text-gray-400 normal-case">
                      (opcional — vacío = ahora)
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    value={fechaHora}
                    max={(() => {
                      const now = new Date();
                      const pad = (n: number) => String(n).padStart(2, "0");
                      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
                    })()}
                    onChange={(e) => setFechaHora(e.target.value)}
                    className="w-full border border-gray-200 rounded-clinic-inner p-3 text-sm focus:border-clinic-primary outline-none"
                  />
                  {isRetroactivo && (
                    <p
                      className={`text-[11px] mt-2 px-3 py-2 rounded-md ${
                        puedeRetroactivo
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {puedeRetroactivo
                        ? "⚠ Registro retroactivo. Quedará marcado en auditoría."
                        : "⚠ Solo administradores/supervisores pueden registrar fechas anteriores. Solicita autorización."}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-clinic-text-base mb-2">Firma Electrónica</label>
                  <input
                    type="text"
                    value={firma}
                    readOnly
                    className="w-full border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed rounded-clinic-inner p-3 text-sm focus:outline-none text-center font-bold"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between shrink-0">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-5 py-2 text-sm font-semibold text-clinic-text-muted hover:text-clinic-text-base transition-colors border border-gray-300 rounded-clinic-inner hover:bg-gray-100">
              Atrás
            </button>
          ) : (
            <div></div> // Espaciador
          )}

          {step < 2 ? (
            <button onClick={handleNext} className="px-6 py-2 bg-clinic-primary hover:bg-clinic-primary-light text-white text-sm font-bold rounded-clinic-inner transition-colors shadow-sm">
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2 text-white text-sm font-bold rounded-clinic-inner transition-colors shadow-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isLoading ? 'Guardando...' : 'Firmar y Guardar Terapia'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
