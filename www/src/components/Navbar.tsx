"use client";

import { MessageCircleMoreIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { env } from "@/env";

export default function Navbar() {
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
				{/* Left: Brand */}
				<Link
					href="/"
					aria-label="Home"
					className="flex items-center gap-2 h-full"
				>
					<Image
						src="/favicon.ico"
						alt=""
						width={20}
						height={20}
						className="size-5"
					/>
					<span className="text-sm font-semibold tracking-tight">Sessify</span>
				</Link>

				{/* Right: Actions */}
				<div className="flex items-center gap-4">
					<Button asChild size="sm" variant="ghost">
						<Link href="/feedback">
							<MessageCircleMoreIcon />
							<span className="hidden md:inline-flex">Give </span>Feedback
						</Link>
					</Button>
					<Button asChild size="sm" className="hidden md:inline-flex">
						<a
							href={env.NEXT_PUBLIC_GITHUB_URL}
							target="_blank"
							rel="noreferrer"
						>
							<StarIcon />
							Star on GitHub
						</a>
					</Button>
					<Button asChild size="icon" className="md:hidden">
						<a
							href={env.NEXT_PUBLIC_GITHUB_URL}
							target="_blank"
							rel="noreferrer"
						>
							<StarIcon />
						</a>
					</Button>
				</div>
			</div>
		</header>
	);
}
