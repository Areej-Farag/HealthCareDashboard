import Image from "next/image";
import Link from "next/link";
import { getAppointment } from "@/lib/actions/appointments.actions";
import { Suspense } from "react";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import { Button } from "@/components/ui/button";
export default async function page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ appointmentId: string }>;
  params: Promise<{ userId: string }>;
}) {
  const appointmentId = (await searchParams).appointmentId;
  const userId = (await params).userId;
  const appointment: CreateAppointmentParams =
    await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician,
  );
  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg" // ← Correct path
            alt="CarePulse Logo"
            width={1000}
            height={1000}
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            alt="Success"
            width={300}
            height={280} // ← Correct path
          />
          <h2 className="header mb-6 max-w-150 text-center">
            Your <span className="text-green-500">appointment request</span> has
            been Successfully Submitted!
          </h2>
          <p>we &apos; ll be in touch shortly to confirm your appointment.</p>
          <section className="request-details flex flex-col">
            <p>requested appointment Details:</p>
            <Suspense fallback={<p>Loading appointment details...</p>}>
              <div className="flex items-center gap-3">
                <Image
                  src={doctor?.image!}
                  alt={"doctor"}
                  width={100}
                  height={100}
                  className="size-full"
                />
                <p className="whitespace-nowrap">{doctor?.name}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt={"calendar"}
                  width={20}
                  height={20}
                />
                <p className="text-14-regular">
                  {formatDateTime(appointment.schedule).dateTime}
                </p>
              </div>
            </Suspense>
          </section>
          <Button variant="outline" className="shad-primary-btn my-4">
            <Link href={`/patients/${userId}/new-appointment`}>
              New Appointment
            </Link>
          </Button>
          <p className="copyright">© CarePulse</p>
        </section>
      </div>
    </div>
  );
}
