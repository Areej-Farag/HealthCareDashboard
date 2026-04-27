import { DataTable } from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { getAppointmentsList } from "@/lib/actions/appointments.actions";
import Image from "next/image";
import Link from "next/link";

export default async function AdminDashboard() {
  const appointments = await getAppointmentsList();

  return (
    <div className="mx-auto flex flex-col max-w:7xl xl:w-7xl space-y-14 ">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg" // ← Correct path
            alt="CarePulse Logo"
            width={162}
            height={32}
            className="h-8 w-fit"
          />
          <p className="text-16-semibold">Admin Dashboard</p>
        </Link>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header"> Welcome to Admin Dashboard</h1>
          <p className="text-14-regular text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>
        <section className="admin-stat flex-col xl:flex-row">
          <StatCard
            type="appointments"
            count={appointments?.scheduledCount}
            label="scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pendind"
            count={appointments?.pendingCount}
            label="pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments?.cancelledCount}
            label="cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        <DataTable data={appointments.appointments} columns={columns} />
      </main>
    </div>
  );
}
