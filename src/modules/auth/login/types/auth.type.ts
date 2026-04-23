export type AuthUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  roleKey: string;
  avatar: string;
  permissions: string[];
  loginAt: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
