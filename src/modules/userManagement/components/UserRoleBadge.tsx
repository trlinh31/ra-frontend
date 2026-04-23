import { USER_ROLE_BADGE, USER_ROLE_LABEL } from "@/modules/userManagement/constants/user.constant";
import type { UserRole } from "@/modules/userManagement/types/user.type";
import { cn } from "@/shared/lib/utils";

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

export default function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full font-medium text-xs", USER_ROLE_BADGE[role], className)}>
      {USER_ROLE_LABEL[role]}
    </span>
  );
}
