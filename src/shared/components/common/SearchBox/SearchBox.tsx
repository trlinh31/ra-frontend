import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({ value, onChange, placeholder = "Tìm kiếm..." }: SearchBoxProps) {
  return (
    <div className='relative w-80'>
      <Search className='top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 pointer-events-none' />
      <Input value={value} onChange={(e) => onChange(e.target.value)} className='pl-9' placeholder={placeholder} />
    </div>
  );
}
