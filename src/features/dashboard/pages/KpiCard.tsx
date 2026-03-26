import type { KpiCardProps } from "@/types/dashboard";

function KpiCard({ title, value, highlight }: KpiCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 bg-white ${
        highlight ? "border-red-400" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default KpiCard;
