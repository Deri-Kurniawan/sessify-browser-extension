"use client";

import { Button } from "@sessify/ui/components/button";
import { MessageCircleMoreIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { env } from "@/env";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          href="/"
        >
          <span className="font-bold text-xl tracking-tight">Sessify</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Button
            asChild
            size="sm"
            variant={pathname === "/privacy" ? "secondary" : "ghost"}
          >
            <Link href="/privacy">Privacy</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={pathname === "/feedback" ? "secondary" : "ghost"}
          >
            <Link href="/feedback">Feedback</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="md:hidden"
            size="icon"
            variant={pathname === "/feedback" ? "secondary" : "ghost"}
          >
            <Link aria-label="Give Feedback" href="/feedback">
              <MessageCircleMoreIcon className="size-5 shrink-0" />
            </Link>
          </Button>

          <Button asChild className="hidden md:inline-flex" size="sm">
            <a
              href={env.NEXT_PUBLIC_GITHUB_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <StarIcon className="size-4 shrink-0" />
              Star on GitHub
            </a>
          </Button>

          <Button asChild className="md:hidden" size="icon">
            <a
              aria-label="Star on GitHub"
              href={env.NEXT_PUBLIC_GITHUB_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <StarIcon className="size-5 shrink-0" />
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
