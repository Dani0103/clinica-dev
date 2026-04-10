export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode); // Puede ser una llave del objeto o una función (para botones/badges)
    className?: string;
}