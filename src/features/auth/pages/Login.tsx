import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/api/apiEndpoints";
import { toast } from "react-toastify"; // 1. Importamos toast

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  // No necesitamos extraer 'error' del hook si usaremos Toastify
  const { execute, isLoading } = useApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const infoLogueo = { correo: email, password };

      const respuesta = await execute(
        AppUrls.avanzarApi,
        API_ENDPOINTS.AUTH.LOGIN,
        {
          method: "POST",
          body: infoLogueo,
        },
      );

      if (respuesta.status === "success") {
        // Pasamos los datos a nuestro contexto
        login(respuesta.data.user, respuesta.data.token);
        toast.success(respuesta.message || "Bienvenido");

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        toast.error(respuesta.message || "Ocurrió un error al iniciar sesión");
      }
      console.log("respuesta:", respuesta);
    } catch (err: any) {
      // 2. Disparamos la notificación de error usando el mensaje que arrojó el hook
      toast.error(err.message || "Ocurrió un error al iniciar sesión");
      console.error("Fallo el login", err);
    }
  };

  useEffect(() => {
    //elimina credenciales del usuario conectado anteriormente
    logout();
  }, []);

  return (
    <div className="min-h-screen bg-clinic-bg-soft flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-clinic-bg-card w-full max-w-sm sm:max-w-md rounded-clinic-card shadow-clinic-subtle p-6 sm:p-8 md:p-10 transition-all duration-300">
        <div className="text-center mb-8 sm:mb-10">
          <div className="bg-clinic-primary w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-clinic-primary/30 transition-all duration-300">
            <span className="text-white text-2xl sm:text-3xl font-bold">A</span>
          </div>
          <h1 className="text-clinic-text-base text-xl sm:text-2xl font-bold tracking-tight">
            Avanzar IPS
          </h1>
          <p className="text-clinic-text-muted mt-1 sm:mt-2 text-xs sm:text-sm">
            Portal de Historias Clínicas
          </p>
        </div>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              className="block text-clinic-text-base font-semibold mb-1.5 sm:mb-2 text-xs sm:text-sm"
              htmlFor="email"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-clinic-inner border border-gray-200 focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary-light outline-none transition-all placeholder:text-gray-300"
              placeholder="nombre@avanzarips.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <label
                className="text-clinic-text-base font-semibold text-xs sm:text-sm"
                htmlFor="password"
              >
                Contraseña
              </label>

              <div className="relative group flex items-center">
                <Link
                  to="/forgot-password"
                  className="text-clinic-primary text-[10px] sm:text-xs font-medium hover:underline focus:outline-none"
                >
                  ¿Olvidó su clave?
                </Link>
                <div className="absolute bottom-full right-0 mb-2 w-40 sm:w-48 p-2 sm:p-2.5 bg-gray-800 text-white text-[9px] sm:text-[10px] leading-tight text-center rounded-clinic-inner opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                  Haz clic aquí para iniciar el proceso de recuperación de tu
                  acceso de forma segura.
                  <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>

            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-clinic-inner border border-gray-200 focus:border-clinic-primary focus:ring-2 focus:ring-clinic-primary-light outline-none transition-all placeholder:text-gray-300"
              placeholder="••••••••"
            />
            <p className="text-[9px] sm:text-[10px] text-clinic-text-muted mt-1.5 sm:mt-2 leading-relaxed">
              * La contraseña debe incluir mayúsculas, números y mínimo 8
              caracteres.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 sm:py-3.5 text-sm sm:text-base rounded-clinic-inner transition-all transform mt-4 sm:mt-2 shadow-md 
              ${isLoading ? "bg-clinic-primary-light cursor-not-allowed opacity-70" : "bg-clinic-primary hover:bg-opacity-90 active:scale-[0.98] shadow-clinic-primary/25"}`}
          >
            {isLoading ? "Verificando Credenciales..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
