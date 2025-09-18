import type { Metadata } from "next";
import { FooterSection } from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import { env } from "@/env";

const title = "Sessify - Browser Extension for Session Management";
const description =
	"Sessify is a browser extension that helps you manage your browsing sessions effectively. Save, organize, and restore your tabs with ease.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description,
		url: env.NEXT_PUBLIC_APP_URL,
		siteName: "Sessify",
		images: [
			{
				url: `${env.NEXT_PUBLIC_APP_URL}/og-image.png`,
				alt: "Sessify - Browser Extension for Session Management",
				width: 1200,
				height: 630,
			},
		],
		locale: "en-US",
		type: "website",
	},
};

interface HomePageProps {
	searchParams?: Promise<{
		browser?: string;
	}>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
	const params = await searchParams;
	const userBrowserType = params?.browser;
	return (
		<div className="container w-full px-4 mx-auto">
			<div className="mt-20">
				<HeroSection userBrowserType={userBrowserType} />
			</div>
			<FooterSection className="mt-6" />
		</div>
	);
}
