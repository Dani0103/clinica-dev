import { type ReactNode } from "react";
import { HiOutlineX } from "react-icons/hi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}

const sizeClass = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

const FormModalShell = ({
  isOpen,
  onClose,
  title,
  subtitle,
  isSubmitting,
  submitLabel = "Guardar",
  onSubmit,
  children,
  size = "lg",
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className={`bg-white w-full ${sizeClass[size]} rounded-clinic-card shadow-2xl flex flex-col overflow-hidden max-h-[90vh]`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h3 className="font-bold text-clinic-text-base text-lg">{title}</h3>
            {subtitle && (
              <p className="text-xs text-clinic-text-muted">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {children}
          </div>

          <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-clinic-inner transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 text-sm font-bold text-white rounded-clinic-inner shadow-sm transition-all ${isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-clinic-primary hover:bg-opacity-90"}`}
            >
              {isSubmitting ? "Guardando..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModalShell;
