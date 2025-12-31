import { cn } from "@sessify/ui/lib/utils";
import type { ReactNode } from "react";

export interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-4xl",
  md: "max-w-6xl",
  lg: "max-w-7xl",
};

export function SectionContainer({
  children,
  className,
  size = "lg",
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "mx-auto px-4 py-24 md:px-6 lg:py-32",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </section>
  );
}
