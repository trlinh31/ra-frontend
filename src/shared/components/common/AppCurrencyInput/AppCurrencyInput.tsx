import { Input } from "@/shared/components/ui/input";
import { NumericFormat } from "react-number-format";

interface AppCurrencyInputProps {
  id?: string;
  value?: number;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function AppCurrencyInput({ id, value, onChange, placeholder, disabled, className }: AppCurrencyInputProps) {
  return (
    <NumericFormat
      id={id}
      thousandSeparator=','
      decimalSeparator='.'
      allowNegative={false}
      placeholder={placeholder}
      value={value ?? null}
      onValueChange={(values) => onChange?.(values.floatValue ?? null)}
      customInput={Input}
      className={className}
      disabled={disabled}
    />
  );
}
