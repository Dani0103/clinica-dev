import { useEffect, useState } from "react";
import {
  HiOutlineClipboardList,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi";
import { toast } from "react-toastify";
import DataTable from "@/components/common/DataTable";
import PageLoader from "@/components/common/PageLoader";
import type { Column } from "@/types/tableData";
import NewObjectiveModal from "./modal/NewObjectiveModal";
import ActivitiesManager from "./ActivitiesManager";
import { useObjetivoService } from "@/services";

export interface RespuestaApi {
  id: number;
  texto_predeterminado: string;
}

export interface ActividadApi {
  id: number;
  nombre: string;
  respuestas?: RespuestaApi[];
}

export interface ObjetivoApi {
  id: number;
  nombre: string;
  descripcion?: string;
  actividades?: ActividadApi[];
}

const ClinicalManagement = () => {
  const { list, remove, isLoading } = useObjetivoService();

  const [objetivos, setObjetivos] = useState<ObjetivoApi[]>([]);
  const [activeModal, setActiveModal] = useState<"new_obj" | null>(null);
  const [selectedObjective, setSelectedObjective] =
    useState<ObjetivoApi | null>(null);

  const fetchObjetivos = async () => {
    try {
      const response = await list();
      if (response?.data) {
        setObjetivos(response.data);
        if (selectedObjective) {
          const refreshed = response.data.find(
            (o: ObjetivoApi) => o.id === selectedObjective.id,
          );
          if (refreshed) setSelectedObjective(refreshed);
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "No se pudieron cargar los objetivos");
    }
  };

  useEffect(() => {
    fetchObjetivos();
  }, []);

  const closeModal = () => setActiveModal(null);

  const handleDelete = async (obj: ObjetivoApi) => {
    if (
      !window.confirm(
        `¿Eliminar el objetivo "${obj.nombre}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    try {
      await remove(obj.id);
      toast.success("Objetivo eliminado");
      fetchObjetivos();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo eliminar el objetivo");
    }
  };

  const columns: Column<ObjetivoApi>[] = [
    {
      header: "Objetivo Clínico",
      accessor: (obj) => (
        <div>
          <p className="font-bold text-clinic-text-base">{obj.nombre}</p>
          <p className="text-xs text-clinic-text-muted">
            {obj.descripcion || "Sin descripción"}
          </p>
        </div>
      ),
    },
    {
      header: "Actividades",
      accessor: (obj) => (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
          {obj.actividades?.length ?? 0} tareas
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      accessor: (obj) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => setSelectedObjective(obj)}
            className="p-2 text-gray-400 hover:text-clinic-primary hover:bg-clinic-primary/5 rounded-full transition-all"
            title="Gestionar Actividades"
          >
            <HiOutlineClipboardList size={18} />
          </button>
          <button
            onClick={() => handleDelete(obj)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Eliminar"
          >
            <HiOutlineTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (selectedObjective) {
    return (
      <ActivitiesManager
        objective={selectedObjective}
        onBack={() => setSelectedObjective(null)}
        onTreeChange={fetchObjetivos}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-clinic-primary text-white rounded-clinic-inner text-sm font-bold hover:bg-opacity-90 transition-all shadow-md"
        >
          <HiOutlinePlus size={18} /> Nuevo Objetivo
        </button>
      </div>

      {isLoading && objetivos.length === 0 ? (
        <PageLoader variant="section" />
      ) : (
        <DataTable
          data={objetivos}
          columns={columns}
          searchPlaceholder="Buscar objetivo..."
        />
      )}

      <NewObjectiveModal
        isOpen={activeModal === "new_obj"}
        onClose={closeModal}
        onSuccess={fetchObjetivos}
      />
    </div>
  );
};

export default ClinicalManagement;
