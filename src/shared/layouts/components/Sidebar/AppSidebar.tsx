import type { AppRoute } from "@/app/routes/route.type";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar";
import { APP_NAME } from "@/shared/constants/app.constant";
import { getSidebarRoutes } from "@/shared/layouts/components/Sidebar/sidebar.config";
import { ChevronRight, Globe } from "lucide-react";
import type React from "react";
import { NavLink, useMatch } from "react-router-dom";

function NavItem({ item }: { item: AppRoute }) {
  const match = useMatch(item.path ?? "");
  const isActive = !!match;

  return (
    <SidebarMenuButton asChild isActive={isActive} className='h-9 font-medium'>
      <NavLink to={item.path ?? "#"}>
        {item.icon && <item.icon className='w-4 h-4 shrink-0' />}
        <span>{item.title}</span>
      </NavLink>
    </SidebarMenuButton>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const routes = getSidebarRoutes([]);

  return (
    <Sidebar {...props}>
      <SidebarHeader className='px-4 py-3 border-b h-16'>
        <div className='flex items-center gap-2.5'>
          <div className='flex justify-center items-center bg-primary rounded-lg w-8 h-8 shrink-0'>
            <Globe className='w-4 h-4 text-primary-foreground' />
          </div>
          <div className='leading-tight'>
            <p className='font-semibold text-sm'>{APP_NAME}</p>
            <p className='text-muted-foreground text-xs'>Management System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='gap-0 px-2 py-2'>
        {routes.map((item) =>
          item.children ? (
            <Collapsible key={item.title} title={item.title} defaultOpen className='group/collapsible'>
              <SidebarGroup className='p-0'>
                <SidebarGroupLabel
                  asChild
                  className='group/label flex items-center gap-2 hover:bg-sidebar-accent p-2 rounded-md h-auto font-medium text-xs tracking-wider text-sidebar-accent-foreground cursor-pointer'>
                  <CollapsibleTrigger>
                    {item.icon && <item.icon className='w-3.5 h-3.5 shrink-0' />}
                    <span className='flex-1 text-left'>{item.title}</span>
                    <ChevronRight className='ml-auto w-3.5 h-3.5 group-data-[state=open]/collapsible:rotate-90 transition-transform duration-200' />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className='gap-0.5 mt-1 pl-3'>
                      {item.children
                        .filter((child) => child.showInSidebar)
                        .map((child) => (
                          <SidebarMenuItem key={child.title}>
                            <NavItem item={child} />
                          </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ) : (
            <SidebarGroup key={item.title} className='mb-0.5 p-0'>
              <SidebarMenu>
                <SidebarMenuItem>
                  <NavItem item={item} />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )
        )}
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter className='px-4 py-3'>
        <p className='text-muted-foreground text-xs text-center'>© 2026 {APP_NAME}</p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
