import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

export interface TipoCargaMasiva {
  key: string;
  nombre: string;
  descripcion: string;
  plantilla_url: string;
  import_url: string | null;
  disponible: boolean;
  permiso: string;
  tope_filas: number | null;
}

export const useCargasMasivasService = () => {
  const api = useApi();

  const getCatalogo = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.CARGAS_MASIVAS.LIST);

  const descargarPlantillaPorRuta = (rutaApi: string) => {
    const endpoint = rutaApi.replace(/^\/api\//, "");
    return api.execute(AppUrls.avanzarApi, endpoint, { responseType: "blob" });
  };

  const descargarPlantillaCitas = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.CARGAS_MASIVAS.CITAS_PLANTILLA, {
      responseType: "blob",
    });

  const descargarPlantillaUsuarios = () =>
    api.execute(AppUrls.avanzarApi, API_ENDPOINTS.CARGAS_MASIVAS.USUARIOS_PLANTILLA, {
      responseType: "blob",
    });

  return {
    ...api,
    getCatalogo,
    descargarPlantillaPorRuta,
    descargarPlantillaCitas,
    descargarPlantillaUsuarios,
  };
};
