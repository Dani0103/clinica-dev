import { useState, useCallback } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ResponseType = "json" | "blob";

interface RequestOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
  responseType?: ResponseType;
}

export interface ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  payload?: any;
}

const buildQuery = (
  params?: Record<string, string | number | boolean | undefined | null>,
): string => {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    usp.append(key, String(value));
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
};

export const useApi = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (url: string, endpoint: string, options?: RequestOptions): Promise<any> => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token_avanzar");

        const customHeaders: HeadersInit = {
          Accept: "application/json",
          ...(options?.responseType !== "blob" && { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        };

        const fullUrl = `${url}${endpoint}${buildQuery(options?.params)}`;

        const response = await fetch(fullUrl, {
          method: options?.method || "GET",
          headers: customHeaders,
          body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        if (response.status === 401) {
          localStorage.removeItem("token_avanzar");
          localStorage.removeItem("user_avanzar");
          window.location.href = "/";
          const err: ApiError = new Error(
            "Tu sesión ha expirado por seguridad. Ingresa nuevamente.",
          );
          err.status = 401;
          throw err;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const err: ApiError = new Error(
            errorData?.message || `Error en la petición: ${response.status}`,
          );
          err.status = response.status;
          err.errors = errorData?.errors;
          err.payload = errorData;
          throw err;
        }

        if (options?.responseType === "blob") {
          const blob = await response.blob();
          setData(blob as unknown as T);
          return blob;
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err: any) {
        const message =
          err.message || "Ocurrió un error inesperado al conectar con el servidor.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { data, isLoading, error, execute };
};
