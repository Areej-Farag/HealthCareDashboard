import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";
export default async function NewAppointmentPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;
  const patient = await getPatient(userId);

  Sentry.metrics.count("patinet_view_new_appointment", patient.name);
  return (
    <main className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-210 flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg" // ← Correct path
            alt="CarePulse Logo"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
            priority
          />
          <AppointmentForm
            userId={userId}
            type="create"
            patientId={patient.$id}
          />

          <p className="text-dark-600">© CarePulse</p>
        </div>
      </section>

      {/* Right side - Onboarding Image - Fixed path */}
      <Image
        src="/assets/images/appointment-img.png"
        alt="appointment Image"
        width={1000}
        height={1000}
        className="side-img max-w-97.5 bg-bottom"
        priority
      />
    </main>
  );
}
