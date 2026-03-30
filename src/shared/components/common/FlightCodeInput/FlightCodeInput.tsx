import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useRef } from "react";

interface FlightRoute {
  airlineCode: string;
  origin: string;
  destination: string;
}

interface FlightCodeInputProps {
  label?: string;
  value: FlightRoute;
  onChange: (route: FlightRoute) => void;
  required?: boolean;
  placeholder?: {
    airlineCode?: string;
    origin?: string;
    destination?: string;
  };
}

export default function FlightCodeInput({ label, value, onChange, required, placeholder }: FlightCodeInputProps) {
  const ref0 = useRef<HTMLInputElement>(null);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const refs = [ref0, ref1, ref2];

  const handleChange = (key: keyof FlightRoute, index: number, val: string, prevVal: string) => {
    const upper = val.toUpperCase();

    onChange({
      ...value,
      [key]: upper,
    });

    if (upper.length === 3 && prevVal.length < 3 && index < refs.length - 1) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const currentValue = (e.target as HTMLInputElement).value;

    if (e.key === "Backspace" && !currentValue && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  return (
    <Field>
      {label && (
        <FieldLabel>
          {label}
          {required && <span className='text-red-500'>*</span>}
        </FieldLabel>
      )}

      <div className='flex items-center gap-3'>
        <Input
          ref={refs[0]}
          maxLength={3}
          value={value.airlineCode}
          onChange={(e) => handleChange("airlineCode", 0, e.target.value, value.airlineCode)}
          onKeyDown={(e) => handleKeyDown(0, e)}
          placeholder={placeholder?.airlineCode}
        />

        <Input
          ref={refs[1]}
          maxLength={3}
          value={value.origin}
          onChange={(e) => handleChange("origin", 1, e.target.value, value.origin)}
          onKeyDown={(e) => handleKeyDown(1, e)}
          placeholder={placeholder?.origin}
        />

        <Input
          ref={refs[2]}
          maxLength={3}
          value={value.destination}
          onChange={(e) => handleChange("destination", 2, e.target.value, value.destination)}
          onKeyDown={(e) => handleKeyDown(2, e)}
          placeholder={placeholder?.destination}
        />
      </div>
    </Field>
  );
}
