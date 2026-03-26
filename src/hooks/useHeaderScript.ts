import { useEffect } from "react";

export function useHeaderScript() {
    useEffect(() => {
        const scriptId = "mi-header-script";

        // Evita cargarlo más de una vez
        if (document.getElementById(scriptId)) return;

        const script = document.createElement("script");
        script.id = scriptId;
        script.type = "module";
        script.src = `${import.meta.env.VITE_HEADER_URL}/mi-header.js`;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${import.meta.env.VITE_HEADER_URL}/mi-header.css`;

        document.head.appendChild(script);
        document.head.appendChild(link);
    }, []);
}
