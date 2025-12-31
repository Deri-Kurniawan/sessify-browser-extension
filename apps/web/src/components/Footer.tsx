import { cn } from "@sessify/ui/lib/utils";
import { ExternalLink, FileTextIcon, LockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import pkg from "@/../package.json";
import { env } from "@/env";

type FooterProps = {
  className?: string;
};

export function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl transition-all">
                <Image
                  alt="Sessify Logo"
                  className="size-5 rounded"
                  height={20}
                  src="/icon.png"
                  width={20}
                />
              </div>
              <span className="font-bold text-lg">Sessify</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Privacy-first browser extension for seamless session management.
              All data stays local, no tracking, completely open source.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
                href="/privacy"
              >
                <LockIcon className="size-4 shrink-0" />
                Privacy Policy
              </Link>
              <Link
                className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
                href="/feedback"
              >
                <FileTextIcon className="size-4 shrink-0" />
                Feedback & Support
              </Link>
              <a
                className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
                href={`${env.NEXT_PUBLIC_GITHUB_URL}/blob/main/CONTRIBUTING.md`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="size-4 shrink-0" />
                Contributing Guide
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Resources
            </h3>
            <nav className="flex flex-col space-y-3">
              <a
                className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
                href={env.NEXT_PUBLIC_GITHUB_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaGithub className="size-4 shrink-0" />
                GitHub Repository
              </a>
              <a
                className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
                href={`${env.NEXT_PUBLIC_GITHUB_URL}/issues`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="size-4 shrink-0" />
                Report Issues
              </a>
              <a
                className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-primary"
                href={`${env.NEXT_PUBLIC_GITHUB_URL}/blob/main/LICENSE`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FileTextIcon className="size-4 shrink-0" />
                {pkg.license} License
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-muted-foreground text-sm md:flex-row">
          <p>© {currentYear} Sessify. All rights reserved.</p>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            Made by
            <a
              className="ml-1 inline-flex items-center gap-1 font-medium transition-colors hover:text-primary"
              href={pkg.author.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {pkg.author.name}
              <ExternalLink className="size-3 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
