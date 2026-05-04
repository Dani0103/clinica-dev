import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol_id: number;
  rol?: { id: number; nombre: string };
  activo: boolean;
  esta_activo?: boolean;
  especialidad_id?: number;
  permisos: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  hasPermiso: (permiso: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token_avanzar");
    const storedUser = localStorage.getItem("user_avanzar");

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("token_avanzar", token);
    localStorage.setItem("user_avanzar", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token_avanzar");
    localStorage.removeItem("user_avanzar");
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Devuelve true si el usuario tiene al menos uno de los permisos indicados.
   * Si se pasa un array vacío o undefined, devuelve true (vista libre).
   */
  const hasPermiso = (permiso: string | string[]): boolean => {
    if (!user) return false;
    const lista = Array.isArray(permiso) ? permiso : [permiso];
    if (lista.length === 0) return true;
    return lista.some((p) => user.permisos?.includes(p));
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, login, logout, hasPermiso }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
