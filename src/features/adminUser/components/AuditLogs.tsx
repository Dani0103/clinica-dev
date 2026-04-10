import { HiOutlineShieldCheck, HiOutlineDownload } from "react-icons/hi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import type { Column } from "@/types/tabledata";
import DataTable from "@/components/common/DataTable";

interface AuditLogEntry {
  id: number;
  usuario: string;
  accion: string;
  modulo: string;
  fecha: string;
  ip: string;
  nivel: "INFO" | "WARNING" | "CRITICAL";
}

const AuditLogs = () => {
  const mockLogs: AuditLogEntry[] = [
    {
      id: 1,
      usuario: "admin@test.com",
      accion: "Inicio de sesión exitoso",
      modulo: "AUTH",
      fecha: "2026-04-10 08:30:15",
      ip: "192.168.1.45",
      nivel: "INFO",
    },
    {
      id: 2,
      usuario: "dr.mendoza@avanzar.com",
      accion: "Modificación de Historia Clínica #4502",
      modulo: "HISTORIAS",
      fecha: "2026-04-10 09:15:00",
      ip: "181.45.12.10",
      nivel: "WARNING",
    },
    {
      id: 3,
      usuario: "recepcion1@avanzar.com",
      accion: "Eliminación de cita cancelada",
      modulo: "AGENDA",
      fecha: "2026-04-10 09:22:10",
      ip: "192.168.1.50",
      nivel: "INFO",
    },
    {
      id: 4,
      usuario: "desconocido",
      accion: "Intento fallido de login (3 veces)",
      modulo: "AUTH",
      fecha: "2026-04-10 09:45:33",
      ip: "45.122.10.5",
      nivel: "CRITICAL",
    },
  ];

  // --- LÓGICA DE EXPORTACIÓN PDF ---
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Título del PDF
      doc.setFontSize(18);
      doc.text("Avanzar IPS - Log de Auditoría", 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha de reporte: ${new Date().toLocaleString()}`, 14, 30);

      // Preparar los datos para la tabla
      const tableRows = mockLogs.map((log) => [
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
        headStyles: { fillColor: [43, 108, 176] }, // Color corporativo
      });

      doc.save(`auditoria_avanzar_${Date.now()}.pdf`);
      toast.success("PDF generado correctamente");
    } catch (error) {
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
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <HiOutlineDownload size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      <DataTable
        data={mockLogs}
        columns={columns}
        searchPlaceholder="Buscar..."
      />
    </div>
  );
};

export default AuditLogs;
