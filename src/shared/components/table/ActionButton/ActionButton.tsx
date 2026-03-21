import { Button } from "@/shared/components/ui/button";
import { PlusCircle, SquarePen, Trash2 } from "lucide-react";

export type Action = "edit" | "delete" | "add";

export interface ActionButtonProps {
  action: Action;
  onClick?: () => void;
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
}

const icons: Record<Action, React.ElementType> = {
  add: PlusCircle,
  edit: SquarePen,
  delete: Trash2,
};

const titles: Record<Action, string> = {
  add: "Thêm mới",
  edit: "Chỉnh sửa",
  delete: "Xóa",
};

export default function ActionButton({ action, onClick, size = "icon-lg" }: ActionButtonProps) {
  const Icon = icons[action];

  return (
    <Button type='button' variant='outline' size={size} onClick={onClick} title={titles[action]}>
      <Icon className='w-4 h-4' />
    </Button>
  );
}
