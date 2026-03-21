import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { APP_NAME } from "@/shared/constants/app.constant";
import { useCurrentRoute } from "@/shared/hooks/useCurrentRoute";
import { AppSidebar } from "@/shared/layouts/components/Sidebar";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const currentRoute = useCurrentRoute();

  useEffect(() => {
    document.title = currentRoute?.pageTitle ? `${currentRoute.pageTitle} | ${APP_NAME}` : APP_NAME;
  }, [currentRoute]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='min-w-0 overflow-x-hidden'>
        <header className='top-0 sticky flex items-center gap-2 bg-background px-4 border-b h-16 shrink-0'>
          <SidebarTrigger className='-ml-1' />
        </header>

        <div className='flex flex-col flex-1 gap-4 p-4'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
