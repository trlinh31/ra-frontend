import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

interface FormTimeInputProps {
  name: string;
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const ALLOWED_KEYS = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

export default function FormTimeInput({ name, className, label, required, disabled, placeholder = "HH:MM" }: FormTimeInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
          const formatted = digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
          field.onChange(formatted);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (!ALLOWED_KEYS.includes(e.key) && !/^\d$/.test(e.key)) {
            e.preventDefault();
          }
        };

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}
                {required && <span className='text-red-500'>*</span>}
              </FieldLabel>
            )}

            <Input
              id={name}
              value={field.value ?? ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              maxLength={5}
              disabled={disabled}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
