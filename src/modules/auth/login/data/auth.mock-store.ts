import { Role } from "@/shared/enums/role.enum";
import type { AuthUser } from "@/modules/auth/login/types/auth.type";

// ─── Mock user registry ───────────────────────────────────────────────────────
type MockUserRecord = AuthUser & { password: string };

const MOCK_USERS: MockUserRecord[] = [
  {
    id: "usr_001",
    email: "admin@app.com",
    password: "Admin@123",
    name: "Nguyễn Văn Admin",
    username: "admin",
    role: "Quản trị viên",
    roleKey: Role.ADMIN,
    avatar: "NV",
    permissions: ["read", "write", "delete", "manage_users"],
    loginAt: "",
  },
  {
    id: "usr_002",
    email: "manager@app.com",
    password: "Manager@123",
    name: "Trần Thị Manager",
    username: "manager",
    role: "Quản lý",
    roleKey: Role.MANAGER,
    avatar: "TT",
    permissions: ["read", "write", "delete"],
    loginAt: "",
  },
  {
    id: "usr_003",
    email: "seller@app.com",
    password: "Seller@123",
    name: "Lê Văn Seller",
    username: "seller",
    role: "Nhân viên Sales",
    roleKey: Role.SELLER,
    avatar: "LV",
    permissions: ["read", "write"],
    loginAt: "",
  },
  {
    id: "usr_004",
    email: "accountant@app.com",
    password: "Accountant@123",
    name: "Phạm Thị Kế Toán",
    username: "accountant",
    role: "Kế toán",
    roleKey: Role.ACCOUNTANT,
    avatar: "PT",
    permissions: ["read", "write"],
    loginAt: "",
  },
];

// ─── Token generator (mock JWT) ───────────────────────────────────────────────
function base64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generateMockToken(user: MockUserRecord): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    iss: "ra-fe.vn",
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.roleKey,
    permissions: user.permissions,
    iat: now,
    exp: now + 86400, // 24h — nhưng sessionStorage xóa khi đóng tab
  };
  const h = base64url(JSON.stringify(header));
  const p = base64url(JSON.stringify(payload));
  const sig = base64url(`mock_sig_${user.id}_${now}`);
  return `${h}.${p}.${sig}`;
}

// ─── Auth service (async, mock network delay) ─────────────────────────────────
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  await new Promise((r) => setTimeout(r, 800)); // simulate latency

  const found = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!found) {
    throw new Error("Email hoặc mật khẩu không chính xác.");
  }

  const token = generateMockToken(found);
  const user: AuthUser = {
    id: found.id,
    email: found.email,
    name: found.name,
    username: found.username,
    role: found.role,
    roleKey: found.roleKey,
    avatar: found.avatar,
    permissions: found.permissions,
    loginAt: new Date().toISOString(),
  };

  return { token, user };
}

export { MOCK_USERS };
