import { GithubIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import extensionSidepanelSnapshot from "@/assets/images/extension-sidepanel-snapshot.png";
import { Button } from "@/components/ui/Button";
import { env } from "@/env";
import { cn } from "@/lib/utils";

const title = "Feedback & Support - Sessify Browser Extension";
const description =
	"Share your feedback, report bugs, or request features for Sessify. Help us improve the browser extension for better session management experience.";

export const metadata: Metadata = {
	title,
	description,
	keywords: [
		"Sessify feedback",
		"browser extension support",
		"bug report",
		"feature request",
		"session management feedback",
		"browser extension help",
	],
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	openGraph: {
		title,
		description,
		url: `${env.NEXT_PUBLIC_APP_URL}/feedback`,
		siteName: "Sessify",
		images: [
			{
				url: `${env.NEXT_PUBLIC_APP_URL}/og-image.png`,
				alt: "Sessify Feedback & Support - Browser Extension",
				width: 1200,
				height: 630,
			},
		],
		locale: "en-US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: [`${env.NEXT_PUBLIC_APP_URL}/og-image.png`],
	},
	alternates: {
		canonical: `${env.NEXT_PUBLIC_APP_URL}/feedback`,
	},
};

interface FeedbackPageProps {
	searchParams?: Promise<{
		ref?: "uninstall";
	}>;
}

export default async function FeedbackPage({
	searchParams,
}: FeedbackPageProps) {
	const params = await searchParams;
	const isUninstall = params?.ref === "uninstall";

	return (
		<div className="container w-full px-4 mx-auto">
			<main className="mx-auto max-w-5xl px-6 py-12">
				<header className="mb-10">
					<h1
						className={cn(
							"text-pretty text-4xl font-semibold tracking-tight md:text-5xl",
						)}
					>
						{isUninstall ? "Sorry to see you go :'(" : "Share your feedback"}
					</h1>
					<p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
						{isUninstall
							? "We'd love to understand what didn’t work. Your feedback helps us improve."
							: "Tell us what you think, request features, or report bugs. Choose Discussion for open conversation or Issue for actionable work."}
					</p>
				</header>

				<section className="grid gap-8 md:grid-cols-2">
					<div className="order-2 md:order-1">
						<div className="rounded-xl border bg-secondary p-4 text-sm text-secondary-foreground">
							<p className="font-medium">
								{isUninstall
									? "We’re sorry to see you uninstall Sessify."
									: "We appreciate your feedback!"}
							</p>
							<p className="mt-1">
								This options below will open a new tab to GitHub. Please do not
								include any sensitive information.
							</p>
						</div>
						<div className="flex flex-col gap-2 mt-4 sm:flex-row">
							<Button className="w-full sm:w-auto" asChild>
								<Link
									href={{
										pathname: `${env.NEXT_PUBLIC_GITHUB_URL}/issues/new/choose`,
										query: isUninstall
											? {
													title: "Uninstalling Sessify",
													body: `**Reason for uninstalling:**\n\n- \n\n**Additional feedback:**\n\n- `,
													labels: "uninstall",
												}
											: { title: "", body: "", labels: "feedback" },
									}}
									target="_blank"
									rel="noopener noreferrer"
								>
									<GithubIcon className="size-4" />
									GitHub Issue
								</Link>
							</Button>
						</div>
					</div>

					<aside className="order-1 md:order-2">
						<div className="overflow-hidden rounded-xl border bg-card">
							<Image
								src={extensionSidepanelSnapshot}
								alt="Sessify interface preview"
								width={1200}
								height={720}
								className="h-auto w-full"
								priority
							/>
						</div>
					</aside>
				</section>
			</main>
		</div>
	);
}
