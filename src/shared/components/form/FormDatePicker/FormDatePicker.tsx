import AppDatePicker from "@/shared/components/common/AppDatePicker";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import type { Matcher } from "react-day-picker";
import { Controller, useFormContext } from "react-hook-form";

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  disabledDates?: Matcher | Matcher[];
}

export default function FormDatePicker({ name, label, placeholder, disabled, required, className, disabledDates }: FormDatePickerProps) {
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

          <AppDatePicker value={field.value} onChange={field.onChange} placeholder={placeholder} disabled={disabled} disableDate={disabledDates} />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
