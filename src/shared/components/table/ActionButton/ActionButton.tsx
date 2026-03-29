import { Button } from "@/shared/components/ui/button";
import { Eye, PlusCircle, SquarePen, Trash2 } from "lucide-react";

export type Action = "edit" | "delete" | "add" | "view";

export interface ActionButtonProps {
  action: Action;
  onClick?: () => void;
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  variant?: "default" | "link" | "outline" | "secondary" | "ghost" | "destructive";
  text?: string;
}

const icons: Record<Action, React.ElementType> = {
  add: PlusCircle,
  edit: SquarePen,
  delete: Trash2,
  view: Eye,
};

const titles: Record<Action, string> = {
  add: "Thêm mới",
  edit: "Chỉnh sửa",
  delete: "Xóa",
  view: "Xem chi tiết",
};

export default function ActionButton({ action, onClick, size = "icon-lg", variant = "outline", text }: ActionButtonProps) {
  const Icon = icons[action];

  return (
    <Button type='button' variant={variant} size={size} onClick={onClick} title={titles[action]}>
      <Icon className='w-4 h-4' />
      {text && <span>{text}</span>}
    </Button>
  );
}
