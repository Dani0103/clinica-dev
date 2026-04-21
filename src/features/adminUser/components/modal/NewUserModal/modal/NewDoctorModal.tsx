import type { OptionItem } from "@/types/AdminUser/UsersManagement";
import { HiOutlinePlus, HiX, HiUser } from "react-icons/hi";

interface Props {
  rol: OptionItem[];
  especialidad: OptionItem[];
}

const NewDoctorModal = ({ rol, especialidad }: Props) => {
  return (
    <div className="relative flex items-center justify-center animate-fade-in">
      <div className="bg-white w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
            <HiUser className="text-clinic-primary" /> Registrar Médico
          </h3>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <h4 className="col-span-2 text-xs font-black text-gray-400 uppercase">
                Datos del Profesional
              </h4>
              <div className="col-span-2">
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Nombre completo del doctor/a"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Número de identificación (C.C)"
                />
              </div>

              <div>
                <select
                  defaultValue=""
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white cursor-pointer"
                >
                  <option value="" disabled>
                    Rol...
                  </option>
                  {rol.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="tel"
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Teléfono"
                />
              </div>

              <div>
                <select
                  defaultValue=""
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white cursor-pointer"
                >
                  <option value="" disabled>
                    Especialidad...
                  </option>
                  {especialidad.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
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
          </form>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            className="px-5 py-2 text-sm font-bold text-white bg-clinic-primary hover:bg-opacity-90 rounded-md transition-colors shadow-sm"
          >
            Guardar Médico
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDoctorModal;
