import {
	CodeIcon,
	FileCode2Icon,
	GlobeIcon,
	ShieldIcon,
	ZapIcon,
} from "lucide-react";
import Image from "next/image";
import extensionSidepanelSnapshot from "@/assets/images/extension-sidepanel-snapshot.png";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { browserSupport } from "@/configs/browser-support";
import { env } from "@/env";
import { cn } from "@/lib/utils";

const HeroSection = ({
	userBrowserType = "chrome",
	isDesktop = true,
	className = "",
}: {
	userBrowserType?: string;
	isDesktop?: boolean;
	className?: string;
}) => {
	const supportedBrowser = browserSupport.find(
		(b) => b.name === userBrowserType,
	);

	return (
		<section className={cn("relative overflow-hidden", className)}>
			<div className="grid items-center gap-12 lg:grid-cols-1">
				{/* Content */}
				<div className="flex flex-col items-center justify-center space-y-8">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<Badge variant="secondary" className="w-fit">
							<ShieldIcon className="size-3" />
							Privacy First
						</Badge>

						<div>
							<h1 className="text-pretty text-4xl font-semibold tracking-tight md:text-5xl">
								Sessify—
								<span className="text-primary">Session Manager</span>
							</h1>

							<p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
								No more repetitive logins—store sessions, swap in seconds.
							</p>
						</div>
					</div>

					{/* Feature highlights */}
					<div className="flex flex-wrap justify-center gap-4">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<ZapIcon className="size-4 text-primary" />
							Free Forever
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<ShieldIcon className="size-4 text-primary" />
							Privacy in your hands
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<CodeIcon className="size-4 text-primary" />
							Open Source
						</div>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-wrap justify-center gap-4">
						{supportedBrowser &&
						(isDesktop || supportedBrowser?.mobileSupport) ? (
							<Button
								size="lg"
								className="bg-primary hover:bg-primary/90 text-primary-foreground capitalize"
								asChild
							>
								<a
									href={supportedBrowser?.storeUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									{supportedBrowser?.icon}
									Add to {supportedBrowser?.name}
								</a>
							</Button>
						) : (
							<Button
								size="lg"
								className="bg-primary hover:bg-primary/90 text-primary-foreground"
								disabled
							>
								<GlobeIcon className="size-5" />
								{isDesktop ? "Unsupported Browser" : "Unsupported on Mobile"}
							</Button>
						)}

						<Button variant="outline" size="lg" asChild>
							<a
								href={`${env.NEXT_PUBLIC_GITHUB_URL}/releases`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<FileCode2Icon className="size-5" />
								GitHub Release
							</a>
						</Button>
					</div>
				</div>

				{/* Visual Element */}
				<div className="overflow-hidden border rounded-lg shadow">
					<Image
						src={extensionSidepanelSnapshot}
						alt="Sessify Extension Sidepanel Snapshot"
						className="rounded-lg shadow-lg"
						priority
					/>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
