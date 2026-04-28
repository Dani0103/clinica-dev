// src/pages/NotFoundPage.tsx
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-9xl font-black text-clinic-primary/20">404</h1>
      <p className="text-2xl font-bold text-clinic-text-base mt-4">
        ¡Ups! Página no encontrada
      </p>
      <p className="text-clinic-text-muted mt-2 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-clinic-primary text-white font-bold rounded-clinic-inner shadow-lg hover:bg-opacity-90 transition-all"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default NotFoundPage;
