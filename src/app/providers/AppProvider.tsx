import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import React from "react";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TooltipProvider>{children}</TooltipProvider>;
    </SidebarProvider>
  );
}
