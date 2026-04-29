import { useState } from "react";
import { HiArrowLeft, HiOutlinePlus, HiOutlineTrash, HiOutlinePencilAlt, HiCheck, HiX } from "react-icons/hi";

interface ResponseItem {
  id: number;
  texto_predeterminado: string;
}

interface ActivityItem {
  id: number;
  nombre: string;
  respuestas: ResponseItem[];
}

interface ActivitiesManagerProps {
  objective: any; // ClinicalObjective
  onBack: () => void;
}

export default function ActivitiesManager({ objective, onBack }: ActivitiesManagerProps) {
  // Mocks for now
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      nombre: "Valoración Inicial",
      respuestas: [
        { id: 101, texto_predeterminado: "Paciente estable, sin signos de alerta." },
        { id: 102, texto_predeterminado: "Paciente presenta dolor agudo en zona tratada." }
      ]
    },
    {
      id: 2,
      nombre: "Ejercicios de Movilidad",
      respuestas: [
        { id: 201, texto_predeterminado: "Realiza ejercicios con dificultad leve." }
      ]
    }
  ]);

  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(activities[0] || null);

  // States for adding/editing Activity
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivityName, setNewActivityName] = useState("");
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [editActivityName, setEditActivityName] = useState("");

  // States for adding/editing Response
  const [isAddingResponse, setIsAddingResponse] = useState(false);
  const [newResponseText, setNewResponseText] = useState("");
  const [editingResponseId, setEditingResponseId] = useState<number | null>(null);
  const [editResponseText, setEditResponseText] = useState("");

  // Handlers for Activities
  const handleSaveNewActivity = () => {
    if (!newActivityName.trim()) return;
    const newAct: ActivityItem = {
      id: Date.now(),
      nombre: newActivityName.trim(),
      respuestas: []
    };
    setActivities([...activities, newAct]);
    setNewActivityName("");
    setIsAddingActivity(false);
    if (!selectedActivity) setSelectedActivity(newAct);
  };

  const handleSaveEditActivity = (id: number) => {
    if (!editActivityName.trim()) return;
    setActivities(activities.map(a => a.id === id ? { ...a, nombre: editActivityName.trim() } : a));
    if (selectedActivity?.id === id) {
      setSelectedActivity({ ...selectedActivity, nombre: editActivityName.trim() });
    }
    setEditingActivityId(null);
  };

  const handleDeleteActivity = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivities(activities.filter(a => a.id !== id));
    if (selectedActivity?.id === id) setSelectedActivity(null);
  };

  // Handlers for Responses
  const handleSaveNewResponse = () => {
    if (!newResponseText.trim() || !selectedActivity) return;
    const newResp: ResponseItem = { id: Date.now(), texto_predeterminado: newResponseText.trim() };
    const updatedActivity = { ...selectedActivity, respuestas: [...selectedActivity.respuestas, newResp] };
    
    setActivities(activities.map(a => a.id === selectedActivity.id ? updatedActivity : a));
    setSelectedActivity(updatedActivity);
    setNewResponseText("");
    setIsAddingResponse(false);
  };

  const handleSaveEditResponse = (respId: number) => {
    if (!editResponseText.trim() || !selectedActivity) return;
    const updatedResp = selectedActivity.respuestas.map(r => r.id === respId ? { ...r, texto_predeterminado: editResponseText.trim() } : r);
    const updatedActivity = { ...selectedActivity, respuestas: updatedResp };
    
    setActivities(activities.map(a => a.id === selectedActivity.id ? updatedActivity : a));
    setSelectedActivity(updatedActivity);
    setEditingResponseId(null);
  };

  const handleDeleteResponse = (respId: number) => {
    if (!selectedActivity) return;
    const updatedResp = selectedActivity.respuestas.filter(r => r.id !== respId);
    const updatedActivity = { ...selectedActivity, respuestas: updatedResp };
    
    setActivities(activities.map(a => a.id === selectedActivity.id ? updatedActivity : a));
    setSelectedActivity(updatedActivity);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 bg-white p-4 rounded-clinic-card shadow-clinic-subtle border border-gray-100">
        <button onClick={onBack} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-500 transition-colors shrink-0 mt-1 sm:mt-0" title="Volver a Objetivos">
          <HiArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-clinic-text-base flex flex-wrap items-center gap-2 leading-tight">
            Gestionar Actividades de <span className="text-clinic-primary bg-clinic-primary-light/10 px-2 py-0.5 rounded-md text-sm sm:text-base">{objective.nombre}</span>
          </h2>
          <p className="text-xs text-clinic-text-muted mt-1 sm:mt-0.5">
            Configura las actividades disponibles y sus textos predeterminados para las terapias.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Left side: Activities List */}
        <div className="w-full lg:w-1/3 max-h-[45vh] lg:max-h-full shrink-0 bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-clinic-text-base text-sm">Actividades (Ramas)</h3>
            <button 
              onClick={() => { setIsAddingActivity(true); setEditingActivityId(null); }}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveNewActivity()}
                  placeholder="Nombre de actividad..."
                  className="w-full text-sm p-1.5 bg-white border border-gray-200 rounded outline-none focus:border-clinic-primary"
                />
                <button onClick={handleSaveNewActivity} className="text-green-600 hover:bg-green-100 p-1.5 rounded"><HiCheck size={18}/></button>
                <button onClick={() => setIsAddingActivity(false)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><HiX size={18}/></button>
              </div>
            )}

            {activities.map(act => (
              <div 
                key={act.id} 
                onClick={() => setSelectedActivity(act)}
                className={`group p-3 rounded-clinic-inner cursor-pointer border transition-all flex justify-between items-center
                  ${selectedActivity?.id === act.id 
                    ? 'bg-clinic-primary-light/10 border-clinic-primary text-clinic-primary shadow-sm' 
                    : 'bg-white border-gray-100 hover:border-gray-300 text-clinic-text-base hover:shadow-sm'}`}
              >
                {editingActivityId === act.id ? (
                   <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                     <input 
                        autoFocus
                        type="text" 
                        value={editActivityName} 
                        onChange={(e) => setEditActivityName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEditActivity(act.id)}
                        className="w-full text-sm p-1 bg-white border border-gray-300 rounded outline-none text-black"
                      />
                      <button onClick={() => handleSaveEditActivity(act.id)} className="text-green-600 p-1"><HiCheck/></button>
                      <button onClick={() => setEditingActivityId(null)} className="text-red-500 p-1"><HiX/></button>
                   </div>
                ) : (
                  <>
                    <span className="font-semibold text-sm flex-1">{act.nombre}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingActivityId(act.id); setEditActivityName(act.nombre); }} 
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
              <p className="text-center text-xs text-clinic-text-muted mt-5">Aún no hay actividades. Crea la primera.</p>
            )}
          </div>
        </div>

        {/* Right side: Responses List */}
        <div className="w-full lg:w-2/3 bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 flex flex-col overflow-hidden">
          {selectedActivity ? (
            <>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-clinic-text-base text-sm">
                  Respuestas (Hojas) para <span className="text-clinic-primary font-extrabold">{selectedActivity.nombre}</span>
                </h3>
                <button 
                  onClick={() => { setIsAddingResponse(true); setEditingResponseId(null); }}
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
                      <button onClick={handleSaveNewResponse} className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-600"><HiCheck size={16}/> Guardar</button>
                      <button onClick={() => setIsAddingResponse(false)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-300"><HiX size={16}/> Cancelar</button>
                    </div>
                  </div>
                )}

                {selectedActivity.respuestas.map(resp => (
                  <div key={resp.id} className="group p-3 border border-gray-200 rounded-clinic-inner bg-gray-50 flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-clinic-primary/40 hover:bg-white transition-colors shadow-sm hover:shadow-md">
                    {editingResponseId === resp.id ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                        <textarea 
                          autoFocus
                          value={editResponseText} 
                          onChange={(e) => setEditResponseText(e.target.value)}
                          className="w-full text-sm p-2 bg-white border border-gray-300 rounded-md outline-none min-h-[60px] resize-none focus:border-clinic-primary focus:ring-1 focus:ring-clinic-primary text-black"
                        />
                        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                          <button onClick={() => handleSaveEditResponse(resp.id)} className="flex-1 sm:flex-none flex items-center justify-center bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-600"><HiCheck size={16}/></button>
                          <button onClick={() => setEditingResponseId(null)} className="flex-1 sm:flex-none flex items-center justify-center bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-300"><HiX size={16}/></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-clinic-text-base flex-1 leading-relaxed">{resp.texto_predeterminado}</p>
                        <div className="flex gap-1 text-gray-400 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingResponseId(resp.id); setEditResponseText(resp.texto_predeterminado); }} 
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
                
                {selectedActivity.respuestas.length === 0 && !isAddingResponse && (
                  <div className="h-full flex flex-col items-center justify-center text-clinic-text-muted mt-10">
                    <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400">
                      <HiOutlinePlus size={32} />
                    </div>
                    <p className="text-sm font-medium">No hay respuestas configuradas para esta actividad.</p>
                    <p className="text-xs text-gray-400 mt-1">Añade la primera respuesta para que los médicos puedan seleccionarla.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-clinic-text-muted">
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-10 rounded-clinic-card flex flex-col items-center text-center max-w-sm">
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                  <p className="text-sm font-bold text-gray-500">Selecciona una actividad</p>
                  <p className="text-xs text-gray-400 mt-1">Haz clic en una actividad de la izquierda para configurar sus opciones de respuesta.</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
