import { cn } from "@sessify/ui/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
  iconColor?: "green" | "blue" | "purple" | "orange" | "red";
}

const iconColorClasses = {
  green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  purple:
    "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  orange:
    "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  red: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
};

export function SectionTitle({
  icon: Icon,
  title,
  iconColor = "blue",
}: SectionTitleProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          iconColorClasses[iconColor],
        )}
      >
        <Icon className="size-5 shrink-0" />
      </div>
      <h2 className="font-bold text-2xl tracking-tight md:text-3xl">{title}</h2>
    </div>
  );
}
