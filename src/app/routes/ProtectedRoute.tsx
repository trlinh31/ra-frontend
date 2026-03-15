import { PATHS } from "@/app/routes/route.constant";
import { Role } from "@/shared/enums/role.enum";
import { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  permissions?: Role[];
}

export default function ProtectedRoute({ children, permissions }: ProtectedRouteProps) {
  // const { isAuthenticated, loading, user } = useAuthStore();
  // const location = useLocation();
  // const token = getStorageItem<string | null>(ACCESS_TOKEN, null);
  const isAuthenticated = true;
  const loading = false;
  const user = {
    roles: [Role.ADMIN],
  };
  const token = "dummy-token";

  if (loading) {
    // return <AppLoading loading={loading} />;
    return null;
  }

  if (!isAuthenticated && !token) {
    return <Navigate to={PATHS.AUTH.LOGIN} replace state={{ from: location }} />;
  }

  if (permissions && user && !permissions.some((permission) => user.roles.includes(permission))) {
    return <Navigate to={PATHS.FORBIDDEN} replace />;
  }

  return children;
}
