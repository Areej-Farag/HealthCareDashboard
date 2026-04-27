import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";

export const metadata = {
  title: "Care Pulse Register",
  description: "A healthcare dashboard management system.",
};
const RegisterPage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const userId = (await params).userId;
  const user = await getUser(userId);
  return (
    <main className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg" // ← Correct path
            alt="CarePulse Logo"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
            priority
          />

          <RegisterForm user={user} />
          <p className="text-dark-600">© CarePulse</p>
        </div>
      </section>

      {/* Right side - Onboarding Image - Fixed path */}
      <Image
        src="/assets/images/register-img.png" // ← Correct path
        alt="Register Image"
        width={1000}
        height={1000}
        className="side-img hidden max-w-97.5 object-contain md:block"
        priority
      />
    </main>
  );
};

export default RegisterPage;
