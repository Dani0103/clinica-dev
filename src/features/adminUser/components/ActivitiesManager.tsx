import { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { toast } from "react-toastify";
import {
  useActividadService,
  useRespuestaService,
} from "@/services";
import type {
  ActividadApi,
  ObjetivoApi,
  RespuestaApi,
} from "./ClinicalManagement";

interface ActivitiesManagerProps {
  objective: ObjetivoApi;
  onBack: () => void;
  onTreeChange: () => void | Promise<void>;
}

export default function ActivitiesManager({
  objective,
  onBack,
  onTreeChange,
}: ActivitiesManagerProps) {
  const actividadService = useActividadService();
  const respuestaService = useRespuestaService();

  const activities: ActividadApi[] = objective.actividades ?? [];
  const [selectedActivity, setSelectedActivity] = useState<ActividadApi | null>(
    activities[0] ?? null,
  );

  // re-sincroniza la actividad seleccionada cuando el árbol se refresca arriba
  useEffect(() => {
    if (!activities.length) {
      setSelectedActivity(null);
      return;
    }
    if (!selectedActivity) {
      setSelectedActivity(activities[0]);
      return;
    }
    const refreshed = activities.find((a) => a.id === selectedActivity.id);
    setSelectedActivity(refreshed ?? activities[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objective]);

  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivityName, setNewActivityName] = useState("");
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [editActivityName, setEditActivityName] = useState("");

  const [isAddingResponse, setIsAddingResponse] = useState(false);
  const [newResponseText, setNewResponseText] = useState("");
  const [editingResponseId, setEditingResponseId] = useState<number | null>(null);
  const [editResponseText, setEditResponseText] = useState("");

  const handleSaveNewActivity = async () => {
    if (!newActivityName.trim()) return;
    try {
      await actividadService.create({
        objetivo_id: objective.id,
        nombre: newActivityName.trim(),
      });
      toast.success("Actividad creada");
      setNewActivityName("");
      setIsAddingActivity(false);
      await onTreeChange();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo crear la actividad");
    }
  };

  const handleSaveEditActivity = async (id: number) => {
    if (!editActivityName.trim()) return;
    try {
      await actividadService.update(id, { nombre: editActivityName.trim() });
      toast.success("Actividad actualizada");
      setEditingActivityId(null);
      await onTreeChange();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo actualizar la actividad");
    }
  };

  const handleDeleteActivity = async (
    id: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (!window.confirm("¿Eliminar esta actividad y sus respuestas?")) return;
    try {
      await actividadService.remove(id);
      toast.success("Actividad eliminada");
      if (selectedActivity?.id === id) setSelectedActivity(null);
      await onTreeChange();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo eliminar la actividad");
    }
  };

  const handleSaveNewResponse = async () => {
    if (!newResponseText.trim() || !selectedActivity) return;
    try {
      await respuestaService.create({
        actividad_id: selectedActivity.id,
        texto_predeterminado: newResponseText.trim(),
      });
      toast.success("Respuesta creada");
      setNewResponseText("");
      setIsAddingResponse(false);
      await onTreeChange();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo crear la respuesta");
    }
  };

  const handleSaveEditResponse = async (respId: number) => {
    if (!editResponseText.trim()) return;
    try {
      await respuestaService.update(respId, {
        texto_predeterminado: editResponseText.trim(),
      });
      toast.success("Respuesta actualizada");
      setEditingResponseId(null);
      await onTreeChange();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo actualizar la respuesta");
    }
  };

  const handleDeleteResponse = async (respId: number) => {
    if (!window.confirm("¿Eliminar esta respuesta?")) return;
    try {
      await respuestaService.remove(respId);
      toast.success("Respuesta eliminada");
      await onTreeChange();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo eliminar la respuesta");
    }
  };

  const respuestas: RespuestaApi[] = selectedActivity?.respuestas ?? [];

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-fade-in">
      <div className="flex items-start sm:items-center gap-3 bg-white p-4 rounded-clinic-card shadow-clinic-subtle border border-gray-100">
        <button
          onClick={onBack}
          className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-500 transition-colors shrink-0 mt-1 sm:mt-0"
          title="Volver a Objetivos"
        >
          <HiArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-clinic-text-base flex flex-wrap items-center gap-2 leading-tight">
            Gestionar Actividades de{" "}
            <span className="text-clinic-primary bg-clinic-primary-light/10 px-2 py-0.5 rounded-md text-sm sm:text-base">
              {objective.nombre}
            </span>
          </h2>
          <p className="text-xs text-clinic-text-muted mt-1 sm:mt-0.5">
            Configura las actividades disponibles y sus textos predeterminados
            para las terapias.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="w-full lg:w-1/3 max-h-[45vh] lg:max-h-full shrink-0 bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-clinic-text-base text-sm">
              Actividades (Ramas)
            </h3>
            <button
              onClick={() => {
                setIsAddingActivity(true);
                setEditingActivityId(null);
              }}
              className="text-clinic-primary hover:text-white hover:bg-clinic-primary p-1.5 rounded-md transition-colors"
            >
              <HiOutlinePlus size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {isAddingActivity && (
              <div className="p-3 bg-clinic-primary-light/5 border border-clinic-primary/30 rounded-clinic-inner flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNewActivity()}
                  placeholder="Nombre de actividad..."
                  className="w-full text-sm p-1.5 bg-white border border-gray-200 rounded outline-none focus:border-clinic-primary"
                />
                <button
                  onClick={handleSaveNewActivity}
                  disabled={actividadService.isLoading}
                  className="text-green-600 hover:bg-green-100 p-1.5 rounded disabled:opacity-50"
                >
                  <HiCheck size={18} />
                </button>
                <button
                  onClick={() => setIsAddingActivity(false)}
                  className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                >
                  <HiX size={18} />
                </button>
              </div>
            )}

            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className={`group p-3 rounded-clinic-inner cursor-pointer border transition-all flex justify-between items-center ${selectedActivity?.id === act.id ? "bg-clinic-primary-light/10 border-clinic-primary text-clinic-primary shadow-sm" : "bg-white border-gray-100 hover:border-gray-300 text-clinic-text-base hover:shadow-sm"}`}
              >
                {editingActivityId === act.id ? (
                  <div
                    className="flex items-center gap-2 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      autoFocus
                      type="text"
                      value={editActivityName}
                      onChange={(e) => setEditActivityName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveEditActivity(act.id)
                      }
                      className="w-full text-sm p-1 bg-white border border-gray-300 rounded outline-none text-black"
                    />
                    <button
                      onClick={() => handleSaveEditActivity(act.id)}
                      className="text-green-600 p-1"
                    >
                      <HiCheck />
                    </button>
                    <button
                      onClick={() => setEditingActivityId(null)}
                      className="text-red-500 p-1"
                    >
                      <HiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-sm flex-1">{act.nombre}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingActivityId(act.id);
                          setEditActivityName(act.nombre);
                        }}
                        className="text-gray-400 hover:text-clinic-primary hover:bg-white p-1.5 rounded"
                      >
                        <HiOutlinePencilAlt size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteActivity(act.id, e)}
                        className="text-gray-400 hover:text-red-500 hover:bg-white p-1.5 rounded"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {activities.length === 0 && !isAddingActivity && (
              <p className="text-center text-xs text-clinic-text-muted mt-5">
                Aún no hay actividades. Crea la primera.
              </p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 flex flex-col overflow-hidden">
          {selectedActivity ? (
            <>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-clinic-text-base text-sm">
                  Respuestas (Hojas) para{" "}
                  <span className="text-clinic-primary font-extrabold">
                    {selectedActivity.nombre}
                  </span>
                </h3>
                <button
                  onClick={() => {
                    setIsAddingResponse(true);
                    setEditingResponseId(null);
                  }}
                  className="flex items-center gap-1 text-xs font-bold bg-clinic-primary text-white px-3 py-1.5 rounded-clinic-inner hover:bg-clinic-primary-light transition-colors shadow-sm"
                >
                  <HiOutlinePlus size={16} /> Añadir Respuesta
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {isAddingResponse && (
                  <div className="p-3 border border-clinic-primary bg-clinic-primary-light/5 rounded-clinic-inner flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
                    <textarea
                      autoFocus
                      value={newResponseText}
                      onChange={(e) => setNewResponseText(e.target.value)}
                      placeholder="Escribe el texto predeterminado..."
                      className="w-full text-sm p-2 bg-white border border-gray-200 rounded-md outline-none focus:border-clinic-primary min-h-[60px] resize-none"
                    />
                    <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={handleSaveNewResponse}
                        disabled={respuestaService.isLoading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-600 disabled:opacity-50"
                      >
                        <HiCheck size={16} /> Guardar
                      </button>
                      <button
                        onClick={() => setIsAddingResponse(false)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-300"
                      >
                        <HiX size={16} /> Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {respuestas.map((resp) => (
                  <div
                    key={resp.id}
                    className="group p-3 border border-gray-200 rounded-clinic-inner bg-gray-50 flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-clinic-primary/40 hover:bg-white transition-colors shadow-sm hover:shadow-md"
                  >
                    {editingResponseId === resp.id ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                        <textarea
                          autoFocus
                          value={editResponseText}
                          onChange={(e) => setEditResponseText(e.target.value)}
                          className="w-full text-sm p-2 bg-white border border-gray-300 rounded-md outline-none min-h-[60px] resize-none focus:border-clinic-primary focus:ring-1 focus:ring-clinic-primary text-black"
                        />
                        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                          <button
                            onClick={() => handleSaveEditResponse(resp.id)}
                            className="flex-1 sm:flex-none flex items-center justify-center bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-600"
                          >
                            <HiCheck size={16} />
                          </button>
                          <button
                            onClick={() => setEditingResponseId(null)}
                            className="flex-1 sm:flex-none flex items-center justify-center bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-300"
                          >
                            <HiX size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-clinic-text-base flex-1 leading-relaxed">
                          {resp.texto_predeterminado}
                        </p>
                        <div className="flex gap-1 text-gray-400 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingResponseId(resp.id);
                              setEditResponseText(resp.texto_predeterminado);
                            }}
                            className="bg-white hover:text-clinic-primary hover:bg-clinic-primary-light/10 p-2 rounded border border-transparent hover:border-clinic-primary/20 transition-colors"
                          >
                            <HiOutlinePencilAlt size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteResponse(resp.id)}
                            className="bg-white hover:text-red-500 hover:bg-red-50 p-2 rounded border border-transparent hover:border-red-200 transition-colors"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {respuestas.length === 0 && !isAddingResponse && (
                  <div className="h-full flex flex-col items-center justify-center text-clinic-text-muted mt-10">
                    <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400">
                      <HiOutlinePlus size={32} />
                    </div>
                    <p className="text-sm font-medium">
                      No hay respuestas configuradas para esta actividad.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Añade la primera respuesta para que los médicos puedan
                      seleccionarla.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-clinic-text-muted">
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-10 rounded-clinic-card flex flex-col items-center text-center max-w-sm">
                <p className="text-sm font-bold text-gray-500">
                  Selecciona una actividad
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Haz clic en una actividad de la izquierda para configurar sus
                  opciones de respuesta.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
