import { useEffect, useState } from "react";
import { HiOutlinePencilAlt, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { toast } from "react-toastify";
import { useEspecialidadService } from "@/services";
import type { Especialidad } from "@/services/especialidadService";
import DataTable from "@/components/common/DataTable";
import PageLoader from "@/components/common/PageLoader";
import type { Column } from "@/types/tableData";
import EspecialidadModal from "./modal/EspecialidadModal";

const EspecialidadesManagement = () => {
  const { list, remove, isLoading } = useEspecialidadService();

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [modal, setModal] = useState<"crear" | "editar" | null>(null);
  const [selected, setSelected] = useState<Especialidad | null>(null);

  const fetchEspecialidades = async () => {
    try {
      const res = await list();
      setEspecialidades((res?.data ?? []).sort((a: Especialidad, b: Especialidad) => a.id - b.id));
    } catch (err: any) {
      toast.error(err?.message || "No se pudieron cargar las especialidades");
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const openEditar = (esp: Especialidad) => {
    setSelected(esp);
    setModal("editar");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleDelete = async (esp: Especialidad) => {
    if (
      !window.confirm(
        `¿Eliminar la especialidad "${esp.nombre}"?\n\nSolo es posible si no tiene profesionales ni citas asignadas.`,
      )
    ) {
      return;
    }

    try {
      await remove(esp.id);
      toast.success(`Especialidad "${esp.nombre}" eliminada`);
      fetchEspecialidades();
    } catch (err: any) {
      toast.error(err?.message || "No se pudo eliminar la especialidad");
    }
  };

  const columns: Column<Especialidad>[] = [
    {
      header: "ID",
      accessor: "id",
      className: "w-16 text-clinic-text-muted",
    },
    {
      header: "Nombre",
      accessor: "nombre",
      className: "font-medium text-clinic-text-base",
    },
    {
      header: "Acciones",
      className: "text-right",
      accessor: (esp) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => openEditar(esp)}
            className="p-2 text-gray-400 hover:text-clinic-primary hover:bg-clinic-primary/5 rounded-full transition-all"
            title="Editar"
          >
            <HiOutlinePencilAlt size={18} />
          </button>
          <button
            onClick={() => handleDelete(esp)}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-clinic-text-base">
            Especialidades
          </h2>
          <p className="text-xs text-clinic-text-muted">
            Gestiona las especialidades médicas disponibles en el sistema.
          </p>
        </div>
        <button
          onClick={() => setModal("crear")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-clinic-primary text-white rounded-clinic-inner text-sm font-bold hover:bg-opacity-90 transition-all shadow-md"
        >
          <HiOutlinePlus size={18} /> Nueva Especialidad
        </button>
      </div>

      {isLoading && especialidades.length === 0 ? (
        <PageLoader variant="section" />
      ) : (
        <DataTable
          data={especialidades}
          columns={columns}
          searchPlaceholder="Buscar especialidad..."
        />
      )}

      <EspecialidadModal
        isOpen={modal === "crear"}
        onClose={closeModal}
        onSuccess={() => { fetchEspecialidades(); closeModal(); }}
      />

      <EspecialidadModal
        isOpen={modal === "editar"}
        especialidad={selected}
        onClose={closeModal}
        onSuccess={() => { fetchEspecialidades(); closeModal(); }}
      />
    </div>
  );
};

export default EspecialidadesManagement;
