import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineLockClosed,
  HiOutlinePlus,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import { toast } from "react-toastify";
import {
  useCitaService,
  usePacienteService,
  useUserService,
} from "@/services";
import type { CitaDeApi } from "@/services/citaService";
import { useAuth } from "@/context/AuthContext";
import { isMedico } from "@/utils/roles";
import PageLoader from "@/components/common/PageLoader";

/* ─────────────────────────── Tipos locales ─────────────────────────── */
interface PacienteLite {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  eps?: string;
}
interface MedicoLite {
  id: number;
  nombre: string;
  especialidad_id?: number;
  especialidad?: string;
}
interface EspecialidadLite {
  id: number;
  nombre: string;
}

/* ─────────────────────────── Helpers ────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, "0");

const formatHora = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch { return "--:--"; }
};

const formatFechaCorta = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch { return iso; }
};

const formatFechaLarga = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("es-CO", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch { return iso; }
};

const toIsoFromLocalInput = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

const minDateTimeLocal = () => {
  const d = new Date(Date.now() + 5 * 60 * 1000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const nombreMedico = (medico: CitaDeApi["medico"] | null | undefined): string => {
  if (!medico) return "Médico no asignado";
  if (medico.nombre) return medico.nombre.trim();
  return `${medico.nombres ?? ""} ${medico.apellidos ?? ""}`.trim() || "Sin nombre";
};

const initiales = (nombres: string, apellidos: string) =>
  `${nombres[0] ?? ""}${apellidos[0] ?? ""}`.toUpperCase();

/** Mapea nombre de especialidad a clases Tailwind del proyecto */
const specialtyBadge = (nombre?: string | null): string => {
  const n = (nombre ?? "").toLowerCase();
  if (n.includes("fisio"))  return "bg-clinic-badge-fisio text-emerald-800";
  if (n.includes("fono"))   return "bg-clinic-badge-fono text-pink-800";
  if (n.includes("audio"))  return "bg-clinic-badge-audio text-amber-800";
  if (n.includes("psico"))  return "bg-clinic-badge-psico text-pink-700";
  return "bg-gray-100 text-gray-600";
};

const avatarGradient = (idx: number) => {
  const opts = [
    "from-clinic-primary/30 to-clinic-primary/10 text-clinic-primary",
    "from-clinic-accent/30 to-clinic-accent/10 text-clinic-accent",
    "from-emerald-200 to-emerald-50 text-emerald-700",
    "from-amber-200 to-amber-50 text-amber-700",
    "from-pink-200 to-pink-50 text-pink-700",
  ];
  return opts[idx % opts.length];
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/* ─────────────────────────── Mini Calendario ───────────────────────── */
function MiniCalendar({
  citas,
  onSelectDay,
  selectedDay,
}: {
  citas: CitaDeApi[];
  onSelectDay: (d: Date) => void;
  selectedDay: Date | null;
}) {
  const [cursor, setCursor] = useState(new Date());

  const year  = cursor.getFullYear();
  const month = cursor.getMonth();

  const monthName = cursor.toLocaleString("es-CO", { month: "long" });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();

  const citaDays = useMemo(
    () =>
      new Set(
        citas.map((c) => {
          const d = new Date(c.programada_para);
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        }),
      ),
    [citas],
  );

  const hasEvent = (d: number) =>
    citaDays.has(`${year}-${month}-${d}`);

  const today = new Date();

  const prev = () => setCursor(new Date(year, month - 1, 1));
  const next = () => setCursor(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-clinic-card border border-gray-100 shadow-clinic-subtle p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-clinic-text-muted"
        >
          <HiOutlineChevronLeft size={16} />
        </button>
        <h3 className="text-sm font-bold text-clinic-text-base capitalize">
          {monthName} {year}
        </h3>
        <button
          onClick={next}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-clinic-text-muted"
        >
          <HiOutlineChevronRight size={16} />
        </button>
      </div>

      {/* Días semana */}
      <div className="grid grid-cols-7 mb-1">
        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-clinic-text-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Grilla */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const thisDate  = new Date(year, month, d);
          const isToday   = isSameDay(thisDate, today);
          const isSelected = selectedDay ? isSameDay(thisDate, selectedDay) : false;
          const hasCita   = hasEvent(d);

          return (
            <button
              key={d}
              onClick={() => onSelectDay(thisDate)}
              className={`relative w-8 h-8 mx-auto flex items-center justify-center text-xs rounded-lg font-medium transition-all
                ${isSelected
                  ? "bg-clinic-primary text-white font-bold shadow-sm"
                  : isToday
                  ? "bg-clinic-accent text-white font-bold"
                  : "hover:bg-clinic-bg-soft text-clinic-text-base"
                }`}
            >
              {d}
              {hasCita && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-clinic-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── Página principal ───────────────────────── */
export default function AgendaPage() {
  const pacienteService = usePacienteService();
  const userService     = useUserService();
  const citaService     = useCitaService();
  const { user, hasPermiso } = useAuth();
  const esMedico = isMedico(user);

  /** Puede asignar/crear citas: requiere el permiso `agenda.crear` */
  const puedeAgendar = hasPermiso("agenda.crear");

  /* ── Datos base ── */
  const [pacientes,    setPacientes]    = useState<PacienteLite[]>([]);
  const [medicos,      setMedicos]      = useState<MedicoLite[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadLite[]>([]);
  const [citas,        setCitas]        = useState<CitaDeApi[]>([]);
  const [loadingInit,  setLoadingInit]  = useState(true);
  const [loadingCitas, setLoadingCitas] = useState(false);

  /* ── UI state ── */
  const [mode, setMode]                     = useState<"detalle" | "form">("detalle");
  const [selectedCita, setSelectedCita]     = useState<CitaDeApi | null>(null);
  const [calendarDay,  setCalendarDay]      = useState<Date | null>(null);
  const [filterDate,   setFilterDate]       = useState<"hoy" | "semana" | "todos">("hoy");

  /* ── Form state ── */
  const [docSearch,       setDocSearch]       = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteLite | null>(null);
  const [medicoId,        setMedicoId]        = useState<number | "">("");
  const [especialidadId,  setEspecialidadId]  = useState<number | "">("");
  const [programadaPara,  setProgramadaPara]  = useState("");

  /* ────────────────── Fetch ────────────────── */
  const fetchCitas = async () => {
    setLoadingCitas(true);
    try {
      // El médico solo ve sus propias citas. Recepcionista/Admin ven todas.
      const filtros = esMedico && user ? { medico_id: user.id } : undefined;
      const res = await citaService.list(filtros);
      if (res?.data) setCitas(res.data);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo cargar el listado de citas");
    } finally {
      setLoadingCitas(false);
    }
  };

  const fetchInitial = async () => {
    setLoadingInit(true);
    try {
      const [pacRes, medRes, espRes, misCitasRes] = await Promise.all([
        pacienteService.list({ per_page: 100 }),
        userService.medicos(),
        userService.especialidades(),
        esMedico && user ? citaService.list({ medico_id: user.id }) : Promise.resolve(null),
      ]);

      const pacRaw: any[] = pacRes?.data ?? [];
      let pacList: PacienteLite[] = pacRaw.map((p: any) => ({
        id: p.id, nombres: p.nombres, apellidos: p.apellidos,
        cedula: p.cedula, eps: p.eps,
      }));

      if (esMedico && misCitasRes?.data) {
        const ids = new Set<number>((misCitasRes.data as any[]).map((c: any) => c.paciente_id));
        pacList = pacList.filter((p) => ids.has(p.id));
      }
      setPacientes(pacList);

      const medList: MedicoLite[] = (medRes?.data ?? []).map((m: any) => ({
        id: m.id,
        nombre: m.nombres ? `${m.nombres} ${m.apellidos || ""}`.trim() : m.nombre || "Médico",
        especialidad_id: m.especialidad_id ?? m.especialidad?.id,
        especialidad: m.especialidad?.nombre,
      }));
      setMedicos(esMedico && user ? medList.filter((m) => m.id === user.id) : medList);
      setEspecialidades(espRes?.data ?? []);

      if (esMedico && user) {
        setMedicoId(user.id);
        if (user.especialidad_id) setEspecialidadId(user.especialidad_id);
      }
    } catch (err: any) {
      toast.error(err?.message || "No se pudo cargar la información de agenda");
    } finally {
      setLoadingInit(false);
    }
  };

  useEffect(() => { fetchInitial(); fetchCitas(); }, []);

  useEffect(() => {
    if (!medicoId) return;
    const m = medicos.find((m) => m.id === medicoId);
    if (m?.especialidad_id) setEspecialidadId(m.especialidad_id);
  }, [medicoId, medicos]);

  /* ────────────────── Derivados ────────────────── */
  const today = new Date();

  const citasFiltradas = useMemo(() => {
    if (calendarDay) {
      return citas.filter((c) => isSameDay(new Date(c.programada_para), calendarDay));
    }
    if (filterDate === "hoy") {
      return citas.filter((c) => isSameDay(new Date(c.programada_para), today));
    }
    if (filterDate === "semana") {
      const start = new Date(today); start.setDate(today.getDate() - today.getDay());
      const end   = new Date(start); end.setDate(start.getDate() + 6);
      return citas.filter((c) => {
        const d = new Date(c.programada_para);
        return d >= start && d <= end;
      });
    }
    return citas;
  }, [citas, filterDate, calendarDay]);

  const citasHoy = useMemo(
    () => citas.filter((c) => isSameDay(new Date(c.programada_para), today)),
    [citas],
  );

  const proximaCita = useMemo(
    () =>
      [...citas]
        .filter((c) => new Date(c.programada_para) > today)
        .sort((a, b) => new Date(a.programada_para).getTime() - new Date(b.programada_para).getTime())[0] ?? null,
    [citas],
  );

  const filteredPacientes = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    if (!q) return pacientes.slice(0, 8);
    return pacientes.filter(
      (p) =>
        p.cedula.toLowerCase().includes(q) ||
        `${p.nombres} ${p.apellidos}`.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [docSearch, pacientes]);

  /* ────────────────── Acciones ────────────────── */
  const resetForm = () => {
    setSelectedPaciente(null); setDocSearch(""); setProgramadaPara("");
    if (esMedico && user) { setMedicoId(user.id); if (user.especialidad_id) setEspecialidadId(user.especialidad_id); }
    else { setMedicoId(""); setEspecialidadId(""); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaciente) { toast.warning("Selecciona el paciente."); return; }
    if (!medicoId)          { toast.warning("Selecciona el médico.");   return; }
    if (!especialidadId)    { toast.warning("Selecciona la especialidad."); return; }
    if (!programadaPara)    { toast.warning("Define la fecha y hora."); return; }

    const isoDate = toIsoFromLocalInput(programadaPara);
    if (!isoDate || new Date(isoDate).getTime() <= Date.now()) {
      toast.warning("La cita debe agendarse en el futuro."); return;
    }
    try {
      await citaService.create({
        paciente_id: selectedPaciente.id,
        medico_id: Number(medicoId),
        especialidad_id: Number(especialidadId),
        programada_para: isoDate,
      });
      toast.success("✅ Cita agendada correctamente");
      resetForm();
      setMode("detalle");
      fetchCitas();
    } catch (err: any) {
      if (err.errors) Object.values(err.errors).forEach((msgs: any) => msgs.forEach((m: string) => toast.error(m)));
      else toast.error(err.message || "No se pudo agendar la cita");
    }
  };

  /* ────────────────── Render ────────────────── */
  if (loadingInit) return <PageLoader text="Cargando agenda..." />;

  return (
    <section className="flex flex-col gap-4 animate-fade-in">

      {/* ── CABECERA ── */}
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-clinic-text-base flex items-center gap-2 leading-tight">
            <HiOutlineCalendar className="text-clinic-primary shrink-0" size={22} />
            <span className="truncate">Agendamiento de Citas</span>
          </h1>
          <p className="text-xs sm:text-sm text-clinic-text-muted mt-0.5 truncate">
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>

        {/* Solo Recepcionista / Admin pueden crear citas */}
        {puedeAgendar && (
          <button
            onClick={() => { resetForm(); setMode("form"); setSelectedCita(null); }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-clinic-primary text-white text-xs sm:text-sm font-bold rounded-clinic-inner shadow-sm hover:bg-opacity-90 transition-all shrink-0"
          >
            <HiOutlinePlus size={18} />
            <span className="hidden sm:inline">Nueva Cita</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        )}

        {/* Médico: badge informativo de solo lectura */}
        {esMedico && (
          <span className="hidden sm:flex items-center gap-2 px-3 py-2 bg-clinic-bg-soft text-clinic-accent text-xs font-bold rounded-clinic-inner border border-clinic-accent/20 shrink-0">
            <HiOutlineCalendar size={14} />
            Mis citas agendadas
          </span>
        )}
      </header>

      {/* ── BODY: 3 columnas (Recepcionista/Admin) | 2 columnas (Médico) ── */}
      <div className={`grid grid-cols-1 gap-4 ${
        puedeAgendar
          ? "lg:grid-cols-[2fr_2.2fr_1.3fr]"
          : "lg:grid-cols-[2fr_2.5fr_1.3fr]"
      }`}>

        {/* ══ COL 1: Stats + Lista de citas ══ */}
        <div className="flex flex-col gap-4">

          {/* Tarjeta stats (gradiente clinic-accent → clinic-primary) */}
          <div
            className="rounded-clinic-card p-4 sm:p-5 text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #3E36B0 0%, #00ADCD 100%)" }}
          >
            <p className="text-xs sm:text-sm font-semibold opacity-80 mb-1">Visitas de hoy</p>
            <p className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">{citasHoy.length}</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* Nuevos */}
              <div className="bg-white/15 rounded-clinic-inner p-3">
                <p className="text-xs opacity-75">Programadas total</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-2xl font-bold">{citas.length}</p>
                  <span className="text-[11px] font-bold bg-clinic-badge-new text-emerald-700 px-2 py-0.5 rounded-full">
                    Activas
                  </span>
                </div>
              </div>
              {/* Próximas */}
              <div className="bg-white/15 rounded-clinic-inner p-3">
                <p className="text-xs opacity-75">Esta semana</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-2xl font-bold">
                    {citas.filter((c) => {
                      const d = new Date(c.programada_para);
                      const s = new Date(today); s.setDate(today.getDate() - today.getDay());
                      const e = new Date(s); e.setDate(s.getDate() + 6);
                      return d >= s && d <= e;
                    }).length}
                  </p>
                  <span className="text-[11px] font-bold bg-clinic-badge-old text-red-600 px-2 py-0.5 rounded-full">
                    Semana
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de citas del día / filtro */}
          <div className="flex flex-col bg-white rounded-clinic-card border border-gray-100 shadow-clinic-subtle overflow-hidden max-h-[60vh]">
            {/* Cabecera lista */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <h3 className="text-sm font-bold text-clinic-text-base">Lista de Citas</h3>
              <div className="flex gap-1 bg-gray-50 rounded-lg p-0.5">
                {(["hoy", "semana", "todos"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilterDate(f); setCalendarDay(null); }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md capitalize transition-all ${
                      filterDate === f && !calendarDay
                        ? "bg-white shadow-sm text-clinic-accent"
                        : "text-clinic-text-muted hover:text-clinic-text-base"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {loadingCitas ? (
                <div className="flex items-center justify-center h-32">
                  <PageLoader variant="inline" text="Cargando..." />
                </div>
              ) : citasFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-clinic-text-muted text-sm gap-2">
                  <HiOutlineCalendar size={28} className="text-gray-200" />
                  <p>Sin citas para este período</p>
                </div>
              ) : (
                citasFiltradas
                  .sort((a, b) => new Date(a.programada_para).getTime() - new Date(b.programada_para).getTime())
                  .map((c, idx) => {
                    const isSelected = selectedCita?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCita(c); setMode("detalle"); }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                          isSelected
                            ? "bg-clinic-bg-soft"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xs font-bold shrink-0 ${avatarGradient(idx)}`}
                        >
                          {initiales(c.paciente.nombres, c.paciente.apellidos)}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isSelected ? "text-clinic-accent" : "text-clinic-text-base"}`}>
                            {c.paciente.nombres} {c.paciente.apellidos}
                          </p>
                          {c.especialidad && (
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${specialtyBadge(c.especialidad.nombre)}`}>
                              {c.especialidad.nombre}
                            </span>
                          )}
                        </div>
                        {/* Hora */}
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                          isSelected
                            ? "bg-clinic-primary text-white"
                            : "bg-gray-100 text-clinic-text-muted"
                        }`}>
                          {formatHora(c.programada_para)}
                        </span>
                      </button>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* ══ COL 2: Detalle de cita / Formulario ══ */}
        <div className={`flex-col bg-white rounded-clinic-card border border-gray-100 shadow-clinic-subtle overflow-hidden lg:flex ${
          (selectedCita || mode === "form") ? "flex" : "hidden lg:flex"
        }`}>

          {mode === "detalle" || !puedeAgendar ? (
            /* ─── PANEL DETALLE ─── */
            !selectedCita ? (
              <div className="flex flex-col items-center justify-center h-full text-clinic-text-muted gap-3 p-8">
                <div className="w-16 h-16 rounded-2xl bg-clinic-bg-soft flex items-center justify-center">
                  <HiOutlineCalendar size={28} className="text-clinic-primary" />
                </div>
                <p className="text-sm font-semibold text-clinic-text-base">
                  {esMedico ? "Selecciona una de tus citas" : "Selecciona una cita"}
                </p>
                <p className="text-xs text-center max-w-xs">
                  {esMedico
                    ? "Elige una cita de la lista para ver su detalle."
                    : "Elige una cita de la lista para ver su detalle, o crea una nueva con el botón de arriba."}
                </p>
                {puedeAgendar && (
                  <button
                    onClick={() => { resetForm(); setMode("form"); }}
                    className="mt-2 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-clinic-primary/40 text-clinic-primary text-sm font-bold rounded-clinic-inner hover:bg-clinic-primary/5 transition-colors"
                  >
                    <HiOutlinePlus size={16} /> Nueva Cita
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Header detalle */}
                <div
                  className="p-5 shrink-0"
                  style={{ background: "linear-gradient(135deg, #3E36B0 0%, #00ADCD 100%)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                        {initiales(selectedCita.paciente.nombres, selectedCita.paciente.apellidos)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-base">
                          {selectedCita.paciente.nombres} {selectedCita.paciente.apellidos}
                        </p>
                        <p className="text-white/70 text-xs">
                          CC {selectedCita.paciente.cedula}
                          {selectedCita.paciente.eps ? ` · ${selectedCita.paciente.eps}` : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCita(null)}
                      className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <HiOutlineX size={18} />
                    </button>
                  </div>
                </div>

                {/* Cuerpo detalle */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <h4 className="text-xs font-bold text-clinic-text-muted uppercase tracking-wider">
                    Detalle de la cita
                  </h4>

                  {/* Tarjeta fecha/hora */}
                  <div className="flex items-center gap-3 p-4 bg-clinic-bg-soft rounded-clinic-inner border border-clinic-primary/20">
                    <div className="w-10 h-10 rounded-xl bg-clinic-primary/10 flex items-center justify-center shrink-0">
                      <HiOutlineCalendar size={20} className="text-clinic-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-clinic-text-muted uppercase">Fecha y hora</p>
                      <p className="text-sm font-bold text-clinic-text-base capitalize">
                        {formatFechaLarga(selectedCita.programada_para)}
                      </p>
                    </div>
                  </div>

                  {/* Médico */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-clinic-inner">
                    <div className="w-10 h-10 rounded-xl bg-clinic-accent/10 flex items-center justify-center shrink-0">
                      <HiOutlineUser size={20} className="text-clinic-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-clinic-text-muted uppercase">Profesional</p>
                      <p className="text-sm font-bold text-clinic-text-base">
                        {nombreMedico(selectedCita.medico)}
                      </p>
                    </div>
                  </div>

                  {/* Especialidad */}
                  {selectedCita.especialidad && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-clinic-inner">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <HiOutlineOfficeBuilding size={20} className="text-clinic-text-muted" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-clinic-text-muted uppercase">Especialidad</p>
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mt-1 ${specialtyBadge(selectedCita.especialidad.nombre)}`}>
                          {selectedCita.especialidad.nombre}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ID cita */}
                  <div className="flex items-center justify-between p-3 border border-dashed border-gray-200 rounded-clinic-inner">
                    <span className="text-xs text-clinic-text-muted">ID Cita</span>
                    <span className="text-xs font-bold text-clinic-text-base font-mono">
                      #{String(selectedCita.id).padStart(5, "0")}
                    </span>
                  </div>

                  {/* Estado */}
                  <div className="flex items-center gap-2 p-3 bg-clinic-badge-new rounded-clinic-inner">
                    <HiOutlineCheckCircle size={18} className="text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-700">Cita programada correctamente</p>
                  </div>

                  <p className="text-[10px] text-clinic-text-muted text-center">
                    Registrada el {formatFechaCorta(selectedCita.created_at)}
                  </p>
                </div>

                {/* Footer detalle — solo para quien puede agendar */}
                {puedeAgendar && (
                  <div className="p-4 border-t border-gray-100 shrink-0">
                    <button
                      onClick={() => { resetForm(); setMode("form"); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-clinic-primary border-2 border-clinic-primary/30 rounded-clinic-inner hover:bg-clinic-primary/5 transition-colors"
                    >
                      <HiOutlinePlus size={16} /> Agendar otra cita
                    </button>
                  </div>
                )}
              </div>
            )
          ) : puedeAgendar ? (
            /* ─── FORMULARIO NUEVA CITA — solo Recepcionista / Admin ─── */
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header form */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <div>
                  <h3 className="text-base font-bold text-clinic-text-base">Agendar Nueva Cita</h3>
                  <p className="text-xs text-clinic-text-muted mt-0.5">Completa los datos para registrar la cita</p>
                </div>
                <button
                  onClick={() => setMode("detalle")}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-clinic-text-muted"
                >
                  <HiOutlineX size={18} />
                </button>
              </div>

              {/* Body form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">

                {/* Paciente */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-clinic-text-muted uppercase mb-2">
                    <HiOutlineUser size={13} /> Paciente
                    {esMedico && (
                      <span className="ml-auto text-[10px] font-normal normal-case text-clinic-text-muted">
                        Tus pacientes ({pacientes.length})
                      </span>
                    )}
                  </label>

                  {esMedico && pacientes.length === 0 && !selectedPaciente && (
                    <div className="mb-3 p-3 rounded-clinic-inner bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      <p className="font-bold">Sin pacientes asignados.</p>
                      <p className="mt-0.5">Solicita a Recepción que registre la primera cita.</p>
                    </div>
                  )}

                  {selectedPaciente ? (
                    <div className="flex items-center gap-3 p-3 border border-clinic-primary/30 bg-clinic-primary/5 rounded-clinic-inner">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clinic-primary/20 to-clinic-primary/5 flex items-center justify-center text-clinic-primary font-bold text-sm shrink-0">
                        {initiales(selectedPaciente.nombres, selectedPaciente.apellidos)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-clinic-text-base text-sm truncate">
                          {selectedPaciente.nombres} {selectedPaciente.apellidos}
                        </p>
                        <p className="text-xs text-clinic-text-muted">CC {selectedPaciente.cedula}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPaciente(null)}
                        className="text-xs font-bold text-clinic-primary hover:bg-clinic-primary/10 px-2 py-1 rounded-md transition-colors shrink-0"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          value={docSearch}
                          onChange={(e) => setDocSearch(e.target.value)}
                          placeholder="Buscar por documento o nombre..."
                          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-clinic-inner outline-none focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary/15 placeholder:text-gray-400 transition-all"
                          autoComplete="off"
                        />
                        {docSearch && (
                          <button type="button" onClick={() => setDocSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full p-1">
                            <HiOutlineX size={14} />
                          </button>
                        )}
                      </div>
                      {(docSearch || filteredPacientes.length > 0) && (
                        <ul className="mt-1.5 max-h-48 overflow-y-auto border border-gray-100 rounded-clinic-inner bg-white shadow-sm divide-y divide-gray-50">
                          {filteredPacientes.length === 0 ? (
                            <li className="px-4 py-5 text-center text-xs text-clinic-text-muted italic">
                              Sin resultados para "{docSearch}"
                            </li>
                          ) : filteredPacientes.map((p) => (
                            <li key={p.id}>
                              <button
                                type="button"
                                onClick={() => { setSelectedPaciente(p); setDocSearch(""); }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-clinic-primary/5 transition-colors flex items-center gap-2.5"
                              >
                                <div className="w-8 h-8 rounded-lg bg-clinic-bg-soft flex items-center justify-center text-clinic-primary font-bold text-xs shrink-0">
                                  {initiales(p.nombres, p.apellidos)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-clinic-text-base truncate text-xs">
                                    {p.nombres} {p.apellidos}
                                  </p>
                                  <p className="text-[10px] text-clinic-text-muted">CC {p.cedula}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>

                {/* Médico + Especialidad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-clinic-text-muted uppercase mb-2">
                      <HiOutlineUserGroup size={13} /> Médico
                      {esMedico && (
                        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-clinic-primary bg-clinic-primary/5 px-2 py-0.5 rounded-full normal-case font-bold">
                          <HiOutlineLockClosed size={10} /> Tú
                        </span>
                      )}
                    </label>
                    <select
                      value={medicoId}
                      onChange={(e) => setMedicoId(e.target.value ? Number(e.target.value) : "")}
                      disabled={esMedico}
                      className={`w-full p-2.5 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none transition-colors ${esMedico ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                    >
                      <option value="">Selecciona médico...</option>
                      {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre}{m.especialidad ? ` — ${m.especialidad}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-clinic-text-muted uppercase mb-2 block">Especialidad</label>
                    <select
                      value={especialidadId}
                      onChange={(e) => setEspecialidadId(e.target.value ? Number(e.target.value) : "")}
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none bg-white"
                    >
                      <option value="">Selecciona...</option>
                      {especialidades.map((esp) => (
                        <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fecha y hora */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-clinic-text-muted uppercase mb-2">
                    <HiOutlineClock size={13} /> Fecha y hora
                  </label>
                  <input
                    type="datetime-local"
                    value={programadaPara}
                    min={minDateTimeLocal()}
                    onChange={(e) => setProgramadaPara(e.target.value)}
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none"
                  />
                  <p className="text-[10px] text-clinic-text-muted mt-1">
                    * La cita debe agendarse en el futuro (mínimo 5 minutos).
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setMode("detalle"); }}
                    className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-clinic-inner transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={citaService.isLoading}
                    className={`flex-1 py-2.5 text-sm font-bold text-white rounded-clinic-inner shadow-sm transition-all ${citaService.isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-clinic-primary hover:bg-opacity-90"}`}
                  >
                    {citaService.isLoading ? "Agendando..." : "Confirmar Cita"}
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>

        {/* ══ COL 3: Calendario + Próxima cita ══ */}
        <div className="flex flex-col gap-4">

          <MiniCalendar
            citas={citas}
            onSelectDay={(d) => {
              setCalendarDay((prev) => (prev && isSameDay(prev, d) ? null : d));
              setFilterDate("hoy");
            }}
            selectedDay={calendarDay}
          />

          {/* Próxima cita */}
          {proximaCita && (
            <div className="bg-white rounded-clinic-card border border-gray-100 shadow-clinic-subtle p-4">
              <h4 className="text-xs font-bold text-clinic-text-muted uppercase mb-3">
                Próxima cita
              </h4>
              <button
                onClick={() => { setSelectedCita(proximaCita); setMode("detalle"); }}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clinic-accent/20 to-clinic-accent/5 flex items-center justify-center text-clinic-accent font-bold text-xs shrink-0">
                    {initiales(proximaCita.paciente.nombres, proximaCita.paciente.apellidos)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-clinic-text-base truncate">
                      {proximaCita.paciente.nombres} {proximaCita.paciente.apellidos}
                    </p>
                    {proximaCita.especialidad && (
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${specialtyBadge(proximaCita.especialidad.nombre)}`}>
                        {proximaCita.especialidad.nombre}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-clinic-text-muted bg-clinic-bg-soft rounded-lg px-3 py-2">
                  <HiOutlineClock size={13} className="text-clinic-primary shrink-0" />
                  <span className="font-medium capitalize">{formatFechaLarga(proximaCita.programada_para)}</span>
                </div>
              </button>
            </div>
          )}

          {/* Resumen del día seleccionado */}
          {calendarDay && (
            <div className="bg-white rounded-clinic-card border border-clinic-primary/20 shadow-clinic-subtle p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-clinic-primary uppercase">
                  {calendarDay.toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
                </h4>
                <button
                  onClick={() => setCalendarDay(null)}
                  className="text-clinic-text-muted hover:text-clinic-text-base p-0.5"
                >
                  <HiOutlineX size={14} />
                </button>
              </div>
              <p className="text-2xl font-bold text-clinic-text-base">
                {citasFiltradas.length}
              </p>
              <p className="text-xs text-clinic-text-muted">
                {citasFiltradas.length === 1 ? "cita programada" : "citas programadas"}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
