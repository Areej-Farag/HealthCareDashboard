"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FieldGroup } from "@/components/ui/field";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { userSchema } from "@/lib/validation";
import { useState } from "react";
import { createUser } from "@/lib/actions/patient.actions";
import { Button } from "../ui/button";
export enum InputFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE = "phoneInput",
  DATE = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  EMAIL = "email",
  PASSWORD = "password",
}

export default function PatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({
    username,
    email,
    phone,
  }: z.infer<typeof userSchema>) {
    setIsLoading(true);
    console.log("Submitting form with data:", { username, email, phone });
    try {
      const userData = {
        name: username,
        email,
        phone,
      };
      const user = await createUser(userData);
      console.log("user", user);
      if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
    console.log(username, email, phone);
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1"
        id="form-rhf-demo"
      >
        <section className="space-y-4 mb-12">
          <h1 className="header">Welcome Back</h1>
          <p className="text-dark-700">
            Schedule your next appointment with us.
          </p>
        </section>

        <FieldGroup>
          <CustomFormField
            inputType={InputFieldType.INPUT}
            inputIcon="/assets/icons/user.svg"
            iconAlt="Username Icon"
            control={form.control}
            label="Username"
            placeholder="ex: johndoe"
            id="form-rhf-demo-username"
            name="username"
          />
          <CustomFormField
            inputType={InputFieldType.EMAIL}
            inputIcon="/assets/icons/email.svg"
            iconAlt="Email Icon"
            control={form.control}
            label="Email"
            placeholder="ex: johndoe@example.com"
            id="form-rhf-demo-email"
            name="email"
          />
          <CustomFormField
            inputType={InputFieldType.PHONE}
            inputIcon="/assets/icons/phone.svg"
            iconAlt="phone Icon"
            control={form.control}
            label="phone"
            placeholder="Your phone"
            id="form-rhf-demo-phone"
            name="phone"
            type="phone"
          />
          {/* <CustomFormField
            inputType={InputFieldType.PASSWORD}
            inputIcon="/assets/icons/"
            iconAlt="Password Icon"
            control={form.control}
            label="Password"
            placeholder="Your password"
            id="form-rhf-demo-password"
            name="password"
            type="password"
          /> */}
        </FieldGroup>
        <div className="flex justify-end space-x-2 mt-4">
          <SubmitButton formId="form-rhf-demo" isLoading={isLoading}>
            Submit
          </SubmitButton>
        </div>
        <Button
          type="reset"
          onClick={() => form.reset({ username: "", email: "", phone: "" })}
        >
          reset
        </Button>
      </form>
    </>
  );
}
