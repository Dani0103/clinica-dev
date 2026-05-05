import type { User } from "@/context/AuthContext";

/**
 * Helpers de detección de rol — robustos a tildes, mayúsculas y variantes.
 * El backend canoniza los nombres como `Administrador`, `Medico`, `Coordinador`,
 * `Recepcionista` (ver `database/seeders/RolesSeeder.php`).
 */

/** Quita tildes y pasa a minúsculas. */
export const normalizeRol = (nombre?: string | null): string =>
  (nombre ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();

const matchesRol =
  (...variantes: string[]) =>
  (user?: User | null): boolean => {
    const n = normalizeRol(user?.rol?.nombre);
    return variantes.some((v) => n === normalizeRol(v));
  };

export const isAdministrador = matchesRol("administrador", "admin");
export const isCoordinador = matchesRol("coordinador", "supervisor");
export const isMedico = matchesRol("medico", "médico");
export const isRecepcionista = matchesRol("recepcionista", "recepcion", "recepción");

/** Nombre canónico para mostrar en UI. */
export const rolDisplayName = (nombre?: string | null): string => {
  const n = normalizeRol(nombre);
  if (!n) return "Sin rol";
  if (n === "administrador" || n === "admin") return "Administrador";
  if (n === "medico") return "Médico";
  if (n === "coordinador" || n === "supervisor") return "Coordinador";
  if (n === "recepcionista" || n === "recepcion") return "Recepcionista";
  // Cae al backend para roles nuevos.
  return nombre ?? "Sin rol";
};
