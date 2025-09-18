import {
	CodeIcon,
	GlobeIcon,
	ShieldIcon,
	StarIcon,
	ZapIcon,
} from "lucide-react";
import Image from "next/image";
import { FaChrome, FaEdge, FaOpera } from "react-icons/fa";
import { SiBrave, SiVivaldi } from "react-icons/si";
import extensionSidepanelSnapshot from "@/assets/images/extension-sidepanel-snapshot.png";
import { env } from "@/env";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const browserSupport = [
	{
		name: "chrome",
		storeUrl: "https://chrome.google.com/webstore",
		icon: <FaChrome className="size-5" />,
	},
	{
		name: "edge",
		storeUrl: "https://microsoftedge.microsoft.com/addons",
		icon: <FaEdge className="size-5" />,
	},
	{
		name: "opera",
		storeUrl: "https://chrome.google.com/webstore/category/extensions",
		icon: <FaOpera className="size-5" />,
	},
	{
		name: "brave",
		storeUrl: "https://chrome.google.com/webstore",
		icon: <SiBrave className="size-5" />,
	},
	{
		name: "vivaldi",
		storeUrl: "https://chrome.google.com/webstore",
		icon: <SiVivaldi className="size-5" />,
	},
];

const HeroSection = ({
	userBrowserType = "chrome",
}: {
	userBrowserType?: string;
}) => {
	const supportedBrowser = browserSupport.find(
		(b) => b.name === userBrowserType,
	);

	return (
		<section className="relative overflow-hidden">
			<div className="grid items-center gap-12 lg:grid-cols-1">
				{/* Content */}
				<div className="flex flex-col items-center justify-center space-y-8">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<Badge variant="secondary" className="w-fit">
							<ShieldIcon className="w-3 h-3 mr-1" />
							Privacy First
						</Badge>

						<h1 className="text-4xl font-bold leading-tight lg:text-6xl text-balance">
							Sessify—
							<span className="text-primary">Session Manager</span>
						</h1>

						<p className="text-xl lg:text-2xl text-muted-foreground text-pretty">
							No more repetitive logins—store sessions, swap in seconds.
						</p>
					</div>

					{/* Feature highlights */}
					<div className="flex flex-wrap justify-center gap-4">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<ZapIcon className="w-4 h-4 text-primary" />
							Free Forever
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<ShieldIcon className="w-4 h-4 text-primary" />
							Privacy in your hands
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<CodeIcon className="w-4 h-4 text-primary" />
							Open Source
						</div>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-wrap justify-center gap-4">
						{supportedBrowser ? (
							<Button
								size="lg"
								className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
								Browser not supported
							</Button>
						)}

						<Button variant="outline" size="lg" asChild>
							<a
								href={env.NEXT_PUBLIC_GITHUB_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<StarIcon className="mr-2 size-5" />
								Star on GitHub
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
