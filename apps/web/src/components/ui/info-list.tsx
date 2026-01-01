import { Card, CardHeader } from "@sessify/ui/components/card";
import type { LucideIcon } from "lucide-react";

export interface InfoListItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface InfoListProps {
  items: InfoListItem[];
  iconColor?: "green" | "blue" | "purple" | "orange" | "red";
  cardClassName?: string;
}

const iconColorClasses = {
  green: "text-green-600 dark:text-green-400",
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
  orange: "text-orange-600 dark:text-orange-400",
  red: "text-red-600 dark:text-red-400",
};

export function InfoList({
  items,
  iconColor = "blue",
  cardClassName,
}: InfoListProps) {
  return (
    <Card className={cardClassName}>
      <CardHeader className="space-y-4 pb-6">
        {items.map((item) => (
          <div className="flex items-start gap-3" key={item.title}>
            <item.icon
              className={`mt-1 size-6 shrink-0 ${iconColorClasses[iconColor]}`}
            />
            <div>
              <h3 className="font-semibold text-base">{item.title}</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </CardHeader>
    </Card>
  );
}
