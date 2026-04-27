import { Button } from "@/components/ui/button";
import Image from "next/image";
type SubmitButtonProps = {
  formId: string;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;

  // ID of the form to submit
};
export default function SubmitButton({
  formId,
  isLoading,
  className,
  children,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      form={formId}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ?<div className="flex items-center gap-4">
        <Image
          src="/assets/icons/loader.svg"
          alt="loader"
          width={24}
          className="animate-spin"
          height={24}
        />
          Loading...  </div> : children}
    </Button>
  );
}
