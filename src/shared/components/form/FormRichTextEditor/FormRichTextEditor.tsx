import RichTextEditor from "@/shared/components/form/FormRichTextEditor/RichTextEditor";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Controller, useFormContext } from "react-hook-form";

interface FormRichTextEditorProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export default function FormRichTextEditor({ name, label, required, placeholder, className }: FormRichTextEditorProps) {
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

          <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder={placeholder} invalid={fieldState.invalid} />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
