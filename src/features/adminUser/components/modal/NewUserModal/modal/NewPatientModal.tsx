import { useState } from "react";
import {
  HiX,
  HiUserGroup,
  HiChevronRight,
  HiChevronLeft,
} from "react-icons/hi";

const NewPatientModal = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [hasTutor, setHasTutor] = useState(false);

  return (
    <div className="relative flex items-center justify-center animate-fade-in">
      <div className="bg-white w-full max-w-lg flex flex-col overflow-hidden h-auto">
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
            <HiUserGroup className="text-clinic-primary" /> Ingreso de Paciente
          </h3>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar">
          <form className="space-y-4">
            {/* Indicador de Pasos */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-clinic-primary">
                {step === 1 && "1. Información Personal"}
                {step === 2 && "2. Datos del Responsable"}
                {step === 3 && "3. Información Clínica Básica"}
                {step === 4 && "4. Carga de Documentos"}
              </h4>
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Paso {step} de {totalSteps}
              </span>
            </div>

            {/* --- PASO 1: INFO PERSONAL --- */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-300">
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombres"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Apellidos"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  />
                </div>

                <select
                  defaultValue=""
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white"
                >
                  <option value="" disabled>
                    Tipo de Documento
                  </option>
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="TI">Tarjeta de Identidad (TI)</option>
                  <option value="RC">Registro Civil (RC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                </select>
                <input
                  type="text"
                  placeholder="Número de Documento"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                />

                <input
                  type="date"
                  title="Fecha de Nacimiento"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none text-gray-500"
                />

                <select
                  defaultValue=""
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white"
                >
                  <option value="" disabled>
                    Sexo
                  </option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>

                <input
                  type="text"
                  placeholder="Dirección de Domicilio"
                  className="col-span-2 w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                />
                <input
                  type="text"
                  placeholder="Barrio"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                />
                <input
                  type="text"
                  placeholder="Ciudad / Localidad"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                />
                <input
                  type="tel"
                  placeholder="Teléfono(s)"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                />
              </div>
            )}

            {/* --- PASO 2: RESPONSABLE --- */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-sm font-bold text-blue-800">
                    ¿El paciente requiere acompañante / tutor?
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasTutor}
                      onChange={() => setHasTutor(!hasTutor)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-clinic-primary"></div>
                  </label>
                </div>

                {hasTutor ? (
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-md space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nombre completo del responsable"
                        className="col-span-2 w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Documento de Identidad"
                        className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Parentesco"
                        className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Dirección del responsable"
                        className="col-span-2 w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-md">
                    El paciente se registra como autónomo responsable.
                  </div>
                )}
              </div>
            )}

            {/* --- PASO 3: INFO CLÍNICA --- */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-300">
                <input
                  type="text"
                  placeholder="EPS del Paciente"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                />
                <select
                  defaultValue=""
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white"
                >
                  <option value="" disabled>
                    Categoría EPS
                  </option>
                  <option value="cotizante">Cotizante</option>
                  <option value="beneficiario">Beneficiario</option>
                </select>

                <input
                  type="text"
                  placeholder="Ocupación del paciente"
                  className="col-span-2 w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                />

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500">
                    Enfermedad Actual y/o Diagnóstico
                  </label>
                  <textarea
                    rows={2}
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none resize-none"
                    placeholder="Describa el diagnóstico..."
                  ></textarea>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500">
                    Motivo de Consulta
                  </label>
                  <textarea
                    rows={2}
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none resize-none"
                    placeholder="Razón principal por la que acude..."
                  ></textarea>
                </div>
              </div>
            )}

            {/* --- PASO 4: DOCUMENTOS --- */}
            {step === 4 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <p className="text-xs text-gray-500 mb-2">
                  Cargue los soportes correspondientes al ingreso (Formatos PDF,
                  JPG, PNG).
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">
                      Copia Documento de Identidad
                    </span>
                    <input
                      type="file"
                      className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-clinic-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">
                      Historia Clínica Previa
                    </span>
                    <input
                      type="file"
                      className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-clinic-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">
                      Orden Médica / Especialista
                    </span>
                    <input
                      type="file"
                      className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-clinic-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">
                      Orden de Servicio EPS
                    </span>
                    <input
                      type="file"
                      className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-clinic-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* BOTONES DE ACCIÓN FLOTANTES */}
        <div className="p-5 border-t border-gray-100 flex justify-between bg-gray-50/50">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              >
                <HiChevronLeft size={16} /> Atrás
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-5 py-2 text-sm font-bold text-white bg-clinic-primary hover:bg-opacity-90 rounded-md transition-colors shadow-sm"
              >
                Siguiente <HiChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="px-5 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors shadow-sm"
              >
                Registrar Paciente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPatientModal;
