import clsx from "clsx";
import Image from "next/image";

interface StatCardProps {
  type: "appointments" | "pendind" | "cancelled";
  count: number;
  label: string;
  icon: string;
}
export default function StatCard({
  type,
  count = 0,
  label,
  icon,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        "stat-card",
        { "bg-yellow-300/50": type === "pendind" },
        { "bg-red-800/50": type === "cancelled" },
        { "bg-cyan-900/50": type === "appointments" },
      )}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          alt={label}
          width={32}
          height={32}
          className="size-8 w-fit"
        />
        <h2 className="tex-32-bold text-white">{count}</h2>
      </div>
      <p className="text-14-regular">{label}</p>
    </div>
  );
}
