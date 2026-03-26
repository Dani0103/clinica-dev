export type Role = 'ADMIN' | 'MEDICO' | 'PACIENTE' | 'AUDITOR';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  ips: string;
  lastLogin: string;
}