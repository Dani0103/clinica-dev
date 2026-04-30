import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";

const triggerDownload = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const usePdfService = () => {
  const api = useApi<Blob>();

  const exportarHistoria = async (
    pacienteId: number | string,
    fileName = `historia_clinica_${pacienteId}.pdf`,
  ) => {
    const blob = (await api.execute(
      AppUrls.avanzarApi,
      API_ENDPOINTS.PACIENTES.EXPORTAR_HISTORIA(pacienteId),
      { responseType: "blob" },
    )) as Blob;

    triggerDownload(blob, fileName);
    return blob;
  };

  const exportarHistoriasMasivo = async (pacientesIds: (number | string)[]) => {
    const resultados = await Promise.allSettled(
      pacientesIds.map((id) => exportarHistoria(id)),
    );
    return resultados;
  };

  return { ...api, exportarHistoria, exportarHistoriasMasivo };
};
