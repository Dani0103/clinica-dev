import { useEffect, useState, type ReactNode } from "react";
import { HiOutlinePlus } from "react-icons/hi";
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

export default function PacienteHistoriaTabs({ pacienteId }: Props) {
  const [active, setActive] = useState<TabKey>("evoluciones");
  const [openModal, setOpenModal] = useState<TabKey | null>(null);

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

  const filterByPaciente = <T extends { paciente_id: number }>(items: T[]) =>
    items.filter((i: any) => Number(i.paciente_id) === Number(pacienteId));

  const fetchAll = async () => {
    try {
      const [
        evRes,
        ingRes,
        consRes,
        ordRes,
        cnsRes,
        weeRes,
      ] = await Promise.allSettled([
        terapiaService.list(),
        ingresoService.list(),
        consentService.list(),
        ordenService.list(),
        consultaService.list(),
        weefimService.list(),
      ]);

      if (evRes.status === "fulfilled")
        setEvoluciones(filterByPaciente(evRes.value?.data ?? []));
      if (ingRes.status === "fulfilled")
        setIngresos(filterByPaciente(ingRes.value?.data ?? []));
      if (consRes.status === "fulfilled")
        setConsentimientos(filterByPaciente(consRes.value?.data ?? []));
      if (ordRes.status === "fulfilled")
        setOrdenes(filterByPaciente(ordRes.value?.data ?? []));
      if (cnsRes.status === "fulfilled")
        setConsultas(filterByPaciente(cnsRes.value?.data ?? []));
      if (weeRes.status === "fulfilled")
        setWeefims(filterByPaciente(weeRes.value?.data ?? []));
    } catch (err: any) {
      toast.error(err?.message || "Error cargando la historia clínica");
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId]);

  // Por tab: contador + acción
  const newButtonLabel: Record<TabKey, string> = {
    evoluciones: "",
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
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 min-h-[400px]">
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3 mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`text-sm px-3 py-2 rounded-clinic-inner font-semibold transition-all ${active === t.key ? "bg-clinic-primary text-white shadow-sm" : "text-clinic-text-muted hover:bg-gray-50"}`}
          >
            {t.label}
            <span
              className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${active === t.key ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}
            >
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Botón "Nuevo" (no aplica para evoluciones — se crea desde el botón principal del header) */}
      {newButtonLabel[active] && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOpenModal(active)}
            className="flex items-center gap-2 px-4 py-2 bg-clinic-primary text-white text-sm font-bold rounded-clinic-inner hover:bg-opacity-90 shadow-sm transition-all"
          >
            <HiOutlinePlus size={18} /> {newButtonLabel[active]}
          </button>
        </div>
      )}

      {/* PANELES */}
      {active === "evoluciones" && (
        <div className="space-y-3">
          {evoluciones.length === 0 ? (
            <EmptyState msg="Sin evoluciones registradas." />
          ) : (
            evoluciones.map((t) => (
              <Card key={t.id}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold bg-white border border-teal-200 text-teal-700 px-2.5 py-1 rounded-lg uppercase">
                    {t.especialidad?.nombre || t.objetivo?.nombre || "Terapia"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(t.fecha_hora || t.created_at)}
                  </span>
                </div>
                <p className="font-bold text-clinic-text-base">
                  {t.objetivo?.nombre || "Objetivo"}
                </p>
                <p className="text-sm text-clinic-text-muted mt-1">
                  {t.objetivo?.descripcion || ""}
                </p>
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
                {o.medico?.nombres && (
                  <p className="text-[10px] text-clinic-text-muted mt-2">
                    Por: {o.medico.nombres} {o.medico.apellidos || ""}
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
