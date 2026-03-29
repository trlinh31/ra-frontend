import ConfirmProvider from "@/app/providers/ConfirmProvider";
import { queryClientConfig } from "@/configs/react-query";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClientConfig}>
      <TooltipProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
