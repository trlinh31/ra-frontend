import type { AuthSession, AuthUser } from "@/modules/auth/login/types/auth.type";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// ─── SessionStorage keys ───────────────────────────────────────────────────────
const SESSION_TOKEN_KEY = "ra_token";
const SESSION_USER_KEY = "ra_user";

function persistSession(token: string, user: AuthUser) {
  sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
}

function restoreSession(): AuthSession | null {
  const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  const raw = sessionStorage.getItem(SESSION_USER_KEY);
  if (!token || !raw) return null;
  try {
    return { token, user: JSON.parse(raw) as AuthUser };
  } catch {
    return null;
  }
}

function removeSession() {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
}

// ─── Context shape ─────────────────────────────────────────────────────────────
interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  /** Lưu session sau khi đăng nhập thành công */
  login: (session: AuthSession) => void;
  /** Xóa session và yêu cầu đăng nhập lại */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Khôi phục phiên từ sessionStorage khi app khởi động
  useEffect(() => {
    const existing = restoreSession();
    if (existing) setSession(existing);
    setHydrated(true);
  }, []);

  const login = useCallback((newSession: AuthSession) => {
    persistSession(newSession.token, newSession.user);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    removeSession();
    setSession(null);
  }, []);

  // Tránh render trước khi hydrate xong (tránh flash)
  if (!hydrated) return null;

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
}
