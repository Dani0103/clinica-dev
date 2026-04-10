import {
  HiOutlineShieldCheck,
  HiOutlineDownload,
  HiOutlineLockClosed,
} from "react-icons/hi";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/types/tabledata";

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
  // Datos de ejemplo para visualizar la trazabilidad
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
            className={`w-2 h-2 rounded-full ${
              log.nivel === "CRITICAL"
                ? "bg-red-500 animate-pulse"
                : log.nivel === "WARNING"
                  ? "bg-amber-500"
                  : "bg-blue-400"
            }`}
          />
          <span className="text-sm">{log.accion}</span>
        </div>
      ),
    },
    {
      header: "Módulo",
      accessor: (log) => (
        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-200">
          {log.modulo}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-fade-in">
      {/* Encabezado con acciones de auditoría */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HiOutlineShieldCheck className="text-green-600" size={24} />
            <h2 className="text-lg font-bold text-clinic-text-base">
              Trazabilidad de Seguridad
            </h2>
          </div>
          <p className="text-xs text-clinic-text-muted">
            Cumplimiento Ley 2015 de 2020: Registro inalterable de accesos.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-clinic-text-base rounded-clinic-inner text-sm font-semibold hover:bg-gray-50 transition-colors">
            <HiOutlineDownload size={18} />
            Exportar PDF
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-clinic-inner text-sm font-semibold hover:bg-gray-700 transition-colors">
            <HiOutlineLockClosed size={18} />
            Políticas de Clave
          </button>
        </div>
      </div>

      {/* Tabla con buscador integrado */}
      <DataTable
        data={mockLogs}
        columns={columns}
        searchPlaceholder="Buscar por usuario, acción o IP..."
      />

      {/* Pie de página informativo */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-clinic-inner">
        <p className="text-[11px] text-blue-800 leading-relaxed">
          <strong>Nota de Seguridad:</strong> Los registros aquí mostrados son
          de solo lectura y no pueden ser modificados ni eliminados por ningún
          usuario, cumpliendo con los estándares internacionales de integridad
          de datos en salud.
        </p>
      </div>
    </div>
  );
};

export default AuditLogs;
