import ProtectedRoute from "@/app/routes/ProtectedRoute";
import type { AppRoute } from "@/app/routes/route.type";
import type { RouteObject } from "react-router-dom";

/**
 * Tự động wrap các route element với ProtectedRoute dựa trên roles được khai báo
 * Giúp loại bỏ việc phải wrap thủ công và tránh duplicate khai báo permissions
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

    // Tự động wrap element với ProtectedRoute nếu có roles
    if (route.element) {
      const routeElement = <>{route.element}</>;

      if (route.roles && route.roles.length > 0) {
        processedRoute.element = <ProtectedRoute permissions={route.roles}>{routeElement}</ProtectedRoute>;
      } else {
        processedRoute.element = route.element;
      }
    }

    return processedRoute;
  });
};
