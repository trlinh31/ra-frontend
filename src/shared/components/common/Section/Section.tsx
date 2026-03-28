import { cn } from "@/shared/lib/utils";
import React from "react";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  type?: "default" | "dashed";
}

export default function Section({ title, children, className, type = "default" }: SectionProps) {
  return (
    <div className={cn("bg-section-background p-5 rounded-[8px]", className, type === "dashed" && "border border-dashed")}>
      {title && <p className='mb-2 font-bold'>{title}</p>}
      {children}
    </div>
  );
}
