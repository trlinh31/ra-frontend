import { cn } from "@/shared/lib/utils";
import React from "react";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  type?: "default" | "dashed";
  borderColor?: "default" | "red" | "blue" | "green" | "yellow";
  bgColor?: "default" | "transparent";
}

const bgColorClasses = {
  default: "bg-section-background",
  transparent: "bg-transparent",
};

const borderColorClasses = {
  default: "border-section-border",
  red: "border-red-600",
  blue: "border-blue-600",
  green: "border-green-600",
  yellow: "border-yellow-600",
};

export default function Section({ title, children, className, type = "default", borderColor = "default", bgColor = "default" }: SectionProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-[8px]",
        className,
        bgColorClasses[bgColor],
        type === "dashed" && `border border-dashed ${borderColorClasses[borderColor]}`
      )}>
      {title && <p className='mb-2 font-bold'>{title}</p>}
      {children}
    </div>
  );
}
