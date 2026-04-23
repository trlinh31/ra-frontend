import type { UserRole } from "@/modules/userManagement/types/user.type";

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Quản trị viên",
  SALE_MANAGER: "Trưởng phòng Sales",
  SELLER: "Nhân viên kinh doanh",
  OPERATION_MANAGER: "Trưởng phòng Vận hành",
  OPERATOR: "Nhân viên Vận hành",
  ACCOUNTANT_MANAGER: "Trưởng phòng Kế toán",
  ACCOUNTANT: "Kế toán viên",
};

export const USER_ROLE_DEPARTMENT: Record<UserRole, string> = {
  ADMIN: "—",
  SALE_MANAGER: "Sales",
  SELLER: "Sales",
  OPERATION_MANAGER: "Vận hành",
  OPERATOR: "Vận hành",
  ACCOUNTANT_MANAGER: "Kế toán",
  ACCOUNTANT: "Kế toán",
};

export const USER_ROLE_BADGE: Record<UserRole, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  SALE_MANAGER: "bg-blue-100 text-blue-800",
  SELLER: "bg-sky-100 text-sky-800",
  OPERATION_MANAGER: "bg-orange-100 text-orange-800",
  OPERATOR: "bg-amber-100 text-amber-800",
  ACCOUNTANT_MANAGER: "bg-emerald-100 text-emerald-800",
  ACCOUNTANT: "bg-teal-100 text-teal-800",
};

export const USER_ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "SALE_MANAGER", label: "Trưởng phòng Sales" },
  { value: "SELLER", label: "Nhân viên kinh doanh" },
  { value: "OPERATION_MANAGER", label: "Trưởng phòng Vận hành" },
  { value: "OPERATOR", label: "Nhân viên Vận hành" },
  { value: "ACCOUNTANT_MANAGER", label: "Trưởng phòng Kế toán" },
  { value: "ACCOUNTANT", label: "Kế toán viên" },
];
