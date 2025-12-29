import { cn } from "@sessify/ui/lib/utils";
import { ExternalLink, FileTextIcon, HeartIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import pkg from "@/../package.json";
import { env } from "@/env";

type FooterProps = {
  className?: string;
};

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={cn("px-4 py-6", className)}>
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-wrap items-center gap-2 truncate text-sm">
          <span>Made with</span>
          <HeartIcon className="size-4 animate-pulse fill-current text-red-500" />
          <span>by</span>
          <a
            className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
            href={pkg.author.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {pkg.author.name}
            <ExternalLink className="size-3" />
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            className="flex items-center gap-2 text-sm"
            href={env.NEXT_PUBLIC_GITHUB_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGithub className="size-4" />
            <span>GitHub</span>
          </a>
          <a
            className="flex items-center gap-2 text-sm"
            href={`${env.NEXT_PUBLIC_GITHUB_URL}/blob/main/LICENSE`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FileTextIcon className="size-4" />
            <span>{pkg.license} License</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
