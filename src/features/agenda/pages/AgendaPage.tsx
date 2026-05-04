import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { toast } from "react-toastify";
import {
  useCitaService,
  usePacienteService,
  useUserService,
} from "@/services";
import type { CitaDeApi } from "@/services/citaService";
import PageLoader from "@/components/common/PageLoader";

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

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
};

/** datetime-local devuelve "YYYY-MM-DDTHH:mm" sin zona; el backend exige `after:now`. */
const toIsoFromLocalInput = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

/** Mínimo permitido para el input datetime-local: ahora + 5 min. */
const minDateTimeLocal = () => {
  const d = new Date(Date.now() + 5 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const nombreMedico = (medico: CitaDeApi["medico"]) =>
  `${medico.nombres} ${medico.apellidos}`.trim();

export default function AgendaPage() {
  const pacienteService = usePacienteService();
  const userService = useUserService();
  const citaService = useCitaService();

  const [pacientes, setPacientes] = useState<PacienteLite[]>([]);
  const [medicos, setMedicos] = useState<MedicoLite[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadLite[]>([]);
  const [citas, setCitas] = useState<CitaDeApi[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  const [docSearch, setDocSearch] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteLite | null>(null);
  const [medicoId, setMedicoId] = useState<number | "">("");
  const [especialidadId, setEspecialidadId] = useState<number | "">("");
  const [programadaPara, setProgramadaPara] = useState<string>("");

  const fetchCitas = async () => {
    setLoadingCitas(true);
    try {
      const res = await citaService.list();
      if (res?.data) setCitas(res.data);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo cargar el listado de citas");
    } finally {
      setLoadingCitas(false);
    }
  };

  const fetchInitial = async () => {
    try {
      const [pacRes, medRes, espRes] = await Promise.all([
        pacienteService.list({ per_page: 100 }),
        userService.medicos(),
        userService.especialidades(),
      ]);

      const pacRaw: any[] = pacRes?.data ?? [];
      setPacientes(
        pacRaw.map((p: any) => ({
          id: p.id,
          nombres: p.nombres,
          apellidos: p.apellidos,
          cedula: p.cedula,
          eps: p.eps,
        })),
      );

      const medRaw: any[] = medRes?.data ?? [];
      setMedicos(
        medRaw.map((m: any) => ({
          id: m.id,
          nombre: m.nombres
            ? `${m.nombres} ${m.apellidos || ""}`.trim()
            : m.nombre || "Médico",
          especialidad_id: m.especialidad_id ?? m.especialidad?.id,
          especialidad: m.especialidad?.nombre,
        })),
      );

      setEspecialidades(espRes?.data ?? []);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo cargar la información de agenda");
    }
  };

  useEffect(() => {
    fetchInitial();
    fetchCitas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-completar especialidad cuando se elige un médico que la tiene cargada
  useEffect(() => {
    if (!medicoId) return;
    const medico = medicos.find((m) => m.id === medicoId);
    if (medico?.especialidad_id) setEspecialidadId(medico.especialidad_id);
  }, [medicoId, medicos]);

  const filteredPacientes = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    if (!q) return pacientes.slice(0, 8);
    return pacientes
      .filter(
        (p) =>
          p.cedula.toLowerCase().includes(q) ||
          `${p.nombres} ${p.apellidos}`.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [docSearch, pacientes]);

  const resetForm = () => {
    setSelectedPaciente(null);
    setDocSearch("");
    setMedicoId("");
    setEspecialidadId("");
    setProgramadaPara("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPaciente) {
      toast.warning("Selecciona el paciente que recibirá la cita.");
      return;
    }
    if (!medicoId) {
      toast.warning("Selecciona el médico que atenderá la cita.");
      return;
    }
    if (!especialidadId) {
      toast.warning("Selecciona una especialidad.");
      return;
    }
    if (!programadaPara) {
      toast.warning("Define la fecha y hora de la cita.");
      return;
    }

    const isoDate = toIsoFromLocalInput(programadaPara);
    if (!isoDate || new Date(isoDate).getTime() <= Date.now()) {
      toast.warning("La cita debe agendarse a una fecha y hora futura.");
      return;
    }

    try {
      await citaService.create({
        paciente_id: selectedPaciente.id,
        medico_id: Number(medicoId),
        especialidad_id: Number(especialidadId),
        programada_para: isoDate,
      });

      toast.success("Cita agendada correctamente");
      resetForm();
      fetchCitas();
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg)),
        );
      } else {
        toast.error(err.message || "No se pudo agendar la cita");
      }
    }
  };

  return (
    <section className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-clinic-text-base flex items-center gap-2">
          <HiOutlineCalendar className="text-clinic-primary" />
          Agenda y Citas
        </h1>
        <p className="text-sm sm:text-base text-clinic-text-muted mt-1">
          Asigna una nueva cita seleccionando paciente, profesional y horario.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 p-6 space-y-6"
        >
          {/* Paciente: búsqueda por documento */}
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-2 flex items-center gap-2">
              <HiOutlineUser /> Paciente
            </label>

            {selectedPaciente ? (
              <div className="flex items-center justify-between gap-3 p-3 border border-clinic-primary/30 bg-clinic-primary-light/10 rounded-clinic-inner">
                <div>
                  <p className="font-bold text-clinic-text-base">
                    {selectedPaciente.nombres} {selectedPaciente.apellidos}
                  </p>
                  <p className="text-xs text-clinic-text-muted">
                    CC {selectedPaciente.cedula}
                    {selectedPaciente.eps ? ` · ${selectedPaciente.eps}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPaciente(null)}
                  className="text-xs font-bold text-clinic-primary hover:underline"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Buscar por documento o nombre..."
                  className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none"
                />

                {(docSearch || filteredPacientes.length > 0) && (
                  <ul className="mt-2 max-h-56 overflow-y-auto border border-gray-100 rounded-clinic-inner divide-y divide-gray-50 bg-white shadow-sm">
                    {filteredPacientes.length === 0 ? (
                      <li className="px-3 py-3 text-xs text-clinic-text-muted">
                        Sin coincidencias.
                      </li>
                    ) : (
                      filteredPacientes.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPaciente(p);
                              setDocSearch("");
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-clinic-primary/5 flex items-center justify-between"
                          >
                            <span>
                              <span className="font-semibold text-clinic-text-base">
                                {p.nombres} {p.apellidos}
                              </span>
                              <span className="text-xs text-clinic-text-muted ml-2">
                                CC {p.cedula}
                              </span>
                            </span>
                            {p.eps && (
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase">
                                {p.eps}
                              </span>
                            )}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Médico + Especialidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-2 flex items-center gap-2">
                <HiOutlineUserGroup /> Médico
              </label>
              <select
                value={medicoId}
                onChange={(e) =>
                  setMedicoId(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full p-3 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none bg-white"
              >
                <option value="">Selecciona médico...</option>
                {medicos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                    {m.especialidad ? ` — ${m.especialidad}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-2">
                Especialidad
              </label>
              <select
                value={especialidadId}
                onChange={(e) =>
                  setEspecialidadId(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full p-3 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none bg-white"
              >
                <option value="">Selecciona especialidad...</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha y hora */}
          <div>
            <label className="block text-xs font-bold text-clinic-text-muted uppercase mb-2 flex items-center gap-2">
              <HiOutlineClock /> Fecha y hora
            </label>
            <input
              type="datetime-local"
              value={programadaPara}
              min={minDateTimeLocal()}
              onChange={(e) => setProgramadaPara(e.target.value)}
              className="w-full p-3 text-sm border border-gray-200 rounded-clinic-inner focus:border-clinic-primary outline-none"
            />
            <p className="text-[10px] text-clinic-text-muted mt-1.5">
              * La cita debe agendarse en el futuro.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-clinic-inner transition-colors"
            >
              Limpiar
            </button>
            <button
              type="submit"
              disabled={citaService.isLoading}
              className={`px-5 py-2 text-sm font-bold text-white rounded-clinic-inner shadow-sm transition-all ${citaService.isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-clinic-primary hover:bg-opacity-90"}`}
            >
              {citaService.isLoading ? "Agendando..." : "Agendar cita"}
            </button>
          </div>
        </form>

        {/* PANEL: listado de citas */}
        <aside className="lg:col-span-2 bg-white rounded-clinic-card shadow-clinic-subtle border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-clinic-text-base">
              Citas registradas
            </h3>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">
              {citas.length}
            </span>
          </div>

          {loadingCitas ? (
            <PageLoader variant="inline" text="Cargando citas..." />
          ) : citas.length === 0 ? (
            <div className="text-center py-12 text-clinic-text-muted text-sm">
              <HiOutlineCalendar size={36} className="mx-auto mb-3 text-gray-300" />
              No hay citas registradas.
            </div>
          ) : (
            <ul className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {citas.map((c) => (
                <li
                  key={c.id}
                  className="p-4 border border-gray-100 bg-gray-50/50 rounded-clinic-inner"
                >
                  <p className="text-xs text-clinic-text-muted">
                    {formatDateTime(c.programada_para)}
                  </p>
                  <p className="font-bold text-clinic-text-base mt-1">
                    {c.paciente.nombres} {c.paciente.apellidos}
                    <span className="text-xs font-normal text-clinic-text-muted ml-2">
                      CC {c.paciente.cedula}
                    </span>
                  </p>
                  <p className="text-xs text-clinic-text-muted mt-1">
                    {nombreMedico(c.medico)}
                    {c.especialidad ? ` · ${c.especialidad.nombre}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </section>
  );
}
