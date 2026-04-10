export interface USERINFO {
    id: number;
    nombre: string;
    rol: "MÉDICO" | "ADMIN" | "RECEPCIÓN";
    especialidad?: string;
    estado: boolean;
}