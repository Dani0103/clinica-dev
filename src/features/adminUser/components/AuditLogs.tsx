import { HiOutlineShieldCheck } from "react-icons/hi";

const AuditLogs = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-clinic-text-muted animate-fade-in">
      <HiOutlineShieldCheck
        size={48}
        className="mb-4 opacity-50 text-green-600"
      />
      <h3 className="text-lg font-bold text-clinic-text-base">
        Log de Auditoría (Ley 2015)
      </h3>
      <p className="text-sm mt-2 text-center max-w-md">
        Registro inmutable de trazabilidad. Veremos quién hizo qué, a qué hora,
        y configuración de políticas de contraseñas.
      </p>
    </div>
  );
};

export default AuditLogs;
