import { useState } from "react";
import { HiOutlineArrowLeft, HiUser } from "react-icons/hi";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import type { AdminContextType } from "@/types/AdminUser/UsersManagement";
import { useUserService } from "@/services";

interface DoctorOutletContext extends AdminContextType {
  onUserCreated?: () => void;
}

const initialState = {
  nombre: "",
  apellidos: "",
  cedula: "",
  telefono: "",
  rol_id: "" as number | "",
  especialidad_id: "" as number | "",
  correo: "",
  password: "",
};

const NewDoctorModal = () => {
  const navigate = useNavigate();
  const ctx = useOutletContext<DoctorOutletContext>();
  const rol = ctx?.rol ?? [];
  const especialidad = ctx?.especialidad ?? [];

  const { create, isLoading } = useUserService();
  const [form, setForm] = useState(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "rol_id" || name === "especialidad_id"
          ? value
            ? Number(value)
            : ""
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.apellidos ||
      !form.cedula ||
      !form.correo ||
      !form.password ||
      !form.rol_id
    ) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      await create({
        nombre: form.nombre,
        apellidos: form.apellidos,
        cedula: form.cedula,
        telefono: form.telefono || undefined,
        correo: form.correo,
        password: form.password,
        rol_id: Number(form.rol_id),
        especialidad_id: form.especialidad_id ? Number(form.especialidad_id) : undefined,
      });
      toast.success("Médico registrado exitosamente");
      ctx?.onUserCreated?.();
      navigate(-1);
    } catch (err: any) {
      if (err.errors) {
        Object.values(err.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg)),
        );
      } else {
        toast.error(err.message || "Error al registrar el médico.");
      }
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between overflow-hidden ">
      <div>
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-clinic-text-base text-lg flex items-center gap-2">
            <HiUser className="text-clinic-primary" /> Registrar Médico
          </h3>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 gap-4">
              <h4 className="col-span-4 text-xs font-black text-gray-400 uppercase">
                Datos del Profesional
              </h4>

              <div className="col-span-2">
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Nombres"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Apellidos"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="text"
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Número de identificación (C.C)"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Teléfono"
                />
              </div>

              <div className="col-span-2">
                <select
                  name="rol_id"
                  value={form.rol_id}
                  onChange={handleChange}
                  required
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
                  name="especialidad_id"
                  value={form.especialidad_id}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none bg-white cursor-pointer"
                >
                  <option value="">Sin especialidad</option>
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
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Correo electrónico profesional"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full border border-gray-200 rounded-md p-2 text-sm focus:border-clinic-primary outline-none"
                  placeholder="Contraseña de acceso (mín. 8)"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="p-5 border-t border-gray-100 flex justify-between gap-3 bg-gray-50/50">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-clinic-primary border-2 border-clinic-primary rounded-md font-semibold px-5 py-2 hover:bg-clinic-primary/10"
        >
          <HiOutlineArrowLeft /> Volver
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-5 py-2 text-sm font-bold text-white rounded-md transition-colors shadow-sm ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-clinic-primary hover:bg-opacity-90"}`}
        >
          {isLoading ? "Guardando..." : "Guardar Médico"}
        </button>
      </div>
    </div>
  );
};

export default NewDoctorModal;
