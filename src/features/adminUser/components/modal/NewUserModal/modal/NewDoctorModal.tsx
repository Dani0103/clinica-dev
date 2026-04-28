import type { AdminContextType } from "@/types/AdminUser/UsersManagement";
import { HiOutlineArrowLeft, HiUser } from "react-icons/hi";
import { useNavigate, useOutletContext } from "react-router-dom";

const NewDoctorModal = () => {
  const navigate = useNavigate();
  const { rol, especialidad } = useOutletContext<AdminContextType>();

  return (
    <>
      <div className="w-full h-full bg-white flex flex-col justify-between overflow-hidden ">
        {/* ENCABEZADO */}
        <div>
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
              <HiUser className="text-clinic-primary" /> Registrar Médico
            </h3>
          </div>

          <div className="p-5 overflow-y-auto custom-scrollbar">
            <form className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <h4 className="col-span-4 text-xs font-black text-gray-400 uppercase">
                  Datos del Profesional
                </h4>
                <div className="col-span-4">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Nombre completo del doctor/a"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Número de identificación (C.C)"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="tel"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Teléfono"
                  />
                </div>

                <div className="col-span-2">
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

                <div className="col-span-2">
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
                <div className="col-span-2">
                  <input
                    type="email"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Correo electrónico profesional"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="password"
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                    placeholder="Contraseña de acceso"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="p-5 border-t border-gray-100 flex justify-between gap-3 bg-gray-50/50">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-clinic-primary border-2 border-clinic-primary rounded-md font-semibold px-5 py-2 hover:bg-clinic-primary/40"
          >
            <HiOutlineArrowLeft /> Volver
          </button>
          <button
            type="button"
            className="px-5 py-2 text-sm font-bold text-white bg-clinic-primary hover:bg-opacity-90 rounded-md transition-colors shadow-sm"
          >
            Guardar Médico
          </button>
        </div>
      </div>
    </>
  );
};

export default NewDoctorModal;
