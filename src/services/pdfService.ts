import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS, AppUrls } from "@/services/apiEndpoints";
import JSZip from "jszip";

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
    fileName?: string,
    shouldDownload = true
  ) => {
    const blob = (await api.execute(
      AppUrls.avanzarApi,
      API_ENDPOINTS.PACIENTES.EXPORTAR_HISTORIA(pacienteId),
      { responseType: "blob" },
    )) as Blob;

    if (shouldDownload) {
      triggerDownload(blob, fileName || `historia_clinica_${pacienteId}.pdf`);
    }
    
    return blob;
  };

  const exportarHistoriasMasivo = async (pacientes: { id: number | string; nombre: string }[]) => {
    const zip = new JSZip();
    
    const promises = pacientes.map(async (p) => {
      try {
        const blob = await exportarHistoria(p.id, "", false);
        zip.file(`${p.nombre.replace(/\s+/g, '_')}_${p.id}.pdf`, blob);
      } catch (error) {
        console.error(`Error al exportar historia de ${p.nombre}:`, error);
      }
    });

    await Promise.all(promises);
    
    const content = await zip.generateAsync({ type: "blob" });
    triggerDownload(content, `historias_clinicas_${new Date().getTime()}.zip`);
    
    return content;
  };

  return { ...api, exportarHistoria, exportarHistoriasMasivo };
};
