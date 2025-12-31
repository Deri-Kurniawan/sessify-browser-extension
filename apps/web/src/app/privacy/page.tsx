import type { Metadata } from "next";
import { env } from "@/env";
import {
  BrowserPermissionsSection,
  ContactCard,
  DataCollectionSection,
  DataProtectionSection,
  DataRetentionCard,
  DataWeDontCollectSection,
  PolicyUpdatesCard,
  PrivacyHeader,
  PrivacyHighlights,
} from "./_components";

const title = "Privacy Policy - Sessify Browser Extension";
const description =
  "Learn how Sessify protects your privacy with local-only data storage, no tracking, and complete transparency about data handling.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Sessify privacy policy",
    "browser extension privacy",
    "data protection",
    "local storage",
    "no tracking",
    "privacy first",
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
    url: `${env.NEXT_PUBLIC_APP_URL}/privacy`,
    siteName: "Sessify",
    images: [
      {
        url: `${env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        alt: "Sessify Privacy Policy - Browser Extension",
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
    canonical: `${env.NEXT_PUBLIC_APP_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6 lg:py-32">
      <PrivacyHeader />

      <PrivacyHighlights />

      <div className="mt-24 grid gap-12 lg:grid-cols-2">
        <div className="space-y-12">
          <DataCollectionSection />
          <DataProtectionSection />
        </div>

        <div className="space-y-12">
          <DataWeDontCollectSection />
          <BrowserPermissionsSection />
        </div>
      </div>

      <div className="mt-16 space-y-8">
        <DataRetentionCard />

        <div className="grid gap-8 lg:grid-cols-2">
          <PolicyUpdatesCard />
          <ContactCard />
        </div>

        <p className="mt-4 text-center text-muted-foreground text-sm">
          Last updated: {lastUpdated}
        </p>
      </div>
    </main>
  );
}
