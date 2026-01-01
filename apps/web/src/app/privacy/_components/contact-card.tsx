import { Button } from "@sessify/ui/components/button";
import { GithubIcon, MessageCircleMoreIcon } from "lucide-react";
import Link from "next/link";
import { InfoCard } from "@/components/ui";
import { env } from "@/env";

export function ContactCard() {
  return (
    <InfoCard
      description="If you have any questions about this privacy policy or our data practices, please reach out through one of these channels:"
      title="Contact Us"
    >
      <div className="mt-4 flex flex-col gap-2">
        <Button asChild className="justify-start" variant="outline">
          <Link className="inline-flex items-center gap-2" href="/feedback">
            <MessageCircleMoreIcon className="size-5 shrink-0" />
            Submit Feedback
          </Link>
        </Button>
        <Button asChild className="justify-start" variant="outline">
          <Link
            className="inline-flex items-center gap-2"
            href={env.NEXT_PUBLIC_GITHUB_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon className="size-5 shrink-0" />
            GitHub Repository
          </Link>
        </Button>
      </div>
    </InfoCard>
  );
}
