import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCargasMasivasService } from "@/services";
import type { TipoCargaMasiva } from "@/services/cargasMasivasService";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/types/tableData";
import ImportarPacientesModal from "../components/ImportarPacientesModal";
import { HiOutlineDownload, HiOutlineUpload } from "react-icons/hi";

interface CargaMasiva {
  id: number;
  tipo: string;
  estado: string;
  registros_procesados: number;
  registros_totales: number;
  created_at: string;
}

const iconColorPorKey: Record<string, { bg: string; text: string }> = {
  pacientes: { bg: "bg-blue-50", text: "text-blue-600" },
  citas: { bg: "bg-green-50", text: "text-green-600" },
  usuarios: { bg: "bg-purple-50", text: "text-purple-600" },
};

const defaultIconColor = { bg: "bg-gray-50", text: "text-gray-600" };

export default function CargasMasivasPage() {
  const [catalogo, setCatalogo] = useState<TipoCargaMasiva[]>([]);
  const [cargas, setCargas] = useState<CargaMasiva[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importandoKey, setImportandoKey] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { getCatalogo, descargarPlantillaPorRuta, isLoading } = useCargasMasivasService();

  const fetchCatalogo = async () => {
    try {
      const response = await getCatalogo();
      if (response?.data) setCatalogo(response.data);
    } catch (err: any) {
      toast.error(err?.message || "Error al cargar el catálogo de cargas masivas");
    }
  };

  useEffect(() => {
    fetchCatalogo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleDownloadPlantilla = async (item: TipoCargaMasiva) => {
    try {
      const blob = await descargarPlantillaPorRuta(item.plantilla_url);
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `plantilla_${item.key}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err?.message || `Error al descargar la plantilla de ${item.nombre}`);
    }
  };

  const handleImportar = (key: string) => {
    if (key === "pacientes") {
      setImportandoKey(key);
      setIsImportModalOpen(true);
    }
  };

  const formatearFecha = (fechaIso: string) => {
    return new Date(fechaIso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: Column<CargaMasiva>[] = [
    { header: "ID", accessor: "id" },
    { header: "Tipo", accessor: "tipo", className: "font-medium capitalize" },
    {
      header: "Estado",
      accessor: (c) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            c.estado === "completado"
              ? "bg-green-100 text-green-700"
              : c.estado === "fallido"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {c.estado.toUpperCase()}
        </span>
      ),
    },
    {
      header: "Progreso",
      accessor: (c) => `${c.registros_procesados} / ${c.registros_totales}`,
    },
    { header: "Fecha", accessor: (c) => formatearFecha(c.created_at) },
  ];

  return (
    <div className="p-6 min-h-full space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base">
            Catálogos y Cargas Masivas
          </h1>
          <p className="text-sm sm:text-base text-clinic-text-muted mt-1">
            Administra las importaciones de datos al sistema.
          </p>
        </div>
      </div>

      {isLoading && catalogo.length === 0 ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-100 border-t-clinic-primary mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando catálogo...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalogo.map((item) => {
            const colors = iconColorPorKey[item.key] ?? defaultIconColor;
            return (
              <div
                key={item.key}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-clinic-primary/50 transition-colors flex flex-col"
              >
                <div
                  className={`w-12 h-12 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-4`}
                >
                  {item.disponible ? (
                    <HiOutlineUpload className="w-6 h-6" />
                  ) : (
                    <HiOutlineDownload className="w-6 h-6" />
                  )}
                </div>

                <h3 className="font-bold text-lg mb-1">{item.nombre}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">{item.descripcion}</p>

                {item.tope_filas && (
                  <p className="text-xs text-gray-400 mb-3">
                    Máx. {item.tope_filas.toLocaleString("es-CO")} filas por archivo
                  </p>
                )}

                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => handleDownloadPlantilla(item)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-clinic-primary bg-clinic-primary/10 rounded-xl hover:bg-clinic-primary hover:text-white transition-all"
                  >
                    <HiOutlineDownload className="w-4 h-4" /> Descargar Plantilla
                  </button>

                  {item.disponible && item.import_url && (
                    <button
                      onClick={() => handleImportar(item.key)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-clinic-primary rounded-xl hover:bg-clinic-primary-light transition-all shadow-lg shadow-clinic-primary/20"
                    >
                      <HiOutlineUpload className="w-4 h-4" /> Importar Excel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-clinic-subtle">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-lg text-clinic-text-base">Historial de Cargas</h3>
        </div>
        {cargas.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">No hay cargas registradas aún.</p>
          </div>
        ) : (
          <DataTable data={cargas} columns={columns} />
        )}
      </div>

      <ImportarPacientesModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportandoKey(null);
        }}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
