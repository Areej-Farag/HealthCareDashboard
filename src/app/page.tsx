import Image from "next/image";
import PatientForm from "../components/forms/PatientForm";
import Link from "next/link";
import PasskeyModal from "@/components/PasskeyModal";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ admin: string }>;
}) {
  const isAdmin = (await searchParams).admin === "true";
  return (
    <main className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
      {/* Left side - Form */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-496px">
          <Image
            src="/assets/icons/logo-full.svg" // ← Correct path
            alt="CarePulse Logo"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
            priority
          />
          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="text-dark-600">© CarePulse</p>
            <Link
              href="/?admin=true"
              className="text-green-500 hover:underline"
            >
              Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Right side - Onboarding Image - Fixed path */}
      <Image
        src="/assets/images/onboarding-img.png" // ← Correct path
        alt="Onboarding"
        width={1000}
        height={1000}
        className="side-img hidden max-w-[50%] object-contain md:block"
        priority
      />
    </main>
  );
}
