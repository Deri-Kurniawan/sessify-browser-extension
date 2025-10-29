import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import { env } from "@/env";
import pkg from "../../package.json";

const title = "Sessify - Smart Browser Extension for Session Management";
const description =
  "Boost your productivity with Sessify, the ultimate browser extension for managing tabs and browsing sessions. Save, organize, restore, and synchronize your browser sessions across devices. Perfect for developers, researchers, and power users.";

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

interface HomePageProps {
  searchParams?: Promise<{
    browser?: string;
    device?: "mobile" | "desktop";
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const userBrowserType = params?.browser;
  const isDesktop = params?.device === "desktop";
  return (
    <div className="container w-full px-4 mx-auto">
      <div className="my-20">
        <HeroSection
          className="max-w-6xl mx-auto"
          userBrowserType={userBrowserType}
          isDesktop={isDesktop}
        />
      </div>
    </div>
  );
}
