import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

interface AppSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  invalid?: boolean;
}

export default function AppSelect({ options, value, onChange, placeholder, disabled = false, className, invalid }: AppSelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger className={cn("bg-white w-full", invalid && "border-destructive ring-3 ring-destructive/20", className)} aria-invalid={invalid}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent position='popper'>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
