import type { Status } from "@/types/dashboard";

function StatusItem({ label, status }: { label: string; status: Status }) {
  const color = {
    ok: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  }[status];

  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${color}`}></span>
        <span className="capitalize text-gray-500">{status}</span>
      </span>
    </div>
  );
}

export default StatusItem;
