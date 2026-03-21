import { Button } from "@/shared/components/ui/button";
import { CirclePlus, type LucideIcon } from "lucide-react";

interface TableToolbarProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
  onAdd: () => void;
}

export default function TableToolbar({ title, icon, description, onAdd }: TableToolbarProps) {
  const Icon = icon;

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-3'>
        {Icon && <Icon className='w-6 h-6 text-primary' />}

        <div>
          <h1 className='font-bold text-2xl tracking-tight'>{title}</h1>
          {description && <p className='text-muted-foreground text-sm'>{description}</p>}
        </div>
      </div>

      <Button type='button' size='lg' onClick={onAdd}>
        <CirclePlus className='w-4 h-4' />
        Thêm mới
      </Button>
    </div>
  );
}
