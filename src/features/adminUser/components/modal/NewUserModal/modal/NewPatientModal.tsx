import { useState } from "react";
import {
  HiUserGroup,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { AppUrls, API_ENDPOINTS } from "@/services/apiEndpoints";
import { toast } from "react-toastify";

const NewPatientModal = () => {
  const navigate = useNavigate();
  const { execute, isLoading } = useApi();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [hasTutor, setHasTutor] = useState(false);

  const [formData, setFormData] = useState({
    tipo_documento: "",
    cedula: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    sexo: "",
    direccion: "",
    barrio: "",
    telefono: "",
    correo: "",
    ocupacion: "",
    eps: "",
    regimen_salud: "",
    categoria_eps: "",
    nombre_responsable: "",
    telefono_responsable: "",
    parentesco_responsable: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      // Basic validation for step 1
      if (!formData.tipo_documento || !formData.cedula || !formData.nombres || !formData.apellidos || !formData.eps) {
        toast.error("Por favor completa los campos obligatorios.");
        return;
      }

      await execute(AppUrls.avanzarApi, API_ENDPOINTS.PACIENTES.CREATE, {
        method: "POST",
        body: formData,
      });

      toast.success("Paciente registrado exitosamente");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "Error al registrar el paciente.");
    }
  };

  return (
    <>
      <div className="bg-white w-full h-full flex flex-col justify-between overflow-hidden">
        {/* ENCABEZADO */}
        <div>
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
              <HiUserGroup className="text-clinic-primary" /> Ingreso de
              Paciente
            </h3>
          </div>

          <div className="p-5 overflow-y-auto custom-scrollbar">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      placeholder="Nombres"
                      required
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    />
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      placeholder="Apellidos"
                      required
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    />
                  </div>

                  <select
                    name="tipo_documento"
                    value={formData.tipo_documento}
                    onChange={handleChange}
                    required
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
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    placeholder="Número de Documento"
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  />

                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    required
                    title="Fecha de Nacimiento"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none text-gray-500"
                  />

                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    required
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
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Dirección de Domicilio"
                    required
                    className="col-span-2 w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  />
                  <input
                    type="text"
                    name="barrio"
                    value={formData.barrio}
                    onChange={handleChange}
                    placeholder="Barrio / Localidad"
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono(s)"
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  />
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="Correo electrónico"
                    className="col-span-2 w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
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
                        onChange={() => {
                          setHasTutor(!hasTutor);
                          if (hasTutor) {
                            setFormData((prev) => ({
                              ...prev,
                              nombre_responsable: "",
                              telefono_responsable: "",
                              parentesco_responsable: "",
                            }));
                          }
                        }}
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
                          name="nombre_responsable"
                          value={formData.nombre_responsable}
                          onChange={handleChange}
                          placeholder="Nombre completo del responsable"
                          className="col-span-2 w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                        />
                        <input
                          type="text"
                          name="parentesco_responsable"
                          value={formData.parentesco_responsable}
                          onChange={handleChange}
                          placeholder="Parentesco"
                          className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                        />
                        <input
                          type="tel"
                          name="telefono_responsable"
                          value={formData.telefono_responsable}
                          onChange={handleChange}
                          placeholder="Teléfono"
                          className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
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
                    name="eps"
                    value={formData.eps}
                    onChange={handleChange}
                    placeholder="EPS del Paciente"
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  />
                  <select
                    name="categoria_eps"
                    value={formData.categoria_eps}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white"
                  >
                    <option value="" disabled>
                      Categoría EPS
                    </option>
                    <option value="cotizante">Cotizante</option>
                    <option value="beneficiario">Beneficiario</option>
                  </select>

                  <select
                    name="regimen_salud"
                    value={formData.regimen_salud}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white"
                  >
                    <option value="" disabled>
                      Régimen de Salud
                    </option>
                    <option value="Contributivo">Contributivo</option>
                    <option value="Subsidiado">Subsidiado</option>
                    <option value="Especial">Especial</option>
                  </select>

                  <input
                    type="text"
                    name="ocupacion"
                    value={formData.ocupacion}
                    onChange={handleChange}
                    placeholder="Ocupación del paciente"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  />
                </div>
              )}

              {/* --- PASO 4: DOCUMENTOS --- */}
              {step === 4 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <p className="text-xs text-gray-500 mb-2">
                    Cargue los soportes correspondientes al ingreso (Formatos
                    PDF, JPG, PNG). *Esta función estará disponible en la próxima fase.
                  </p>

                  <div className="grid grid-cols-1 gap-3 opacity-50 pointer-events-none">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">
                        Copia Documento de Identidad
                      </span>
                      <input
                        type="file"
                        className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-clinic-primary file:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN FLOTANTES */}
        <div className="p-5 border-t border-gray-100 flex justify-between bg-gray-50/50">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-clinic-primary border-2 border-clinic-primary rounded-md font-semibold px-5 py-2 hover:bg-clinic-primary/40"
          >
            <HiOutlineArrowLeft /> Volver
          </button>
          <div className="flex gap-2">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="h-full flex items-center gap-1 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 border-2 rounded-md transition-colors"
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
                  onClick={handleRegister}
                  disabled={isLoading}
                  className={`px-5 py-2 text-sm font-bold text-white rounded-md transition-colors shadow-sm ${
                    isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isLoading ? "Registrando..." : "Registrar Paciente"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPatientModal;
