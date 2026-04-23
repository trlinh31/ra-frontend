import LoginForm from "@/modules/auth/login/components/LoginForm";
import type { AuthSession } from "@/modules/auth/login/types/auth.type";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "@/app/routes/route.constant";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu đã đăng nhập rồi → redirect về trang trước đó hoặc dashboard
  const from = (location.state as { from?: Location })?.from?.pathname ?? PATHS.DASHBOARD;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSuccess = (session: AuthSession) => {
    login(session);
    navigate(from, { replace: true });
  };

  return <LoginForm onSuccess={handleSuccess} />;
}
