interface PageLoaderProps {
  text?: string;
  /**
   * fullscreen — ocupa toda la pantalla (ProtectedRoute / splash inicial)
   * page      — bloque con card blanca, py-20, spinner lg (carga de página completa)
   * section   — bloque con card blanca, h-40, spinner md (sección dentro de una vista)
   * inline    — sin contenedor extra, solo spinner + texto (dentro de paneles/aside)
   */
  variant?: "fullscreen" | "page" | "section" | "inline";
}

const spinnerSize: Record<NonNullable<PageLoaderProps["variant"]>, string> = {
  fullscreen: "h-10 w-10",
  page:       "h-10 w-10",
  section:    "h-8 w-8",
  inline:     "h-7 w-7",
};

export default function PageLoader({ text, variant = "section" }: PageLoaderProps) {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-4 border-gray-100 border-t-clinic-primary ${spinnerSize[variant]}`}
    />
  );

  if (variant === "fullscreen") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {spinner}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className="py-20 flex flex-col items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        {spinner}
        {text && <p className="text-gray-500 font-medium text-sm">{text}</p>}
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className="flex justify-center items-center h-40 bg-white rounded-clinic-card border border-gray-100 shadow-sm">
        {spinner}
      </div>
    );
  }

  // inline
  return (
    <div className="py-12 flex flex-col items-center gap-3 text-clinic-text-muted">
      {spinner}
      {text && <p className="text-sm">{text}</p>}
    </div>
  );
}
