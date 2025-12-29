"use client";

import { Button } from "@sessify/ui/components/button";
import { MessageCircleMoreIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { env } from "@/env";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Left: Brand */}
        <Link
          aria-label="Home"
          className="flex h-full items-center gap-2"
          href="/"
        >
          <Image
            alt=""
            className="size-5"
            height={20}
            src="/icon.png"
            width={20}
          />
          <span className="font-semibold text-sm tracking-tight">Sessify</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Button asChild size="sm" variant="ghost">
            <Link href="/feedback">
              <MessageCircleMoreIcon />
              <span className="hidden md:inline-flex">Give </span>Feedback
            </Link>
          </Button>
          <Button asChild className="hidden md:inline-flex" size="sm">
            <a
              href={env.NEXT_PUBLIC_GITHUB_URL}
              rel="noreferrer"
              target="_blank"
            >
              <StarIcon />
              Star on GitHub
            </a>
          </Button>
          <Button asChild className="md:hidden" size="icon">
            <a
              href={env.NEXT_PUBLIC_GITHUB_URL}
              rel="noreferrer"
              target="_blank"
            >
              <StarIcon />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
