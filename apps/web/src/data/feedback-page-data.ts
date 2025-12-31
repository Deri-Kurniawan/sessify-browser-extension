import type { LucideIcon } from "lucide-react";
import {
  CodeIcon,
  GithubIcon,
  MessageCircleIcon,
  StarIcon,
} from "lucide-react";
import { env } from "@/env";

interface FeedbackOptionQuery {
  template?: string;
  title?: string;
  labels?: string;
  [key: string]: string | undefined;
}

interface FeedbackOptionHref {
  pathname: string;
  query?: FeedbackOptionQuery;
}

export interface FeedbackOption {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
  buttonText: string;
  href: string | FeedbackOptionHref;
}

export const getFeedbackOptions = (isUninstall: boolean): FeedbackOption[] => [
  {
    icon: GithubIcon,
    title: "Report a Bug",
    description: "Found something that's not working? Let us know!",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    buttonText: "Create Bug Report",
    href: {
      pathname: `${env.NEXT_PUBLIC_GITHUB_URL}/issues/new/choose`,
      query: {
        template: "bug_report.md",
        title: isUninstall ? "Uninstalling due to bug" : "",
        labels: isUninstall ? "bug,uninstall" : "bug",
      },
    },
  },
  {
    icon: StarIcon,
    title: "Request a Feature",
    description: "Have an idea to make Sessify even better?",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonText: "Request Feature",
    href: {
      pathname: `${env.NEXT_PUBLIC_GITHUB_URL}/issues/new/choose`,
      query: {
        template: "feature_request.md",
        title: "",
        labels: "enhancement",
      },
    },
  },
  {
    icon: MessageCircleIcon,
    title: "General Feedback",
    description: "Share your thoughts or start a discussion",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    buttonText: "Start Discussion",
    href: {
      pathname: `${env.NEXT_PUBLIC_GITHUB_URL}/discussions`,
    },
  },
  {
    icon: CodeIcon,
    title: "Contribute Code",
    description: "Help improve Sessify by contributing to the codebase",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    buttonText: "View Contributing Guide",
    href: `${env.NEXT_PUBLIC_GITHUB_URL}/blob/main/CONTRIBUTING.md`,
  },
];
