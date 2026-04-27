"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FieldGroup } from "@/components/ui/field";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { PatientFormValidation } from "@/lib/validation";
import { useState } from "react";
import { registerPatient } from "@/lib/actions/patient.actions";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InputFieldType } from "../forms/PatientForm";
import {
  genderArray,
  Doctors,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants/index";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

export default function RegisterForm({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  // Your form component
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    try {
      const patientData = {
        ...values,
        birthDate: new Date(values.birthDate),
        userId: user.$id,
      };

      const patient = await registerPatient(patientData);

      console.log("patient", patient);
      if (patient) {
        router.push(`/patients/${patient.$id}/new-appointment`);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
        id="form-rhf-demo"
      >
        <section className="space-y-4 ">
          <h1 className="header">Welcome </h1>
          <p className="text-dark-700">let us know more about you.</p>
        </section>
        {/* Personal Information */}
        <FieldGroup className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
          <CustomFormField
            inputType={InputFieldType.INPUT}
            inputIcon="/assets/icons/user.svg"
            iconAlt="Username Icon"
            control={form.control}
            placeholder="ex: johndoe"
            id="form-rhf-demo-username"
            name="name"
          />
          <div className="flex flex-col gap-6 xl:flex-row">
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
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              inputType={InputFieldType.DATE}
              inputIcon="/assets/icons/calendar.svg"
              iconAlt="Date of birth"
              control={form.control}
              label="date of birth"
              placeholder="ex: 2020-01-01"
              id="form-rhf-demo-birthdate"
              name="birthdate"
            />
            <CustomFormField
              inputType={InputFieldType.SKELETON}
              inputIcon="/assets/icons/phone.svg"
              iconAlt="gender"
              control={form.control}
              label="gender"
              placeholder="Your gender"
              id="form-rhf-demo-gender"
              name="gender"
              renderSkeleton={(field) => (
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  {genderArray.map((gender) => (
                    <div key={gender.value} className="radio-group">
                      <RadioGroupItem value={gender.value} id={gender.value} />
                      <Label className="cursor-pointer" htmlFor={gender.value}>
                        {gender.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              inputType={InputFieldType.INPUT}
              control={form.control}
              label="Address"
              placeholder="ex: 14th street, Cairo, Egypt"
              id="form-rhf-demo-address"
              name="address"
            />
            <CustomFormField
              inputType={InputFieldType.INPUT}
              control={form.control}
              label="Occupation"
              placeholder="ex: 14th street, Cairo, Egypt"
              id="form-rhf-demo-occupation"
              name="occupation"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              inputType={InputFieldType.INPUT}
              control={form.control}
              label="Emergency Contact Name"
              placeholder="Guardian Name"
              id="form-rhf-demo-emergency-contact-name"
              name="emergencyContactName"
            />
            <CustomFormField
              inputType={InputFieldType.PHONE}
              inputIcon="/assets/icons/phone.svg"
              iconAlt="emergencyContactNumber Icon"
              control={form.control}
              label="Emergency Contact Number"
              placeholder="Emergency Contact Number"
              id="form-rhf-demo-emergency-contact-number"
              name="emergencyContactNumber"
              type="phone"
            />
          </div>
        </FieldGroup>

        {/* Medical Information */}

        <FieldGroup className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
          <CustomFormField
            inputType={InputFieldType.SELECT}
            control={form.control}
            placeholder="select a physician"
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
                    className="rounded-full
                    border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              inputType={InputFieldType.INPUT}
              control={form.control}
              label="Insurance Provider"
              placeholder="BlueCross BlueShield"
              id="form-rhf-demo-insurance-provider"
              name="insuranceProvider"
            />
            <CustomFormField
              inputType={InputFieldType.INPUT}
              control={form.control}
              label="Insurance Policy Number"
              placeholder="ABC123456"
              id="form-rhf-demo-insurance-policy-number"
              name="insurancePolicyNumber"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              inputType={InputFieldType.TEXTAREA}
              control={form.control}
              label="Allergies (if any)"
              placeholder=" ex: Penicillin , Aspirin, etc"
              id="form-rhf-demo-allergies"
              name="allergies"
            />
            <CustomFormField
              inputType={InputFieldType.TEXTAREA}
              control={form.control}
              label="current medications (if any)"
              placeholder="Ibuprofen 200mg, Paracetamol 500mg"
              id="form-rhf-demo-current-medications "
              name="currentMedication"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              inputType={InputFieldType.TEXTAREA}
              control={form.control}
              label="Family Medical History (if any)"
              placeholder="mother diabetes, father hypertension, etc"
              id="form-rhf-demo-family-medical-history"
              name="familyMedicalHistory"
            />
            <CustomFormField
              inputType={InputFieldType.TEXTAREA}
              control={form.control}
              label="Past Medical History (if any)"
              placeholder="diabetes, hypertension, etc"
              id="form-rhf-demo-current-past-medical-history"
              name="pastMedicalHistory"
            />
          </div>
        </FieldGroup>

        {/* Identification and Verification */}

        <FieldGroup className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
          <CustomFormField
            inputType={InputFieldType.SELECT}
            control={form.control}
            placeholder="Identification Type"
            id="form-rhf-demo-identification-type"
            name="identificationType"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            inputType={InputFieldType.INPUT}
            control={form.control}
            label="Identification Number"
            placeholder="123456789"
            id="form-rhf-demo-identification-number"
            name="identificationNumber"
          />
          <CustomFormField
            inputType={InputFieldType.SKELETON}
            control={form.control}
            label="Identification Document"
            id="form-rhf-demo-identification-document"
            name="identificationDocument"
            renderSkeleton={(field) => (
              <div>
                <FileUploader files={field.value} onChange={field.onChange} />
              </div>
            )}
          />
        </FieldGroup>

        {/* consent and Privacy */}
        <FieldGroup className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
          <CustomFormField
            inputType={InputFieldType.CHECKBOX}
            control={form.control}
            id="form-rhf-demo-treatment-consent"
            name="treatmentConsent"
            label="I agree to receive treatment from this doctor"
          />
          <CustomFormField
            inputType={InputFieldType.CHECKBOX}
            control={form.control}
            id="form-rhf-demo-disclosure-consent"
            name="disclosureConsent"
            label="I agree to disclose my personal information to this doctor"
          />
          <CustomFormField
            inputType={InputFieldType.CHECKBOX}
            control={form.control}
            id="form-rhf-demo-privacy-consent"
            name="privacyConsent"
            label="I agree to the privacy policy"
          />
        </FieldGroup>

        <div className="flex justify-end space-x-2 my-4">
          <SubmitButton formId="form-rhf-demo" isLoading={isLoading}>
            Submit
          </SubmitButton>
        </div>
        {/* <Button
          type="reset"
          onClick={() => form.reset({ username: "", email: "", phone: "" })}
        >
          reset
        </Button> */}
      </form>
    </>
  );
}
