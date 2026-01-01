import type { LucideIcon } from "lucide-react";

export interface PrivacyHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor?: string;
}

export interface DataItem {
  icon: LucideIcon;
  title: string;
  description: string;
}
