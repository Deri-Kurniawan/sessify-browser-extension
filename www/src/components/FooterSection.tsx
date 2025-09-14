import { ExternalLink, FileTextIcon, HeartIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import pkg from "@/../package.json";
import { env } from "@/env";
import { cn } from "@/lib/utils";

interface FooterSectionProps {
	className?: string;
}

export function FooterSection({ className = "" }: FooterSectionProps) {
	return (
		<footer className={cn("px-4 py-6", className)}>
			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<div className="flex flex-wrap items-center gap-2 text-sm truncate">
					<span>Made with</span>
					<HeartIcon className="text-red-500 fill-current size-4 animate-pulse" />
					<span>by</span>
					<a
						href={pkg.author.url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
					>
						{pkg.author.name}
						<ExternalLink className="size-3" />
					</a>
				</div>

				<div className="flex items-center gap-6">
					<a
						href={env.PUBLIC_GITHUB_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 text-sm"
					>
						<FaGithub className="size-4" />
						<span>GitHub</span>
					</a>
					<a
						href={`${env.PUBLIC_GITHUB_URL}/blob/main/LICENSE`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm"
					>
						<FileTextIcon className="inline mr-1 size-4" />
						<span>{pkg.license} License</span>
					</a>
				</div>
			</div>
		</footer>
	);
}
