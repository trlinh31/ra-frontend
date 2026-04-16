import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface InlinePriceInputProps {
  index: number;
  breakdownText?: string;
}

export default function InlinePriceInput({ index, breakdownText }: InlinePriceInputProps) {
  const { control, setValue } = useFormContext<DayFormValues>();
  const unitPrice = useWatch({ control, name: `services.${index}.unitPrice` });
  const currency = useWatch({ control, name: `services.${index}.currency` });

  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!currency) return null;

  const handleClick = () => {
    setLocalValue(String(unitPrice));
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const commit = () => {
    const parsed = Number(localValue);
    if (!isNaN(parsed) && parsed >= 0) {
      setValue(`services.${index}.unitPrice`, parsed, { shouldValidate: true });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setIsEditing(false);
  };

  const formatted = currency === "VND" ? formatNumberVN(unitPrice) : unitPrice.toLocaleString();

  return (
    <div className='space-y-2'>
      {breakdownText && <p className='text-muted-foreground text-xs'>{breakdownText}</p>}

      {isEditing ? (
        <div className='flex items-center gap-2'>
          <span className='font-medium text-muted-foreground text-sm'>Tổng:</span>
          <input
            ref={inputRef}
            type='number'
            min={0}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className='bg-background px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-40 font-semibold text-green-600 text-base'
          />
          <span className='font-semibold text-green-600 text-base'>{currency}</span>
        </div>
      ) : (
        <button type='button' onClick={handleClick} className='group flex items-center gap-1.5 cursor-pointer' title='Nhấn để chỉnh sửa'>
          <p className='font-semibold text-green-600 text-lg group-hover:underline'>
            Tổng: {formatted} {currency}
          </p>
          <Pencil className='opacity-0 group-hover:opacity-60 w-3.5 h-3.5 text-muted-foreground transition-opacity' />
        </button>
      )}
    </div>
  );
}
