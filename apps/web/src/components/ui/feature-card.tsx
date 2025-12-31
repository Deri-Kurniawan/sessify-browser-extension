import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sessify/ui/components/card";
import type { LucideIcon } from "lucide-react";
import { IconWrapper } from "./icon-wrapper";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor?: string;
  iconColor?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  bgColor,
  iconColor,
}: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <IconWrapper
          className={bgColor}
          icon={icon}
          iconClassName={iconColor}
        />
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
