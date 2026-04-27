"use client";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "./ui/input";
import Image from "next/image";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { InputFieldType } from "./forms/PatientForm";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "radix-ui";
type CustomFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>; // بنخليه مرن عشان يقبل أي Schema
  label?: string;
  inputType: InputFieldType; // ← New prop for input type
  inputIcon?: string; // ← New prop for input icon path
  iconAlt?: string; // ← New prop for input icon alt text
  placeholder?: string;
  id: string;
  name: TName;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode; // ← New prop for date format (if needed)
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "id">;

export default function CustomFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  label,
  placeholder,
  inputType,
  inputIcon,
  iconAlt,
  name,
  dateFormat,
  showTimeSelect,
  renderSkeleton,
  children,
  id,
  ...rest
}: CustomFormFieldProps<TFieldValues, TName>) {
  const RenderField = (field: any) => {
    switch (inputType) {
      case InputFieldType.INPUT:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            {inputIcon && (
              <Image
                src={inputIcon}
                alt={iconAlt || "Input Icon"}
                width={20}
                height={20}
                className="ml-2"
              />
            )}
            <Input
              id={id}
              className="shad-input border-0"
              placeholder={placeholder}
              autoComplete="off"
              {...field}
              {...rest}
            />
          </div>
        );

      case InputFieldType.EMAIL:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            {inputIcon && (
              <Image
                src={inputIcon}
                alt={iconAlt || "email Icon"}
                width={20}
                height={20}
                className="ml-2"
              />
            )}
            <Input
              id={id}
              className="shad-input border-0"
              placeholder={placeholder}
              autoComplete="off"
              {...field}
              {...rest}
            />
          </div>
        );

      case InputFieldType.PHONE:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            <PhoneInput
              className="shad-input border-0 px-2 py-1"
              international
              defaultCountry="EG"
              id={id}
              placeholder={placeholder}
              value={field.value} // ← explicit value
              onChange={(phone) => field.onChange(phone)}
              {...field}
              {...rest}
            />
          </div>
        );

      case InputFieldType.DATE:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            {inputIcon && (
              <Image
                src={inputIcon}
                alt={iconAlt || "Input Icon"}
                width={20}
                height={20}
                className="ml-2"
              />
            )}
            <DatePicker
              id={id}
              className="shad-input border-0"
              placeholder={placeholder}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              showTimeSelect={showTimeSelect ?? false}
              dateFormat={dateFormat ?? "MM/dd/yyyy"}
              autoComplete="off"
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
              {...field}
              {...rest}
            />
          </div>
        );

      case InputFieldType.SKELETON:
        return renderSkeleton ? renderSkeleton(field) : null;

      case InputFieldType.SELECT:
        return (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <div>
              <SelectTrigger className="shad-select-trigger flex w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </div>
            <SelectContent className="shad-select-content">
              {children}
            </SelectContent>
          </Select>
        );

      case InputFieldType.TEXTAREA:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            <Textarea
              id={id}
              className="shad-input border-0"
              placeholder={placeholder}
              {...field}
              {...rest}
            />
          </div>
        );

      case InputFieldType.CHECKBOX:
        return (
          <div className="flex items-center gap-4">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              {...field}
              {...rest}
            />
            <label htmlFor={name} className="checkbox-label">
              {label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {RenderField(field)}
          </>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
