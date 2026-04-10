import type { Column } from "@/types/tableData";
import React, { useState, useMemo, useEffect } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSearch,
} from "react-icons/hi";

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  pageSize?: number;
  searchPlaceholder?: string; // Prop opcional para el texto del buscador
}

function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  pageSize = 10,
  searchPlaceholder = "Buscar en la tabla...",
}: DataTableProps<T>) {
  // 1. ESTADOS
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 2. LÓGICA DE FILTRADO (Buscador)
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      // Convertimos el objeto a string y buscamos coincidencias (case-insensitive)
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
  }, [data, searchTerm]);

  // 3. RESET DE PÁGINA AL BUSCAR
  // Si el usuario busca algo, lo regresamos a la página 1 para que no vea una tabla vacía
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 4. CÁLCULOS DE PAGINACIÓN (Basados en la data filtrada)
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col gap-4">
      {/* --- BUSCADOR --- */}
      <div className="relative w-full sm:max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HiOutlineSearch className="text-gray-400" size={18} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchPlaceholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-clinic-inner bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-clinic-primary/10 focus:border-clinic-primary transition-all shadow-sm"
        />
      </div>

      {/* --- TABLA --- */}
      <div className="overflow-x-auto border border-gray-100 rounded-clinic-inner bg-white shadow-sm">
        <table className="w-full text-left text-sm text-clinic-text-base border-collapse">
          <thead className="bg-clinic-bg-soft text-xs uppercase text-clinic-text-muted font-bold border-b border-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-4 py-3 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className={`px-4 py-3 ${col.className || ""}`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-clinic-text-muted">
                    <HiOutlineSearch size={32} className="opacity-20" />
                    <p className="italic">
                      No se encontraron resultados para "{searchTerm}"
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2 bg-white border border-gray-100 rounded-clinic-inner shadow-sm">
          <p className="text-xs text-clinic-text-muted">
            Mostrando <span className="font-bold">{paginatedData.length}</span>{" "}
            de <span className="font-bold">{filteredData.length}</span>{" "}
            resultados
          </p>

          <div className="flex gap-2 items-center">
            <span className="text-[10px] uppercase font-bold text-gray-400 mr-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <HiOutlineChevronLeft
                size={20}
                className="text-clinic-text-base"
              />
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <HiOutlineChevronRight
                size={20}
                className="text-clinic-text-base"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
