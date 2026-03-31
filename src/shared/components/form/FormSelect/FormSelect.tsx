import AppSelect from "@/shared/components/common/AppSelect";
import type { SelectOption } from "@/shared/components/common/AppSelect/AppSelect";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Controller, useFormContext } from "react-hook-form";

interface FormSelectProps {
  name: string;
  options: SelectOption[];
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string | number | SelectOption) => void;
}

export default function FormSelect({ name, options, label, required = false, className, placeholder, disabled, onChange }: FormSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (value: string | number | SelectOption) => {
          field.onChange(value);
          onChange?.(value);
        };

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}
                {required && <span className='text-red-500'>*</span>}
              </FieldLabel>
            )}

            <AppSelect options={options} value={field.value} onChange={handleChange} placeholder={placeholder} disabled={disabled} />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
