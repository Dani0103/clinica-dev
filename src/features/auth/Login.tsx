import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // 1. Importamos el hook de autenticación

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Extraemos la función login del contexto

  // 3. Añadimos un estado para simular el tiempo de carga de una petición al servidor
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Iniciamos el estado de carga

    // Simulamos una petición al backend que tarda 1 segundo (1000ms)
    setTimeout(() => {
      // 4. Creamos un token falso (simulando lo que te devolvería tu API real)
      const tokenSimulado = "jwt_token_falso_ley2015_avanzar_ips_12345";

      // 5. Usamos la función del contexto para guardar la sesión
      login(tokenSimulado);

      setIsLoading(false); // Detenemos la carga

      // 6. Redirigimos al dashboard. Como ya estamos autenticados, el ProtectedRoute nos dejará pasar.
      navigate("/home");
    }, 1000);
  };

  return (
    // Contenedor principal responsive
    <div className="min-h-screen bg-clinic-bg-soft flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Tarjeta Blanca del Login responsive */}
      <div className="bg-clinic-bg-card w-full max-w-sm sm:max-w-md rounded-clinic-card shadow-clinic-subtle p-6 sm:p-8 md:p-10 transition-all duration-300">
        {/* Logo / Encabezado */}
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

        {/* Formulario Visual */}
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
              required // Hace que el navegador valide que no esté vacío
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

              {/* Contenedor del Tooltip */}
              <div className="relative group flex items-center">
                <button
                  type="button"
                  className="text-clinic-primary text-[10px] sm:text-xs font-medium hover:underline focus:outline-none"
                >
                  ¿Olvidó su clave?
                </button>

                {/* El mensaje flotante (Tooltip) */}
                <div className="absolute bottom-full right-0 mb-2 w-40 sm:w-48 p-2 sm:p-2.5 bg-gray-800 text-white text-[9px] sm:text-[10px] leading-tight text-center rounded-clinic-inner opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                  Por favor, diríjase al área de administración del servicio
                  para restaurar su acceso.
                  <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>

            <input
              type="password"
              id="password"
              required // Hace que el navegador valide que no esté vacío
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
            disabled={isLoading} // Desactiva el botón mientras carga
            className={`w-full text-white font-bold py-3 sm:py-3.5 text-sm sm:text-base rounded-clinic-inner transition-all transform mt-4 sm:mt-2 shadow-md 
              ${
                isLoading
                  ? "bg-clinic-primary-light cursor-not-allowed opacity-70"
                  : "bg-clinic-primary hover:bg-opacity-90 active:scale-[0.98] shadow-clinic-primary/25"
              }`}
          >
            {isLoading ? "Verificando Credenciales..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
