import { useEffect, useState, type ReactNode } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import PageLoader from "@/components/common/PageLoader";
import { toast } from "react-toastify";
import {
  useConsentimientoService,
  useConsultaEspecialistaService,
  useEscalaWeefimService,
  useHistoriaIngresoService,
  useOrdenMedicaService,
  useTerapiaService,
} from "@/services";
import HistoriaIngresoModal from "../forms/HistoriaIngresoModal";
import ConsentimientoModal from "../forms/ConsentimientoModal";
import OrdenMedicaModal from "../forms/OrdenMedicaModal";
import ConsultaEspecialistaModal from "../forms/ConsultaEspecialistaModal";
import EscalaWeefimModal from "../forms/EscalaWeefimModal";

type TabKey =
  | "evoluciones"
  | "ingreso"
  | "consentimientos"
  | "ordenes"
  | "consultas"
  | "weefim";

interface Props {
  pacienteId: number;
  onNuevaTerapia?: () => void;
  puedeRegistrarTerapia?: boolean;
}

interface TabDef {
  key: TabKey;
  label: string;
}

const TABS: TabDef[] = [
  { key: "evoluciones", label: "Evoluciones" },
  { key: "ingreso", label: "Historia ingreso" },
  { key: "consentimientos", label: "Consentimientos" },
  { key: "ordenes", label: "Órdenes médicas" },
  { key: "consultas", label: "Consultas especialista" },
  { key: "weefim", label: "Escala WeeFIM" },
];

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const onlyDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const Card = ({ children }: { children: ReactNode }) => (
  <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-clinic-inner hover:border-clinic-primary/30 hover:bg-white transition-all">
    {children}
  </div>
);

const EmptyState = ({ msg }: { msg: string }) => (
  <div className="text-center py-12 text-clinic-text-muted text-sm italic">
    {msg}
  </div>
);
export default function PacienteHistoriaTabs({
  pacienteId,
  onNuevaTerapia,
  puedeRegistrarTerapia = true,
}: Props) {
  const [active, setActive] = useState<TabKey>("evoluciones");
  const [openModal, setOpenModal] = useState<TabKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const terapiaService = useTerapiaService();
  const ingresoService = useHistoriaIngresoService();
  const consentService = useConsentimientoService();
  const ordenService = useOrdenMedicaService();
  const consultaService = useConsultaEspecialistaService();
  const weefimService = useEscalaWeefimService();

  const [evoluciones, setEvoluciones] = useState<any[]>([]);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [consentimientos, setConsentimientos] = useState<any[]>([]);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [weefims, setWeefims] = useState<any[]>([]);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const params = { paciente_id: pacienteId };
      const [
        evRes,
        ingRes,
        consRes,
        ordRes,
        cnsRes,
        weeRes,
      ] = await Promise.allSettled([
        terapiaService.list(params),
        ingresoService.list(params),
        consentService.list(params),
        ordenService.list(params),
        consultaService.list(params),
        weefimService.list(params),
      ]);

      if (evRes.status === "fulfilled")
        setEvoluciones(evRes.value?.data ?? []);
      if (ingRes.status === "fulfilled")
        setIngresos(ingRes.value?.data ?? []);
      if (consRes.status === "fulfilled")
        setConsentimientos(consRes.value?.data ?? []);
      if (ordRes.status === "fulfilled")
        setOrdenes(ordRes.value?.data ?? []);
      if (cnsRes.status === "fulfilled")
        setConsultas(cnsRes.value?.data ?? []);
      if (weeRes.status === "fulfilled")
        setWeefims(weeRes.value?.data ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Error cargando la historia clínica");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId]);

  // Por tab: contador + acción
  const newButtonLabel: Record<TabKey, string> = {
    evoluciones: "Nueva terapia",
    ingreso: "Nueva historia",
    consentimientos: "Nuevo consentimiento",
    ordenes: "Nueva orden",
    consultas: "Nueva consulta",
    weefim: "Nueva escala",
  };

  const counts: Record<TabKey, number> = {
    evoluciones: evoluciones.length,
    ingreso: ingresos.length,
    consentimientos: consentimientos.length,
    ordenes: ordenes.length,
    consultas: consultas.length,
    weefim: weefims.length,
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 min-h-[400px]">
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-3 mb-5 -mx-1 px-1 scrollbar-thin">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`shrink-0 text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-clinic-inner font-semibold transition-all whitespace-nowrap ${active === t.key ? "bg-clinic-primary text-white shadow-sm" : "text-clinic-text-muted hover:bg-gray-50"}`}
          >
            {t.label}
            <span
              className={`ml-1.5 sm:ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${active === t.key ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}
            >
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Botón "Nuevo" en el área superior derecha */}
      {newButtonLabel[active] && (
        <div className="flex justify-end mb-4">
          {active === "evoluciones" ? (
            <button
              onClick={() => onNuevaTerapia?.()}
              disabled={!puedeRegistrarTerapia}
              title={
                !puedeRegistrarTerapia
                  ? "Reactiva el paciente para registrar terapias"
                  : ""
              }
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-clinic-inner shadow-sm transition-all ${
                puedeRegistrarTerapia
                  ? "bg-clinic-primary text-white hover:bg-opacity-90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              <HiOutlinePlus size={18} /> {newButtonLabel[active]}
            </button>
          ) : (
            <button
              onClick={() => setOpenModal(active)}
              className="flex items-center gap-2 px-4 py-2 bg-clinic-primary text-white text-sm font-bold rounded-clinic-inner hover:bg-opacity-90 shadow-sm transition-all"
            >
              <HiOutlinePlus size={18} /> {newButtonLabel[active]}
            </button>
          )}
        </div>
      )}

      {/* PANELES */}
      {isLoading ? (
        <PageLoader variant="page" text="Obteniendo historial clínico..." />
      ) : (
        <>
          {active === "evoluciones" && (
            <div className="space-y-4">
          {evoluciones.length === 0 ? (
            <EmptyState msg="Sin evoluciones registradas." />
          ) : (
            evoluciones.map((t) => (
              <Card key={t.id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold bg-white border border-teal-200 text-teal-700 px-2.5 py-1 rounded-lg uppercase shadow-sm">
                      {t.especialidad?.nombre || "Terapia"}
                    </span>
                    {t.profesional && (
                      <span className="text-[10px] font-bold bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-lg uppercase shadow-sm">
                        Prof: {t.profesional.nombre}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    {formatDate(t.fecha_hora || t.created_at)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-clinic-text-base text-lg leading-tight">
                    {t.objetivo?.nombre || "Sin objetivo definido"}
                  </h4>
                  <p className="text-sm text-clinic-text-muted italic border-l-2 border-gray-100 pl-3 py-1">
                    {t.objetivo?.description || t.objetivo?.descripcion || "Sin descripción disponible."}
                  </p>
                </div>

                {t.resultados && t.resultados.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Resultados y Observaciones</p>
                    <div className="space-y-2">
                      {t.resultados.map((res: any, idx: number) => (
                        <div key={res.id || idx} className="bg-white/50 p-2.5 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${res.marcado ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-xs font-bold text-clinic-text-base">
                              {res.marcado ? 'Objetivo Cumplido' : 'En Proceso'}
                            </span>
                          </div>
                          {res.notas_libres && (
                            <p className="text-xs text-clinic-text-muted pl-4 italic">
                              "{res.notas_libres}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {active === "ingreso" && (
        <div className="space-y-3">
          {ingresos.length === 0 ? (
            <EmptyState msg="Sin historia de ingreso registrada." />
          ) : (
            ingresos.map((h: any) => (
              <Card key={h.id}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-clinic-primary uppercase">
                    Historia de ingreso
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(h.created_at)}
                  </span>
                </div>
                <p className="font-bold text-clinic-text-base mt-1">
                  {h.motivo_consulta}
                </p>
                <p className="text-sm text-clinic-text-muted mt-1 line-clamp-2">
                  {h.impresion_diagnostica}
                </p>
              </Card>
            ))
          )}
        </div>
      )}

      {active === "consentimientos" && (
        <div className="space-y-3">
          {consentimientos.length === 0 ? (
            <EmptyState msg="Sin consentimientos registrados." />
          ) : (
            consentimientos.map((c: any) => (
              <Card key={c.id}>
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-clinic-text-base">
                    {c.tipo_consentimiento}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.estado === "Firmado" ? "bg-green-100 text-green-700" : c.estado === "Rechazado" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {c.estado}
                  </span>
                </div>
                <p className="text-xs text-clinic-text-muted">
                  Fecha de firma: {onlyDate(c.fecha_firma)}
                  {c.firmado_por_representante && c.nombre_firmante && (
                    <>
                      {" · "}Firmado por: {c.nombre_firmante}
                    </>
                  )}
                </p>
              </Card>
            ))
          )}
        </div>
      )}

      {active === "ordenes" && (
        <div className="space-y-3">
          {ordenes.length === 0 ? (
            <EmptyState msg="Sin órdenes médicas registradas." />
          ) : (
            ordenes.map((o: any) => (
              <Card key={o.id}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-clinic-primary uppercase">
                    Orden médica
                  </span>
                  <span className="text-xs text-gray-400">
                    {onlyDate(o.fecha_orden)}
                  </span>
                </div>
                <p className="text-sm text-clinic-text-base mt-1 whitespace-pre-line">
                  {o.descripcion}
                </p>
                {(o.medico?.nombre || o.medico?.nombres) && (
                  <p className="text-[10px] text-clinic-text-muted mt-2">
                    Por: {o.medico.nombre || `${o.medico.nombres ?? ""} ${o.medico.apellidos ?? ""}`.trim()}
                  </p>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {active === "consultas" && (
        <div className="space-y-3">
          {consultas.length === 0 ? (
            <EmptyState msg="Sin consultas de especialista registradas." />
          ) : (
            consultas.map((c: any) => (
              <Card key={c.id}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-lg uppercase">
                    {c.especialidad?.nombre || "Especialidad"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(c.fecha_hora || c.created_at)}
                  </span>
                </div>
                <p className="font-bold text-clinic-text-base mt-1">
                  {c.motivo_consulta}
                </p>
                <p className="text-sm text-clinic-text-muted mt-1 line-clamp-2">
                  {c.diagnostico}
                </p>
                {c.firma_electronica && (
                  <span className="inline-block mt-2 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                    ✓ Firmado y cifrado
                  </span>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {active === "weefim" && (
        <div className="space-y-3">
          {weefims.length === 0 ? (
            <EmptyState msg="Sin escalas WeeFIM registradas." />
          ) : (
            weefims.map((w: any) => (
              <Card key={w.id}>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-clinic-primary uppercase">
                    Evaluación WeeFIM
                  </span>
                  <span className="text-xs text-gray-400">
                    {onlyDate(w.fecha_evaluacion)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                  <div>
                    <p className="text-[10px] text-clinic-text-muted uppercase">
                      Autocuidado
                    </p>
                    <p className="font-bold text-clinic-text-base">
                      {w.subtotal_autocuidado}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-clinic-text-muted uppercase">
                      Movilidad
                    </p>
                    <p className="font-bold text-clinic-text-base">
                      {w.subtotal_movilidad}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-clinic-text-muted uppercase">
                      Cognición
                    </p>
                    <p className="font-bold text-clinic-text-base">
                      {w.subtotal_cognicion}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span className="text-clinic-text-muted">
                    Puntaje{" "}
                    <span className="font-bold text-clinic-text-base">
                      {w.puntaje_total ??
                        Number(w.subtotal_autocuidado) +
                          Number(w.subtotal_movilidad) +
                          Number(w.subtotal_cognicion)}
                    </span>
                    /126
                  </span>
                  <span className="text-clinic-primary font-bold">
                    {w.porcentaje_funcionalidad ??
                      (
                        ((Number(w.subtotal_autocuidado) +
                          Number(w.subtotal_movilidad) +
                          Number(w.subtotal_cognicion)) /
                          126) *
                        100
                      ).toFixed(2)}
                    %
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </>
  )}

      {/* MODALES */}
      <HistoriaIngresoModal
        isOpen={openModal === "ingreso"}
        onClose={() => setOpenModal(null)}
        pacienteId={pacienteId}
        onSuccess={fetchAll}
      />
      <ConsentimientoModal
        isOpen={openModal === "consentimientos"}
        onClose={() => setOpenModal(null)}
        pacienteId={pacienteId}
        onSuccess={fetchAll}
      />
      <OrdenMedicaModal
        isOpen={openModal === "ordenes"}
        onClose={() => setOpenModal(null)}
        pacienteId={pacienteId}
        onSuccess={fetchAll}
      />
      <ConsultaEspecialistaModal
        isOpen={openModal === "consultas"}
        onClose={() => setOpenModal(null)}
        pacienteId={pacienteId}
        onSuccess={fetchAll}
      />
      <EscalaWeefimModal
        isOpen={openModal === "weefim"}
        onClose={() => setOpenModal(null)}
        pacienteId={pacienteId}
        onSuccess={fetchAll}
      />
    </div>
  );
}
