import { APP_ROUTES } from "@/app/routes/route.config";
import { PATHS } from "@/app/routes/route.constant";
import type { AppRoute } from "@/app/routes/route.type";
import type { Role } from "@/shared/enums/role.enum";

export const getSidebarRoutes = (userRoles: Role[] = []): AppRoute[] => {
  const adminLayout = APP_ROUTES.find((r) => r.path === PATHS.ROOT && r.children);
  const sidebarRoutes = (adminLayout?.children as AppRoute[])?.filter((r) => r.showInSidebar) || [];

  // Hàm kiểm tra quyền truy cập
  const hasAccess = (route: AppRoute): boolean => {
    if (!route.roles || route.roles.length === 0) return true;
    return route.roles.some((role) => userRoles.includes(role));
  };

  // Xử lý routes, bao gồm cả groups
  return sidebarRoutes
    .map((route) => {
      // Nếu là group, filter children dựa trên roles
      if (route.isGroup && route.children) {
        const filteredChildren = route.children.filter((child) => child.showInSidebar && hasAccess(child));

        // Chỉ hiển thị group nếu có ít nhất 1 child được phép truy cập
        if (filteredChildren.length === 0) {
          return null;
        }

        return {
          ...route,
          children: filteredChildren,
        };
      }

      // Route thông thường
      return hasAccess(route) ? route : null;
    })
    .filter((route): route is AppRoute => route !== null);
};
