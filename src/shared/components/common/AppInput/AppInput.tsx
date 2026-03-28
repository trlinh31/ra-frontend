import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function AppInput({ label, ...props }: AppInputProps) {
  return (
    <Field>
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      <Input
        id={props.id}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        aria-invalid={props["aria-invalid"]}
        maxLength={255}
        min={0}
        {...props}
      />
    </Field>
  );
}
