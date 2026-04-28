import type { Role } from "@/shared/enums/role.enum";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  roleKey: Role;
  avatar: string;
  permissions: string[];
  loginAt: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
