import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/api/apiEndpoints";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { execute, isLoading } = useApi();

  // Estados para el flujo
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Paso 1: Enviar correo
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await execute(
        AppUrls.avanzarApi,
        API_ENDPOINTS.PASSWORD.FORGOT,
        {
          method: "POST",
          body: { correo: email },
        },
      );
      console.log(respuesta);
      if (respuesta.status === "success") {
        toast.info("Código enviado con éxito");
        setStep(2);
      } else {
        toast.error(respuesta.message || "No encontramos el correo");
      }
    } catch (err: any) {
      console.log("🚀 ~ handleSendEmail ~ err:", err);
      toast.error("Error al conectar con el servidor", err.message);
    }
  };

  // Paso 2: Validar Código
  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await execute(
        AppUrls.avanzarApi,
        API_ENDPOINTS.PASSWORD.VALIDATE,
        {
          method: "POST",
          body: { correo: email, code: code },
        },
      );

      if (respuesta.status === "success") {
        toast.success(respuesta.message || "Código verificado");
        setStep(3);
      } else {
        toast.error(respuesta.message || "Código inválido");
      }
    } catch (err: any) {
      // Si el API devuelve errores específicos de campo (422)
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) => {
          messages.forEach((msg: string) => toast.error(msg));
        });
      } else {
        toast.error(err.message || "Error al validar el código");
      }
    }
  };

  // Paso 3: Cambio final de contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas locales no coinciden");
      return;
    }

    try {
      const respuesta = await execute(
        AppUrls.avanzarApi,
        API_ENDPOINTS.PASSWORD.RESET,
        {
          method: "POST",
          body: {
            correo: email,
            code: code,
            password: newPassword,
            password_confirmation: confirmPassword, // Laravel suele pedir este campo para validar
          },
        },
      );

      if (respuesta.status === "success") {
        toast.success("Contraseña actualizada exitosamente");
        navigate("/");
      }
    } catch (err: any) {
      // MANEJO DE ERRORES 422 (Validación de Laravel)
      if (err.errors) {
        // Recorremos el objeto de errores: { password: ["Demasiado corta", "..."], ... }
        Object.keys(err.errors).forEach((key) => {
          err.errors[key].forEach((mensaje: string) => {
            toast.error(mensaje);
          });
        });
      } else {
        toast.error(err.message || "Fallo al restablecer la contraseña");
      }
      console.error("Detalle del error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-clinic-bg-soft flex items-center justify-center p-4">
      <div className="bg-clinic-bg-card w-full max-w-md rounded-clinic-card shadow-clinic-subtle p-8 transition-all duration-300">
        {/* Indicador de Pasos (Opcional pero recomendado) */}
        <div className="flex justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 mx-1 rounded-full transition-colors ${step >= s ? "bg-clinic-primary" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-clinic-text-base text-2xl font-bold tracking-tight">
            {step === 1 && "Recuperar Acceso"}
            {step === 2 && "Verificar Identidad"}
            {step === 3 && "Nueva Contraseña"}
          </h1>
          <p className="text-clinic-text-muted mt-2 text-sm">
            {step === 1 && "Ingresa tu correo institucional."}
            {step === 2 && `Introduce el código enviado a ${email}`}
            {step === 3 &&
              "Crea una contraseña segura que no hayas usado antes."}
          </p>
        </div>

        {/* --- PASO 1: EMAIL --- */}
        {step === 1 && (
          <form className="space-y-5" onSubmit={handleSendEmail}>
            <div>
              <label className="block text-clinic-text-base font-semibold mb-2 text-sm">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-clinic-inner border border-gray-200 focus:border-clinic-primary outline-none"
                placeholder="ejemplo@avanzarips.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-clinic-primary text-white font-bold py-3.5 rounded-clinic-inner hover:bg-opacity-90 transition-all"
            >
              {isLoading ? "Enviando..." : "Enviar Código"}
            </button>
          </form>
        )}

        {/* --- PASO 2: CÓDIGO --- */}
        {step === 2 && (
          <form className="space-y-5" onSubmit={handleValidateCode}>
            <div>
              <label className="block text-clinic-text-base font-semibold mb-2 text-sm text-center">
                Código de Seguridad
              </label>
              <input
                type="text"
                required
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-clinic-inner border border-gray-200 focus:border-clinic-primary outline-none text-center tracking-[0.5em] font-bold text-xl"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-clinic-primary text-white font-bold py-3.5 rounded-clinic-inner hover:bg-opacity-90 transition-all"
            >
              Validar Código
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-clinic-text-muted text-xs hover:underline"
            >
              ¿No recibiste el código? Volver a intentar
            </button>
          </form>
        )}

        {/* --- PASO 3: NUEVA CLAVE --- */}
        {step === 3 && (
          <form className="space-y-5" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-clinic-text-base font-semibold mb-2 text-sm">
                Nueva Contraseña
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-clinic-inner border border-gray-200 focus:border-clinic-primary outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-clinic-text-base font-semibold mb-2 text-sm">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-clinic-inner border outline-none transition-all ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-clinic-primary"
                }`}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-clinic-primary text-white font-bold py-3.5 rounded-clinic-inner hover:bg-opacity-90 transition-all"
            >
              {isLoading ? "Actualizando..." : "Restablecer Contraseña"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-clinic-primary text-sm font-medium hover:underline"
          >
            ← Cancelar y volver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
