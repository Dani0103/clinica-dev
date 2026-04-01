/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        clinic: {
          /* Estructura y Fondos */
          "bg-soft": "#E6F0FF", // Azul pálido de fondo general de la app
          "bg-card": "#FFFFFF", // Blanco para las tarjetas (Cards) de información
          primary: "#3E36B0", // Azul/Morado de la Sidebar y parte oscura del degradado
          "primary-light": "#93C5FD", // Azul claro para la parte brillante del degradado

          /* Tipografía e Iconos */
          "text-base": "#111827", // Negro/Gris oscuro para nombres y títulos principales
          "text-muted": "#6B7280", // Gris para subtítulos (ej: "Hombre - 32 años")
          "icon-inactive": "#A1A1AA", // Gris para los iconos no seleccionados de la sidebar
          accent: "#3E36B0", // Color de énfasis para elementos activos

          /* Especialidades Médicas (Badges/Etiquetas) */
          "badge-fisio": "#C1EBD6", // Verde pastel para "Fisioterapia"
          "badge-fono": "#FFC4D0", // Rosa pastel para "Fonoaudiología"
          "badge-audio": "#FFE9C4", // Crema/Naranja para "Audiología"
          "badge-psico": "#FFD1E6", // Lila/Rosa para "Psicología"

          /* Indicadores de Pacientes (Mini tarjetas) */
          "badge-new": "#E3FAF3", // Fondo verde menta suave (Nuevos pacientes)
          "badge-new-icon": "#34D399", // Flecha y porcentaje verde (Crecimiento)
          "badge-old": "#FFE4E6", // Fondo rojizo suave (Pacientes antiguos)
          "badge-old-icon": "#F87171", // Flecha y porcentaje rojo (Descenso)
        },
      },
      borderRadius: {
        "clinic-card": "1.5rem", // Bordes muy redondeados para las tarjetas principales
        "clinic-inner": "0.75rem", // Bordes para elementos internos como inputs o mini-cards
      },
      boxShadow: {
        "clinic-subtle": "0 4px 12px rgba(0, 0, 0, 0.03)", // Sombra suave para elevación de tarjetas
      },
    },
  },
  plugins: [],
};
