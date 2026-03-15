import { APP_ROUTES } from "@/app/routes/route.config";
import type { AppRoute } from "@/app/routes/route.type";
import { useLocation } from "react-router-dom";

export const useCurrentRoute = (): AppRoute | undefined => {
  const location = useLocation();

  const findRoute = (routes: AppRoute[], pathname: string, parentPath = ""): AppRoute | undefined => {
    for (const route of routes) {
      let fullPath = parentPath;
      if (route.path) {
        const cleanParent = parentPath.replace(/\/$/, "");
        const childPath = route.path.startsWith("/") ? route.path : "/" + route.path;
        fullPath = cleanParent + childPath;
      }

      const normalizedFullPath = fullPath.replace(/\/$/, "") || "/";
      const normalizedPathname = pathname.replace(/\/$/, "") || "/";

      if (normalizedFullPath === normalizedPathname) {
        return route;
      }

      if (route.children) {
        const childRoute = findRoute(route.children as AppRoute[], pathname, fullPath);
        if (childRoute) {
          return childRoute;
        }
      }
    }

    return undefined;
  };

  return findRoute(APP_ROUTES, location.pathname);
};
