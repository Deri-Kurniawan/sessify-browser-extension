import { cn } from "@sessify/ui/lib/utils";
import type { ReactNode } from "react";

export interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
