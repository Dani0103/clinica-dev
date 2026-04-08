import { useState, useCallback } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: any;
}

export const useApi = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Ahora recibe un 'endpoint' (la ruta relativa) en lugar de la url completa
  const execute = useCallback(async (url: string, endpoint: string, options?: RequestOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const customHeaders: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // "Authorization": `Bearer ${localStorage.getItem('token')}`,
        ...options?.headers,
      };

      // 3. AQUÍ ESTÁ LA MAGIA: Unimos la base de Laravel con el endpoint
      // Ejemplo: "http://localhost:8000/api" + "/login"
      const fullUrl = `${url}${endpoint}`;

      const response = await fetch(fullUrl, {
        method: options?.method || "GET",
        headers: customHeaders,
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;

    } catch (err: any) {
      const errorMessage = err.message || "Ocurrió un error inesperado al conectar con el servidor.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, execute };
};