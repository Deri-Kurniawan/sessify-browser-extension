import {
  AppWindowIcon,
  ChartPieIcon,
  CheckIcon,
  CookieIcon,
  DatabaseIcon,
  EyeOffIcon,
  Globe2Icon,
  HistoryIcon,
  ServerOffIcon,
  UserIcon,
  WifiIcon,
} from "lucide-react";
import type { DataItem, PrivacyHighlight } from "./_types/types";

export const privacyHighlights: PrivacyHighlight[] = [
  {
    icon: DatabaseIcon,
    title: "100% Local Storage",
    description:
      "All your session data is stored locally on your device. Zero cloud sync, zero external servers.",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: EyeOffIcon,
    title: "No Tracking",
    description:
      "We don't use analytics, cookies, or any tracking mechanisms. Your behavior is yours alone.",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: ServerOffIcon,
    title: "No Cloud Sync",
    description:
      "Your data never leaves your device or gets uploaded anywhere. Complete offline functionality.",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export const dataWeCollect: DataItem[] = [
  {
    icon: CheckIcon,
    title: "Session Data",
    description:
      "We store your browser session information (cookies, local storage, session storage) locally on your device to enable session switching functionality.",
  },
  {
    icon: CheckIcon,
    title: "Extension Settings",
    description:
      "Your extension preferences and configuration settings are stored locally to maintain your personalized experience.",
  },
];

export const dataProtection: DataItem[] = [
  {
    icon: DatabaseIcon,
    title: "Local-Only Storage",
    description:
      "All data is stored using your browser's local storage APIs and never transmitted over the internet.",
  },
  {
    icon: WifiIcon,
    title: "No Network Requests",
    description:
      "The extension operates entirely offline and doesn't make any network requests with your data.",
  },
  {
    icon: Globe2Icon,
    title: "Open Source Transparency",
    description:
      "Our code is open source, allowing anyone to verify our privacy practices and security measures.",
  },
];

export const dataWeDontCollect: DataItem[] = [
  {
    icon: UserIcon,
    title: "Personal Information",
    description:
      "We never collect names, email addresses, phone numbers, or any personally identifiable information.",
  },
  {
    icon: HistoryIcon,
    title: "Browsing History",
    description:
      "We don't track, monitor, or store your browsing history or website visits.",
  },
  {
    icon: ChartPieIcon,
    title: "Usage Analytics",
    description:
      "We don't use Google Analytics, telemetry, crash reporting, or any usage tracking tools.",
  },
  {
    icon: AppWindowIcon,
    title: "Third-Party Services",
    description:
      "We don't integrate with third-party services that could access or collect your data.",
  },
];

export const browserPermissions: DataItem[] = [
  {
    icon: DatabaseIcon,
    title: "Storage Permission",
    description:
      "Required to save and retrieve your session data (cookies, local storage, session storage) locally on your device.",
  },
  {
    icon: AppWindowIcon,
    title: "Tabs Permission",
    description:
      "Needed to manage browser tabs and apply session data when switching between sessions.",
  },
  {
    icon: CookieIcon,
    title: "Cookies Permission",
    description:
      "Required to save and restore cookies as part of your session data for websites.",
  },
  {
    icon: Globe2Icon,
    title: "Host Permissions",
    description:
      "Allows the extension to work on all websites to manage session data across different domains.",
  },
];

export const dataRetentionItems: string[] = [
  "Delete individual sessions at any time through the extension interface",
  "Clear all extension data through your browser's settings menu",
  "Uninstall the extension to permanently remove all associated data",
];
