import { useState } from "react";

function HomePage() {
  const [count, setCount] = useState<number>(0);

  return (
    <section className="min-h-full flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-4xl w-full text-center">
        {/* Badge */}
        <span className="inline-block mb-4 rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-600">
          React + Vite + TypeScript
        </span>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Plantilla Base Frontend
        </h1>

        {/* Subtítulo */}
        <p className="text-lg text-gray-600 mb-6">
          Estructura inicial optimizada para el desarrollo de aplicaciones
          frontend modernas usando <strong>React</strong>,{" "}
          <strong>TypeScript</strong> y <strong>Vite</strong>.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          <div className="rounded-lg border bg-white p-4">
            <h3 className="font-semibold text-gray-800 mb-1">
              Arquitectura escalable
            </h3>
            <p className="text-sm text-gray-600">
              Separación por layouts, vistas y features.
            </p>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <h3 className="font-semibold text-gray-800 mb-1">
              TypeScript First
            </h3>
            <p className="text-sm text-gray-600">
              Tipado estricto, alias <code>@</code> y buenas prácticas.
            </p>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <h3 className="font-semibold text-gray-800 mb-1">
              Lista para producción
            </h3>
            <p className="text-sm text-gray-600">
              Routing, layouts, Tailwind v3 y configuración base.
            </p>
          </div>
        </div>

        {/* Contador */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl font-semibold text-gray-800">
            Contador: <span className="text-gray-600">{count}</span>
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setCount((prev) => prev - 1)}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={count == 0}
            >
              −
            </button>

            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="px-6 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={count == 10}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
