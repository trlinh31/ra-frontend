import { TooltipProvider } from "@/shared/components/ui/tooltip";
import React from "react";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
