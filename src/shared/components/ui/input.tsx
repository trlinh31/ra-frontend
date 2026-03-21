import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        "file:inline-flex bg-white disabled:bg-input/50 dark:bg-input/30 dark:disabled:bg-input/80 file:bg-transparent disabled:opacity-50 px-2.5 py-1 border border-input focus-visible:border-ring file:border-0 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 w-full min-w-0 h-8 file:h-6 file:font-medium placeholder:text-muted-foreground file:text-foreground md:text-sm file:text-sm text-base transition-colors disabled:cursor-not-allowed disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

export { Input };
