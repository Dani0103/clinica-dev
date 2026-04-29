import { useState } from "react";
import { HiOutlineDownload, HiOutlineDocumentReport, HiOutlineSearch } from "react-icons/hi";
import { toast } from "react-toastify";

// Mocks
const MOCK_PATIENTS = [
  { id: 1, cedula: "1020304050", nombres: "Carlos", apellidos: "Pérez", eps: "Sura", horasMes: 20, horasObjetivo: 20 },
  { id: 2, cedula: "1122334455", nombres: "María", apellidos: "Gómez", eps: "Sanitas", horasMes: 15, horasObjetivo: 20 },
  { id: 3, cedula: "9988776655", nombres: "Juan", apellidos: "Rodríguez", eps: "Coomeva", horasMes: 5, horasObjetivo: 10 },
  { id: 4, cedula: "5544332211", nombres: "Ana", apellidos: "Martínez", eps: "Sura", horasMes: 30, horasObjetivo: 30 },
];

export default function ReportsPage() {
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.cedula.includes(searchTerm) || 
    `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPatients(filteredPatients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (id: number) => {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(selectedPatients.filter(pid => pid !== id));
    } else {
      setSelectedPatients([...selectedPatients, id]);
    }
  };

  const handleGeneratePDFs = () => {
    if (selectedPatients.length === 0) {
      toast.warning("Seleccione al menos un paciente para generar el reporte.");
      return;
    }
    
    // Check if any selected patient hasn't completed their hours
    const incomplete = MOCK_PATIENTS.filter(p => selectedPatients.includes(p.id) && p.horasMes < p.horasObjetivo);
    if (incomplete.length > 0) {
      const confirm = window.confirm(`Hay ${incomplete.length} paciente(s) que no han cumplido sus horas objetivo. ¿Desea generar el reporte de todas formas? (Requiere aprobación del coordinador)`);
      if (!confirm) return;
    }

    setIsGenerating(true);
    // Simulate API call to generate ZIP
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`Se ha generado un archivo ZIP con ${selectedPatients.length} historias clínicas.`);
      setSelectedPatients([]); // clear selection
    }, 2500);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-full bg-clinic-bg-soft font-sans space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base flex items-center gap-2 animate-fade-in">
            <HiOutlineDocumentReport className="text-clinic-primary" />
            Supervisión y Reportes
          </h1>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-1 animate-fade-in">Generación de historias clínicas en PDF y seguimiento de horas evolucionadas.</p>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {[
          { title: "Pacientes Activos", value: "142", trend: "+5% este mes", color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Horas Terapia (Mes)", value: "850h", trend: "12% por encima del objetivo", color: "text-green-600", bg: "bg-green-50" },
          { title: "Terapias Faltantes", value: "24", trend: "Pacientes con horas incompletas", color: "text-orange-600", bg: "bg-orange-50" },
          { title: "Efectividad", value: "92%", trend: "Cumplimiento general de terapias", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-clinic-card shadow-clinic-subtle border border-gray-100 flex flex-col justify-center hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-gray-500">{kpi.title}</h3>
            <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-2">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Pacientes para PDF */}
      <div className="bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 overflow-hidden flex flex-col animate-fade-in">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <HiOutlineSearch className="absolute left-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-clinic-inner w-full sm:w-64 focus:border-clinic-primary focus:ring-1 focus:ring-clinic-primary outline-none bg-white transition-all"
            />
          </div>
          <button 
            onClick={handleGeneratePDFs}
            disabled={isGenerating || selectedPatients.length === 0}
            className={`flex items-center gap-2 px-5 py-2 text-white font-bold rounded-clinic-inner transition-all shadow-md text-sm ${isGenerating || selectedPatients.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-clinic-primary hover:bg-opacity-90 transform hover:scale-[1.02]'}`}
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineDownload size={18} />
            )}
            {isGenerating ? 'Generando ZIP...' : `Descargar PDFs (${selectedPatients.length})`}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-clinic-text-base">
            <thead className="bg-gray-50 text-clinic-text-muted text-[11px] uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-clinic-primary rounded border-gray-300 focus:ring-clinic-primary"
                    checked={filteredPatients.length > 0 && selectedPatients.length === filteredPatients.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Cédula</th>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">EPS</th>
                <th className="px-6 py-4 text-center">Horas Evolucionadas</th>
                <th className="px-6 py-4 text-center">Estado Mensual</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(p => {
                const isComplete = p.horasMes >= p.horasObjetivo;
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-clinic-primary rounded border-gray-300 focus:ring-clinic-primary"
                        checked={selectedPatients.includes(p.id)}
                        onChange={() => handleSelectPatient(p.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{p.cedula}</td>
                    <td className="px-6 py-4 font-bold">{p.nombres} {p.apellidos}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">{p.eps}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${isComplete ? 'text-green-600' : 'text-orange-500'}`}>
                        {p.horasMes}h
                      </span>
                      <span className="text-gray-400 text-xs ml-1 font-semibold">/ {p.horasObjetivo}h</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isComplete ? (
                        <span className="text-[10px] bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full uppercase">Completo</span>
                      ) : (
                        <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full uppercase">Incompleto</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-clinic-text-muted">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className="text-sm font-bold text-gray-500">No se encontraron pacientes</p>
                      <p className="text-xs text-gray-400 mt-1">Intenta con otro término de búsqueda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
