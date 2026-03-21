import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Switch } from "@/shared/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";

interface FormSwitchProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function FormSwitch({ name, label, required, className, ...props }: FormSwitchProps) {
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

          <Switch checked={field.value} onCheckedChange={field.onChange} {...props} />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
