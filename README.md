# 🚀 Plantilla React + Vite + TypeScript

Esta es una plantilla base para proyectos **frontend profesionales** usando:

- ⚛️ React
- ⚡ Vite
- 🟦 TypeScript
- 📁 Arquitectura escalable por capas y features
- 🔗 Alias `@` para imports limpios

Pensada para proyectos **medianos y grandes**, trabajo en equipo y crecimiento a largo plazo.

---

## 📂 Estructura del proyecto

```txt
src/
├── app/
├── assets/
├── components/
├── constants/
├── features/
├── hooks/
├── services/
├── store/
├── types/
├── utils/
└── main.tsx
```

---

## 🧠 Descripción de carpetas

### 📁 `app/`

Contiene el **arranque de la aplicación** y configuraciones globales.

- `App.tsx`: contenedor principal de la app
- `router.tsx`: definición de rutas (React Router)

📌 **No debe contener lógica de negocio**

**Ejemplo:**

```tsx
// src/app/App.tsx
function App() {
  return <h1>Mi aplicación</h1>;
}

export default App;
```

---

### 📁 `assets/`

Recursos estáticos del proyecto.

```txt
assets/
├── icons/
├── images/
└── styles/
    └── global.css
```

- `styles/global.css`: estilos globales (reset, variables, tipografía)

**Ejemplo:**

```css
/* src/assets/styles/global.css */
:root {
  --primary-color: #2563eb;
}

body {
  font-family: system-ui, sans-serif;
}
```

---

### 📁 `components/`

Componentes **reutilizables y genéricos** de UI.

```txt
components/
├── common/
└── layout/
```

- `common/`: botones, inputs, modales
- `layout/`: Navbar, Footer, Sidebar

**Ejemplo:**

```tsx
// components/common/Button.tsx
type ButtonProps = {
  label: string;
};

export function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}
```

---

### 📁 `features/`

Arquitectura **por funcionalidades** (feature-based).

Cada feature es **independiente**.

```txt
features/
└── auth/
    ├── pages/
    ├── components/
    ├── hooks/
    └── services/
```

**Ejemplo:**

```tsx
// features/auth/pages/LoginPage.tsx
export function LoginPage() {
  return <h2>Login</h2>;
}
```

📌 Un feature **no debería importar directamente otro feature**.

---

### 📁 `hooks/`

Hooks **globales y reutilizables**.

**Ejemplo:**

```ts
// hooks/useToggle.ts
import { useState } from "react";

export function useToggle() {
  const [value, setValue] = useState(false);
  return { value, toggle: () => setValue((v) => !v) };
}
```

---

### 📁 `services/`

Servicios globales (API, HTTP, integraciones externas).

**Ejemplo:**

```ts
// services/api.ts
export async function fetchData() {
  const response = await fetch("/api/data");
  return response.json();
}
```

📌 Aquí **NO se usa JSX**.

---

### 📁 `store/`

Estado global (Redux, Zustand, etc.).

**Ejemplo:**

```ts
// store/index.ts
export const store = {};
```

---

### 📁 `types/`

Tipos e interfaces globales de TypeScript.

**Ejemplo:**

```ts
// types/user.ts
export interface User {
  id: number;
  name: string;
}
```

---

### 📁 `constants/`

Constantes, enums y valores fijos.

**Ejemplo:**

```ts
// constants/routes.ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
};
```

---

### 📁 `utils/`

Funciones utilitarias puras.

**Ejemplo:**

```ts
// utils/formatDate.ts
export function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}
```

---

### 📄 `main.tsx`

Punto de entrada de la aplicación.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/app/App";
import "@/assets/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

## 🔗 Alias de imports

Se utiliza `@` para referirse a `src`.

**Ejemplo:**

```ts
import App from "@/app/App";
import { Button } from "@/components/common/Button";
```

---

## 📌 Reglas del proyecto

✔️ `App.tsx` no contiene lógica de negocio  
✔️ Estilos globales en `assets/styles`  
✔️ Componentes reutilizables en `components`  
✔️ Lógica por módulo en `features`  
✔️ Imports limpios usando `@`

---

Plantilla base para proyectos React con typescript profesionales.

@Dani0103
