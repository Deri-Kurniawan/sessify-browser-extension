import { Button } from "@sessify/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sessify/ui/components/card";
import { ArrowRightIcon, CodeIcon, StarIcon, ThumbsUpIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { GradientText, SectionContainer } from "@/components/ui";
import { getFeedbackOptions } from "@/data/feedback-page-data";
import { env } from "@/env";

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

type FeedbackPageProps = {
  searchParams?: Promise<{
    ref?: "uninstall";
  }>;
};

export default async function FeedbackPage({
  searchParams,
}: FeedbackPageProps) {
  const params = await searchParams;
  const isUninstall = params?.ref === "uninstall";

  const feedbackOptions = getFeedbackOptions(isUninstall);

  return (
    <SectionContainer size="md">
      <div className="text-center">
        <h1 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
          {isUninstall ? (
            <>
              We're sorry to see <GradientText>you go</GradientText>
            </>
          ) : (
            <>
              We'd love to hear <GradientText>from you</GradientText>
            </>
          )}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground text-xl leading-relaxed">
          {isUninstall
            ? "Your feedback helps us understand what didn't work and how we can make Sessify better for everyone."
            : "Share your thoughts, report bugs, request features, or just say hello. Every piece of feedback helps us build a better extension."}
        </p>
      </div>

      <div className="mt-16">
        <div className="space-y-6">
          <div className="rounded-xl border bg-muted/50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <ThumbsUpIcon className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Privacy First</h3>
                <p className="mt-1 text-muted-foreground text-sm">
                  All feedback is public on GitHub. Please don't include any
                  sensitive information like passwords or personal data.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {feedbackOptions.map((option) => (
              <Card key={option.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${option.bgColor}`}
                    >
                      <option.icon
                        className={`size-5 shrink-0 ${option.iconColor}`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="group w-full" variant="outline">
                    <Link
                      href={option.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {option.buttonText}
                      <ArrowRightIcon className="ml-auto size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
          <CardContent className="p-12 text-center">
            <h2 className="font-bold text-3xl">Love Sessify?</h2>
            <p className="mx-auto mt-3 max-w-md text-lg text-muted-foreground">
              Help us spread the word by starring our repository on GitHub
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="min-w-[200px]" size="lg">
                <a
                  href={env.NEXT_PUBLIC_GITHUB_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <StarIcon className="size-5 shrink-0" />
                  Star on GitHub
                </a>
              </Button>
              <Button
                asChild
                className="min-w-[200px]"
                size="lg"
                variant="outline"
              >
                <a
                  href={`${env.NEXT_PUBLIC_GITHUB_URL}/fork`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <CodeIcon className="size-5 shrink-0" />
                  Fork Repository
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  );
}
