import { useEffect, useState } from "react";
import { HiOutlineShieldCheck, HiOutlineDownload } from "react-icons/hi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import type { Column } from "@/types/tableData";
import DataTable from "@/components/common/DataTable";
import { useAuditoriaService } from "@/services";

interface AuditLogEntry {
  id: number;
  usuario: string;
  accion: string;
  modulo: string;
  fecha: string;
  ip: string;
  nivel: "INFO" | "WARNING" | "CRITICAL";
}

const formatFecha = (iso?: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
};

const inferNivel = (accion?: string): AuditLogEntry["nivel"] => {
  const a = (accion || "").toLowerCase();
  if (a.includes("delete") || a.includes("elimin") || a.includes("fall"))
    return "CRITICAL";
  if (a.includes("update") || a.includes("modif")) return "WARNING";
  return "INFO";
};

const AuditLogs = () => {
  const { list, isLoading } = useAuditoriaService();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await list();
      const items: any[] = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data ?? [];

      const mapped: AuditLogEntry[] = items.map((item: any, idx: number) => ({
        id: item.id ?? idx,
        usuario:
          item.usuario?.nombres || item.usuario?.nombre || item.usuario?.correo || "Sistema",
        accion:
          item.accion ||
          item.evento ||
          item.descripcion ||
          item.tipo_cambio ||
          "Cambio registrado",
        modulo:
          item.modulo || item.tabla || item.entidad || item.modelo || "GENERAL",
        fecha: formatFecha(item.created_at || item.fecha),
        ip: item.ip || item.direccion_ip || "—",
        nivel: item.nivel || inferNivel(item.accion || item.tipo_cambio),
      }));

      setLogs(mapped);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo cargar la auditoría");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Avanzar IPS - Log de Auditoría", 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha de reporte: ${new Date().toLocaleString()}`, 14, 30);

      const tableRows = logs.map((log) => [
        log.fecha,
        log.usuario,
        log.accion,
        log.modulo,
        log.nivel,
        log.ip,
      ]);

      autoTable(doc, {
        head: [["Fecha", "Usuario", "Acción", "Módulo", "Nivel", "IP"]],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [43, 108, 176] },
      });

      doc.save(`auditoria_avanzar_${Date.now()}.pdf`);
      toast.success("PDF generado correctamente");
    } catch {
      toast.error("Error al generar el PDF");
    }
  };

  const columns: Column<AuditLogEntry>[] = [
    {
      header: "Fecha y Hora",
      accessor: "fecha",
      className: "font-mono text-[11px] text-clinic-text-muted",
    },
    {
      header: "Usuario",
      accessor: (log) => (
        <div className="flex flex-col">
          <span className="font-semibold text-clinic-text-base">
            {log.usuario}
          </span>
          <span className="text-[10px] text-gray-400">IP: {log.ip}</span>
        </div>
      ),
    },
    {
      header: "Acción Realizada",
      accessor: (log) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${log.nivel === "CRITICAL" ? "bg-red-500 animate-pulse" : log.nivel === "WARNING" ? "bg-amber-500" : "bg-blue-400"}`}
          />
          <span className="text-sm">{log.accion}</span>
        </div>
      ),
    },
    { header: "Módulo", accessor: "modulo" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HiOutlineShieldCheck className="text-green-600" size={24} />
            <h2 className="text-lg font-bold text-clinic-text-base">
              Trazabilidad de Seguridad
            </h2>
          </div>
          <p className="text-xs text-clinic-text-muted">
            Cumplimiento Ley 2015 de 2020.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={exportToPDF}
            disabled={!logs.length}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <HiOutlineDownload size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      {isLoading && logs.length === 0 ? (
        <div className="flex justify-center items-center h-40 bg-white rounded-clinic-card border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-primary"></div>
        </div>
      ) : (
        <DataTable
          data={logs}
          columns={columns}
          searchPlaceholder="Buscar..."
        />
      )}
    </div>
  );
};

export default AuditLogs;
