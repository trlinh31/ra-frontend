import { PATHS } from "@/app/routes/route.constant";
import { Role } from "@/shared/enums/role.enum";
import { useAuth } from "@/shared/contexts/AuthContext";
import { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  permissions?: Role[];
}

export default function ProtectedRoute({ children, permissions }: ProtectedRouteProps) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  // Chưa đăng nhập → về trang login, lưu lại trang đang cố truy cập
  if (!isAuthenticated) {
    return <Navigate to={PATHS.AUTH.LOGIN} replace state={{ from: location }} />;
  }

  // Đã đăng nhập nhưng không đủ quyền → về trang forbidden
  if (permissions && permissions.length > 0 && session?.user) {
    const hasPermission = permissions.some(
      (p) => p === (session.user.roleKey as Role)
    );
    if (!hasPermission) {
      return <Navigate to={PATHS.FORBIDDEN} replace />;
    }
  }

  return children;
}
