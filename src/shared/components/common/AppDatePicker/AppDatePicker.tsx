import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { Matcher } from "react-day-picker";

interface FormDatePickerProps {
  value?: string | null;
  onChange?: (date: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  disableDate?: Matcher | Matcher[];
}

export default function AppDatePicker({ value, onChange, placeholder = "Chọn ngày", disabled, disableDate }: FormDatePickerProps) {
  const [open, setOpen] = useState(false);

  const dateValue = useMemo(() => {
    if (!value) return undefined;
    const date = new Date(value);

    return isNaN(date.getTime()) ? undefined : date;
  }, [value]);

  const onDateChange = (date: Date | undefined) => {
    if (!date) {
      onChange?.(null);
    } else {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange?.(formattedDate);
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type='button' variant='outline' className='justify-start bg-white hover:bg-white w-full' disabled={disabled}>
          <CalendarIcon className='mr-1 w-4 h-4' />
          <span className={!dateValue ? "text-muted-foreground" : ""}>{dateValue ? format(dateValue, "dd/MM/yyyy") : placeholder}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className='p-0 w-auto'>
        <Calendar mode='single' selected={dateValue} defaultMonth={dateValue} onSelect={onDateChange} disabled={disableDate} />
      </PopoverContent>
    </Popover>
  );
}
