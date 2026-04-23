export type UserRole = "ADMIN" | "SALE_MANAGER" | "SELLER" | "OPERATION_MANAGER" | "OPERATOR" | "ACCOUNTANT_MANAGER" | "ACCOUNTANT";

export type User = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  note?: string;
  createdAt: string;
};
