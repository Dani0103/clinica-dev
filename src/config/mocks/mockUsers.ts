import type { USERINFO } from "@/types/AdminUser/UsersManagement";

export const MOCK_USERS: USERINFO[] = [
    { id: 1, nombre: "Dr. Carlos Mendoza", rol: "MÉDICO", especialidad: "Pediatría", estado: true },
    { id: 2, nombre: "Dra. Elena Rodríguez", rol: "MÉDICO", especialidad: "Cardiología", estado: true },
    { id: 3, nombre: "Admin General", rol: "ADMIN", estado: true },
    { id: 4, nombre: "Laura Garcés", rol: "RECEPCIÓN", estado: true },
    { id: 5, nombre: "Dr. Julián Castro", rol: "MÉDICO", especialidad: "Dermatología", estado: false },
    { id: 6, nombre: "Dra. Sofía Villa", rol: "MÉDICO", especialidad: "Ginecología", estado: true },
    { id: 7, nombre: "Ricardo Pérez", rol: "RECEPCIÓN", estado: true },
    { id: 8, nombre: "Soporte Técnico", rol: "ADMIN", estado: true },
    { id: 9, nombre: "Dr. Fernando Soto", rol: "MÉDICO", especialidad: "Neurología", estado: true },
    { id: 10, nombre: "Dra. Patricia Luna", rol: "MÉDICO", especialidad: "Oftalmología", estado: false },
    // ... Generando más registros variados
    ...Array.from({ length: 40 }).map((_, i) => {
        const id = i + 11;
        const roles: ("MÉDICO" | "ADMIN" | "RECEPCIÓN")[] = ["MÉDICO", "ADMIN", "RECEPCIÓN"];
        const rol = roles[id % 3];
        const especialidades = ["General", "Urgencias", "Psicología", "Ortopedia", "Internista"];

        return {
            id,
            nombre: `Usuario ${id} - ${rol === "MÉDICO" ? 'Dr(a). ' : ''}${["Gómez", "Torres", "Ruiz", "Marín", "Vargas"][id % 5]}`,
            rol,
            especialidad: rol === "MÉDICO" ? especialidades[id % 5] : undefined,
            estado: id % 7 !== 0 // Algunos inactivos cada 7 registros
        };
    })
];