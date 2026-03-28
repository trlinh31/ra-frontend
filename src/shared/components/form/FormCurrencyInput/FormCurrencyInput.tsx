import AppCurrencyInput from "@/shared/components/common/AppCurrencyInput";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Controller, useFormContext } from "react-hook-form";

interface FormCurrencyInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function FormCurrencyInput({ name, label, placeholder, disabled, required, className }: FormCurrencyInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {label && (
            <FieldLabel htmlFor={name}>
              {label}
              {required && <span className='text-red-500'>*</span>}
            </FieldLabel>
          )}

          <AppCurrencyInput id={name} value={field.value} onChange={field.onChange} placeholder={placeholder} disabled={disabled} />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
