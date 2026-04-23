import ProtectedRoute from "@/app/routes/ProtectedRoute";
import type { AppRoute } from "@/app/routes/route.type";
import type { RouteObject } from "react-router-dom";

/**
 * Tự động wrap các route element với ProtectedRoute.
 *
 * Logic:
 *  - Route có `isPublic: true` → render thẳng, không cần auth (vd: LoginPage)
 *  - Route có `roles` → wrap với ProtectedRoute + kiểm tra quyền cụ thể
 *  - Route còn lại có element → wrap với ProtectedRoute (chỉ kiểm tra isAuthenticated)
 */
export const processRoutes = (routes: AppRoute[]): RouteObject[] => {
  return routes.map((route) => {
    const processedRoute: RouteObject = {
      path: route.path,
    };

    // Xử lý children nếu có (đệ quy)
    if (route.children) {
      processedRoute.children = processRoutes(route.children);
    }

    if (route.element) {
      if (route.isPublic) {
        // Route công khai — không bọc ProtectedRoute
        processedRoute.element = route.element;
      } else if (route.roles && route.roles.length > 0) {
        // Route có khai báo roles cụ thể
        processedRoute.element = (
          <ProtectedRoute permissions={route.roles}>{<>{route.element}</>}</ProtectedRoute>
        );
      } else {
        // Route thông thường — chỉ cần đăng nhập, không giới hạn role
        processedRoute.element = (
          <ProtectedRoute>{<>{route.element}</>}</ProtectedRoute>
        );
      }
    }

    return processedRoute;
  });
};
