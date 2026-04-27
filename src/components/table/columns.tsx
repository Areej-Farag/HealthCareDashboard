"use client";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointmentModal from "../AppointmentModal";
import { Appointment } from "@/types/appwrite.types";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return <p className="text-right font-medium">{row.index + 1}</p>;
    },
  },

  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.getValue("patient")}</p>;
    },
  },

  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />;
    },
  },
  {
    accessorKey: "schedule",

    header: () => <div className="text-right">Appointment</div>,
    cell: ({ row }) => {
      return (
        <p className="text-14-regular">
          {formatDateTime(row.original.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: () => <div className="text-right">Primary Physician</div>,
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doctor) => doctor.name === row.getValue("primaryPhysician"),
      );
      if (doctor) {
        return (
          <div className="flex items-center gap-3">
            <Image
              src={doctor.image}
              alt={doctor.name}
              width={100}
              height={100}
              className="size-8 rounded-full"
            />
            <p className="whitespace-nowrap">{doctor?.name}</p>
          </div>
        );
      } else {
        return (
          <p className="text-right font-medium">
            {row.getValue("primaryPhysician") || "No Doctor Selected"}
          </p>
        );
      }
    },
  },

  {
    accessorKey: "reason",
    header: () => <div className="text-right">Reason</div>,
    cell: ({ row }) => {
      return <p className="text-right font-medium">{row.getValue("reason")}</p>;
    },
  },
  {
    accessorKey: "note",
    header: () => <div className="text-right">Note</div>,
    cell: ({ row }) => {
      return <p className="text-right font-medium">{row.getValue("note")}</p>;
    },
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,

    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patient={data.patient}
            userId={data.userId}
            appointment={data}
          />
          <AppointmentModal
            type="cancel"
            patient={data.patient}
            userId={data.userId}
            appointment={data}
          />
        </div>
      );
    },
  },
];
