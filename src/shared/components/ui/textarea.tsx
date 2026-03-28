import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        "flex bg-white disabled:bg-input/50 dark:bg-input/30 dark:disabled:bg-input/80 disabled:opacity-50 px-2.5 py-2 border border-input focus-visible:border-ring rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 w-full min-h-16 placeholder:text-muted-foreground md:text-sm text-base transition-colors field-sizing-content disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
