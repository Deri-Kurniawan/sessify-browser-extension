import type { LucideIcon } from "lucide-react";
import {
  CodeIcon,
  DatabaseIcon,
  EyeOffIcon,
  LayersIcon,
  RotateCcwIcon,
  UserLockIcon,
  UserXIcon,
  WifiOffIcon,
  ZapIcon,
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

export const features: Feature[] = [
  {
    icon: LayersIcon,
    title: "Multiple Sessions",
    description:
      "Create unlimited sessions for different projects, contexts, or workflows",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: RotateCcwIcon,
    title: "Instant Restore",
    description:
      "Switch between sessions instantly with all your tabs, cookies, and local data",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: ZapIcon,
    title: "Lightning Fast",
    description:
      "Built for performance with minimal memory footprint and instant switching",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: DatabaseIcon,
    title: "100% Local Storage",
    description:
      "All your data stays on your device. No cloud sync, no external servers",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    icon: UserLockIcon,
    title: "Privacy First",
    description:
      "No analytics, no tracking, no data collection. Your privacy is guaranteed",
    bgColor: "bg-teal-100 dark:bg-teal-900/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    icon: CodeIcon,
    title: "Open Source",
    description:
      "Fully transparent codebase. Audit, contribute, and customize as you wish",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
];

export const privacyFeatures: Feature[] = [
  {
    icon: UserXIcon,
    title: "No Account Required",
    description:
      "Start using Sessify immediately. No sign-up, no personal information needed.",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: EyeOffIcon,
    title: "Zero Analytics",
    description:
      "We don't track how you use the extension. Your behavior is your business.",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: WifiOffIcon,
    title: "Offline First",
    description:
      "Works completely offline. No internet connection required for any functionality.",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
];

export const whatWeDontDo: string[] = [
  "No cloud storage or syncing",
  "No tracking or analytics",
  "No third-party integrations",
  "No personal data collection",
  "No external network requests",
];
