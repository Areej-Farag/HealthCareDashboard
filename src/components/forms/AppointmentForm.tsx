"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FieldGroup } from "@/components/ui/field";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { getAppointmentSchema } from "@/lib/validation";
import { useState } from "react";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointments.actions";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import { Doctors } from "@/constants";
import { Appointment } from "@/types/appwrite.types";
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

export default function AppointmentForm({
  userId,
  type,
  patientId,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  appointment?: Appointment;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  type: "create" | "cancel" | "schedule";
}) {
  const router = useRouter();
  const FormValidation = getAppointmentSchema(type);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormValidation>>({
    resolver: zodResolver(FormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormValidation>) {
    console.log("values", values);
    setIsLoading(true);
    try {
      if (type === "create" && patientId) {
        const newAppointmet = await createAppointment({
          userId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: "pending",
          patient: patientId,
        });
        if (newAppointmet) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointmet.$id}`,
          );
        }
      } else {
        const data = {
          userId,
          appointmentId: appointment?.$id, // ⚠️ Also: this shadows the outer `appointment`!
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values.schedule),
            reason: values?.reason,
            note: values?.note,
            status: type === "cancel" ? "cancelled" : "scheduled",
            patient: patientId,
            cancellationReason: values?.cancellationReason || "",
          },
          type,
        };

        const updatedAppointment = await updateAppointment(data); // ✅ Fixed

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  const { errors } = form.formState;
  {
    errors && console.log("errors", errors);
  }
  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1"
        id="form-rhf-demo"
      >
        {type === "create" && (
          <section className="space-y-4 mb-12">
            <h1 className="header">Welcome Back</h1>
            <p className="text-dark-700">
              Schedule your next appointment with us.
            </p>
          </section>
        )}
        {type === "create" || type === "schedule" ? (
          <FieldGroup>
            <CustomFormField
              inputType={InputFieldType.SELECT}
              control={form.control}
              label="Doctor"
              placeholder="select a Doctor"
              id="form-rhf-demo-primary-physician"
              name="primaryPhysician"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                inputType={InputFieldType.TEXTAREA}
                control={form.control}
                label="reason"
                placeholder="ex: Annual checkup"
                id="form-rhf-demo-reason"
                name="reason"
              />
              <CustomFormField
                inputType={InputFieldType.TEXTAREA}
                control={form.control}
                label="Additional Comments/Notes"
                placeholder="ex: prefer afternoon appointment"
                id="form-rhf-demo-notes"
                name="note"
                type="notes"
              />
            </div>

            <CustomFormField
              inputType={InputFieldType.DATE}
              control={form.control}
              inputIcon="/assets/icons/calendar.svg"
              iconAlt="calander"
              label="Expected Appointment Date"
              placeholder="Select your appointment date"
              id="form-rhf-demo-schedule"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
              name="schedule"
            />
          </FieldGroup>
        ) : (
          <FieldGroup>
            <CustomFormField
              inputType={InputFieldType.TEXTAREA}
              control={form.control}
              label="Reason for Cancellation"
              placeholder="Enter reason for cancellation"
              id="form-rhf-demo-cancel-reason"
              name="cancellationReason" // ✅ Fixed: was "cancelationReason"
            />
          </FieldGroup>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <SubmitButton
            formId="form-rhf-demo"
            isLoading={isLoading}
            className={
              type !== "cancel"
                ? "shad-primary-btn w-full my-4"
                : "shad-danger-btn w-full my-4"
            }
          >
            {type === "create" || type === "schedule"
              ? "Submit and Continue"
              : "Submit and Cancel"}
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
