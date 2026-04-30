import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface LoginPayload {
  correo: string;
  password: string;
}

export interface ForgotPayload {
  correo: string;
}

export interface ValidateCodePayload {
  correo: string;
  code: string;
}

export interface ResetPasswordPayload {
  correo: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export const useAuthService = () => {
  const api = useApi();

  const login = (payload: LoginPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: payload,
    });

  const logout = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
    });

  const forgotPassword = (payload: ForgotPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PASSWORD.FORGOT, {
      method: "POST",
      body: payload,
    });

  const validateResetCode = (payload: ValidateCodePayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PASSWORD.VALIDATE, {
      method: "POST",
      body: payload,
    });

  const resetPassword = (payload: ResetPasswordPayload) =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.PASSWORD.RESET, {
      method: "POST",
      body: payload,
    });

  return {
    ...api,
    login,
    logout,
    forgotPassword,
    validateResetCode,
    resetPassword,
  };
};
