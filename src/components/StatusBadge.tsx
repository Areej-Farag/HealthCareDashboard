import { StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <div
      className={clsx(
        "status-badge",
        { "bg-red-600": status === "cancelled" },
        { "bg-green-600": status === "scheduled" },
        { "bg-blue-600": status === "pending" },
      )}
    >
      <Image
        src={StatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className="w-3 h-fit"
      />
      <p
        className={clsx("text-12-bold capitalize", {
          "text-green-300": status === "scheduled",
          "text-red-300": status === "cancelled",
          "text-blue-300": status === "pending",
        })}
      >
        {status}
      </p>
    </div>
  );
}
