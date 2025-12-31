import { cn } from "@sessify/ui/lib/utils";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("text-center", className)}>
      <h2
        className={cn(
          "font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mx-auto mt-4 max-w-2xl text-lg text-muted-foreground",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
