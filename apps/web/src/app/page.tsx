import type { Metadata } from "next";
import { headers } from "next/headers";
import pkg from "@/../package.json";
import FeaturesSection from "@/app/_components/features-section";
import HeroSection from "@/app/_components/hero-section";
import OpenSourceCTA from "@/app/_components/open-source-cta";
import PrivacySection from "@/app/_components/privacy-section";
import { env } from "@/env";

const title = "Sessify - Smart Browser Extension for Session Management";
const description =
  "Boost your productivity with Sessify, the ultimate browser extension for managing tabs and browsing sessions. Save, organize, restore, and synchronize your browser sessions across different contexts. Perfect for developers, researchers, and power users.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "browser extension",
    "session management",
    "productivity tool",
    "session saver",
    "browsing sessions",
    "session restoration",
    "browser productivity",
    "session restore",
    "session switcher",
    "browser utility",
    "tab synchronization",
    "workspace management",
  ],
  authors: [{ name: pkg.author.name }],
  creator: pkg.author.name,
  publisher: pkg.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title,
    description,
    url: env.NEXT_PUBLIC_APP_URL,
    siteName: "Sessify",
    images: [
      {
        url: `${env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        alt: "Sessify - Smart Browser Extension for Tab & Session Management",
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
    canonical: env.NEXT_PUBLIC_APP_URL,
  },
  category: "Technology",
  classification: "Browser Extension",
};

export default async function HomePage() {
  const headersList = await headers();
  const userBrowserType = headersList.get("x-browser") || "unknown";
  const device = headersList.get("x-device") || "desktop";
  const isDesktop = device === "desktop";

  return (
    <main>
      <HeroSection
        className="mx-auto max-w-6xl px-4"
        isDesktop={isDesktop}
        userBrowserType={userBrowserType}
      />
      <FeaturesSection />
      <PrivacySection />
      <OpenSourceCTA />
    </main>
  );
}
