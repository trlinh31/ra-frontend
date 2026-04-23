import type { Role } from "@/shared/enums/role.enum";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type AppRoute = {
  path?: string;
  title?: string;
  pageTitle?: string;
  icon?: LucideIcon;
  children?: AppRoute[];
  showInSidebar?: boolean;
  element?: ReactNode;
  isActive?: boolean;
  isGroup?: boolean;
  roles?: Role[];
  /** Đánh dấu route không cần đăng nhập (vd: /auth/login) */
  isPublic?: boolean;
};
