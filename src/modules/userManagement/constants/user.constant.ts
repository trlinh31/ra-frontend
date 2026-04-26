import type { UserRole } from "@/modules/userManagement/types/user.type";

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Quản trị viên",
  SALE_MANAGER: "Quản lý Sale",
  SELLER: "Nhân viên Sale",
  OPERATION_MANAGER: "Quản lý Vận hành",
  OPERATOR: "Nhân viên Vận hành",
  ACCOUNTANT: "Kế toán",
};

export const USER_ROLE_BADGE: Record<UserRole, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  SALE_MANAGER: "bg-blue-100 text-blue-800",
  SELLER: "bg-sky-100 text-sky-800",
  OPERATION_MANAGER: "bg-orange-100 text-orange-800",
  OPERATOR: "bg-amber-100 text-amber-800",
  ACCOUNTANT: "bg-teal-100 text-teal-800",
};

export const USER_ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "SALE_MANAGER", label: "Quản lý Sale" },
  { value: "SELLER", label: "Nhân viên Sale" },
  { value: "OPERATION_MANAGER", label: "Quản lý Vận hành" },
  { value: "OPERATOR", label: "Nhân viên Vận hành" },
  { value: "ACCOUNTANT", label: "Kế toán" },
];
