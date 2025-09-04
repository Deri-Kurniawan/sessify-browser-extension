import { CodeIcon, HeartIcon, ShieldIcon } from "lucide-react";
import Image from "next/image";
import { FaChrome, FaEdge, FaGithub, FaOpera } from "react-icons/fa";
import { SiBrave, SiVivaldi } from "react-icons/si"; // not in react-icons/fa
import { TbWorldQuestion } from "react-icons/tb";
import extensionSidepanelSnapshot from "@/assets/images/extension-sidepanel-snapshot.png";
import { env } from "@/env";
import { Button } from "./ui/button";

const HeroSection = ({
	userBrowserType = "chrome",
}: {
	userBrowserType?: string;
}) => {
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

	const selectedBrowser =
		browserSupport.find((b) => b.name === userBrowserType) ??
		(userBrowserType === "unknown" ? browserSupport[0] : null);

	return (
		<section className="flex flex-col items-center justify-center">
			<div className="mt-16 lg:mt-32">
				<h1 className="text-2xl font-bold text-center lg:text-5xl">
					Sessify—Session Manager
				</h1>
				<p className="mt-4 text-lg text-center">
					No more repetitive logins—store sessions, swap in seconds.
				</p>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-4 mt-6">
				{selectedBrowser ? (
					<Button
						className="inline-flex items-center gap-2 rounded-full"
						asChild
						variant="outline"
					>
						<a
							href={selectedBrowser.storeUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							<span>{selectedBrowser.icon}</span>
							Add to <span className="capitalize">{selectedBrowser.name}</span>
						</a>
					</Button>
				) : (
					<Button
						className="inline-flex items-center gap-2 rounded-full"
						disabled
						variant="outline"
					>
						<TbWorldQuestion className="size-5" />
						<span>
							<span className="capitalize">{userBrowserType}</span> not
							supported
						</span>
					</Button>
				)}
				<Button
					className="inline-flex items-center gap-2 rounded-full"
					asChild
					variant="ghost"
				>
					<a
						href={env.PUBLIC_GITHUB_URL}
						target="_blank"
						rel="noopener noreferrer"
					>
						<FaGithub className="size-5" />
						Star on GitHub
					</a>
				</Button>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm">
				<div className="flex items-center gap-2">
					<HeartIcon className="w-4 h-4 text-green-500" />
					<span>Free Forever</span>
				</div>
				<div className="flex items-center gap-2">
					<ShieldIcon className="w-4 h-4 text-blue-500" />
					<span>Privacy in your hands</span>
				</div>
				<div className="flex items-center gap-2">
					<CodeIcon className="w-4 h-4 text-purple-500" />
					<span>Open Source</span>
				</div>
			</div>

			<div className="relative w-full mt-16 lg:mt-32 group">
				<div className="absolute transition-opacity duration-300 opacity-25 -inset-2 dark:-inset-8 dark:blur-xl dark:from-purple-900 dark:to-blue-900 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg group-hover:opacity-30" />
				<Image
					className="relative w-full border shadow rounded-2xl backdrop-blur-sm"
					src={extensionSidepanelSnapshot}
					alt="Sessify Extension Screenshot showing session management interface open in a browser side panel"
					width={1000}
					height={600}
					priority
					quality={100}
					placeholder="blur"
				/>
			</div>
		</section>
	);
};

export default HeroSection;
