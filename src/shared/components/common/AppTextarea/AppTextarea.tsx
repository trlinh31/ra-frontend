import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";

interface AppTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function AppTextarea({ label, ...props }: AppTextareaProps) {
  return (
    <Field>
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      <Textarea id={props.id} value={props.value} onChange={props.onChange} aria-invalid={props["aria-invalid"]} maxLength={255} {...props} />
    </Field>
  );
}
