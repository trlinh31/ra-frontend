import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

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
  searchable?: boolean;
  searchPlaceholder?: string;
}

export default function AppSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
  searchable = true,
  searchPlaceholder = "Tìm kiếm...",
}: AppSelectProps) {
  const [search, setSearch] = useState("");

  const filteredOptions = searchable ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <Select
      onValueChange={(v) => {
        if (!v && value) return;
        onChange?.(v);
      }}
      value={value}
      disabled={disabled}
      onOpenChange={(open) => {
        if (!open) setSearch("");
      }}>
      <SelectTrigger className={cn("bg-white w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent position='popper'>
        {searchable && (
          <div className='flex items-center gap-2 px-2 py-1.5 border-b'>
            <Search className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
            <input
              className='bg-transparent outline-none w-full placeholder:text-muted-foreground text-sm'
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <SelectGroup>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <p className='py-4 text-muted-foreground text-sm text-center'>Không có kết quả</p>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
