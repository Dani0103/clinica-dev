import { useState } from "react";
import {
  HiOutlineClipboardList,
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/types/tableData";
import NewObjectiveModal from "./modal/NewObjectiveModal";

// Definimos la interfaz para los objetivos clínicos
interface ClinicalObjective {
  id: number;
  nombre: string;
  descripcion: string;
  rol_asignado: "MÉDICO" | "RECEPCIÓN" | "ADMIN";
  total_actividades: number;
  estado: boolean;
}

const ClinicalManagement = () => {
  const [activeModal, setActiveModal] = useState<"new_obj" | "edit_obj" | null>(
    null,
  );

  const closeModal = () => setActiveModal(null);

  // Datos de ejemplo (Mocks)
  const mockObjectives: ClinicalObjective[] = [
    {
      id: 1,
      nombre: "Ingreso de Paciente",
      descripcion: "Proceso inicial de recepción",
      rol_asignado: "RECEPCIÓN",
      total_actividades: 5,
      estado: true,
    },
    {
      id: 2,
      nombre: "Consulta General",
      descripcion: "Valoración médica estándar",
      rol_asignado: "MÉDICO",
      total_actividades: 12,
      estado: true,
    },
    {
      id: 3,
      nombre: "Seguimiento Especializado",
      descripcion: "Control de pacientes crónicos",
      rol_asignado: "MÉDICO",
      total_actividades: 8,
      estado: false,
    },
  ];

  const columns: Column<ClinicalObjective>[] = [
    {
      header: "Objetivo Clínico",
      accessor: (obj) => (
        <div>
          <p className="font-bold text-clinic-text-base">{obj.nombre}</p>
          <p className="text-xs text-clinic-text-muted">{obj.descripcion}</p>
        </div>
      ),
    },
    {
      header: "Rol Responsable",
      accessor: (obj) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
            obj.rol_asignado === "MÉDICO"
              ? "bg-blue-100 text-blue-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {obj.rol_asignado}
        </span>
      ),
    },
    {
      header: "Actividades",
      accessor: (obj) => (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
          {obj.total_actividades} tareas
        </span>
      ),
    },
    {
      header: "Estado",
      accessor: (obj) => (
        <span
          className={`text-xs font-bold ${obj.estado ? "text-green-500" : "text-red-400"}`}
        >
          {obj.estado ? "Publicado" : "Borrador"}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      accessor: (_) => (
        <div className="flex justify-end gap-1">
          <button
            className="p-2 text-gray-400 hover:text-clinic-primary hover:bg-clinic-primary/5 rounded-full transition-all"
            title="Gestionar Actividades"
          >
            <HiOutlineClipboardList size={18} />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-clinic-primary hover:bg-clinic-primary/5 rounded-full transition-all"
            title="Editar"
          >
            <HiOutlinePencilAlt size={18} />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Eliminar"
          >
            <HiOutlineTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-clinic-text-base">
            Estructura Clínica
          </h2>
          <p className="text-xs text-clinic-text-muted">
            Define objetivos y las actividades que los componen.
          </p>
        </div>
        <button
          onClick={() => setActiveModal("new_obj")}
          className="flex items-center gap-2 px-4 py-2 bg-clinic-primary text-white rounded-clinic-inner text-sm font-bold hover:bg-opacity-90 transition-all shadow-md"
        >
          <HiOutlinePlus size={18} /> Nuevo Objetivo
        </button>
      </div>

      <DataTable
        data={mockObjectives}
        columns={columns}
        searchPlaceholder="Buscar objetivo..."
      />

      {/* EL MODAL SE RENDERIZA AQUÍ, EN EL PADRE */}
      <NewObjectiveModal
        isOpen={activeModal === "new_obj"}
        onClose={closeModal}
      />
    </div>
  );
};

export default ClinicalManagement;
