import { useState } from "react";
import { HiOutlinePlus, HiX, HiUserGroup, HiUser } from "react-icons/hi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewUserModal = ({ isOpen, onClose }: Props) => {
  const [userType, setUserType] = useState<"MEDICO" | "PACIENTE">("MEDICO");
  const [hasTutor, setHasTutor] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-clinic-card shadow-xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
            <HiOutlinePlus className="text-clinic-primary" /> Nuevo Registro
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiX size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* SELECTOR DE TIPO DE USUARIO */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setUserType("MEDICO")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                userType === "MEDICO"
                  ? "bg-white text-clinic-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <HiUser /> Médico
            </button>
            <button
              onClick={() => setUserType("PACIENTE")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                userType === "PACIENTE"
                  ? "bg-white text-clinic-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <HiUserGroup /> Paciente
            </button>
          </div>

          <form className="space-y-4">
            {/* --- SECCIÓN MÉDICO --- */}
            {userType === "MEDICO" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <h4 className="col-span-2 text-xs font-black text-gray-400 uppercase">
                    Datos del Profesional
                  </h4>
                  <div className="col-span-2">
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      placeholder="Nombre del doctor/a"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      placeholder="Número de identificación (C.C)"
                    />
                  </div>

                  {/* SELECTOR DE ESPECIALIDAD */}
                  <div>
                    <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white cursor-pointer">
                      <option value="" disabled selected>
                        Rol...
                      </option>
                      <option value="especialista">Médico Especialista</option>
                      <option value="general">Médico General</option>
                      <option value="auditor">Médico Auditor</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="tel"
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      placeholder="Teléfono"
                    />
                  </div>

                  {/* SELECTOR DE ROL */}
                  <div>
                    <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white cursor-pointer">
                      <option value="" disabled selected>
                        Especialidad...
                      </option>
                      <option value="general">Medicina General</option>
                      <option value="cardiologia">Cardiología</option>
                      <option value="pediatria">Pediatría</option>
                      <option value="ginecologia">Ginecología</option>
                      <option value="odontologia">Odontología</option>
                    </select>
                  </div>

                  <input
                    type="email"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Correo electrónico profesional"
                  />
                  <input
                    type="password"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Contraseña de acceso"
                  />
                </div>
              </div>
            )}

            {/* --- SECCIÓN PACIENTE (Se mantiene igual) --- */}
            {userType === "PACIENTE" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-sm font-bold text-blue-800">
                    ¿El paciente requiere tutor? (Menor de edad)
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

                {hasTutor && (
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-md space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase">
                      Datos del Tutor Responsable
                    </h4>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      placeholder="Nombre completo del tutor"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                        placeholder="Correo tutor"
                      />
                      <input
                        type="tel"
                        className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                        placeholder="Teléfono tutor"
                      />
                    </div>
                    <input
                      type="password"
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      placeholder="Contraseña para el tutor"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase">
                    Datos del Paciente
                  </h4>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Nombre completo del paciente"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      placeholder="Cédula / Registro Civil"
                    />
                    <input
                      type="tel"
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      placeholder="Teléfono"
                    />
                  </div>
                  <input
                    type="email"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Correo electrónico"
                  />
                  {!hasTutor && (
                    <input
                      type="password"
                      className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                      placeholder="Contraseña para el paciente"
                    />
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button className="px-4 py-2 text-sm font-bold text-white bg-clinic-primary hover:bg-opacity-90 rounded-md transition-colors shadow-sm">
            Registrar {userType === "MEDICO" ? "Médico" : "Paciente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewUserModal;
