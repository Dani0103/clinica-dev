export interface USERINFO {
    id: number;
    nombre: string;
    rol: "MÉDICO" | "ADMIN" | "RECEPCIÓN" | string;
    rol_id?: number;
    especialidad?: string;
    especialidad_id?: number;
    correo?: string;
    estado: boolean;
}

export interface OptionItem {
    id: string | number;
    nombre: string;
}

export interface AdminContextType {
    rol: OptionItem[];
    especialidad: OptionItem[];
}
