import { cn } from "@sessify/ui/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface IconWrapperProps {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-10",
  md: "size-12",
  lg: "size-14",
};

const iconSizeClasses = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
};

export function IconWrapper({
  icon: Icon,
  className,
  iconClassName,
  size = "md",
}: IconWrapperProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        sizeClasses[size],
        className,
      )}
    >
      <Icon className={cn("shrink-0", iconSizeClasses[size], iconClassName)} />
    </div>
  );
}
