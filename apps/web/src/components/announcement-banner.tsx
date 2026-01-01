import { Badge } from "@sessify/ui/components/badge";
import { ArrowRightIcon, PartyPopperIcon, RocketIcon } from "lucide-react";
import Link from "next/link";
import { env } from "@/env";
import { getLatestRelease } from "@/lib/github";

export async function AnnouncementBanner() {
  try {
    const release = await getLatestRelease();

    if (!release) {
      return (
        <div className="relative mb-8 flex justify-center">
          <AnnouncementBadge icon={PartyPopperIcon} text="Announcing Sessify" />
        </div>
      );
    }

    const version = release.tag_name.startsWith("v")
      ? release.tag_name.slice(1)
      : release.tag_name;

    const releaseDate = new Date(release.published_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isRecent = releaseDate > thirtyDaysAgo;

    return (
      <div className="relative mb-8 flex justify-center">
        <AnnouncementBadge
          href={release.html_url}
          icon={isRecent ? PartyPopperIcon : RocketIcon}
          text={`${isRecent ? "🎉 New Release" : "Latest"} Sessify v${version}`}
        />
      </div>
    );
  } catch {
    return (
      <div className="relative mb-8 flex justify-center">
        <AnnouncementBadge
          href={env.NEXT_PUBLIC_GITHUB_URL}
          icon={PartyPopperIcon}
          isError
          text="Announcing Sessify"
        />
      </div>
    );
  }
}

const AnnouncementBadge = ({
  isError = false,
  text,
  icon: Icon,
  href,
}: {
  isError?: boolean;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}) => {
  const badge = (
    <Badge
      className={`group cursor-pointer ${
        isError
          ? "border-destructive/20 bg-destructive/5"
          : "border-primary/20 bg-primary/5"
      } px-4 py-2 text-sm`}
      variant="outline"
    >
      <Icon className="mr-2 size-4" />
      {text}
      <ArrowRightIcon className="ml-2 size-3 transition-transform group-hover:translate-x-0.5" />
    </Badge>
  );

  if (href) {
    return (
      <Link href={href} rel="noopener noreferrer" target="_blank">
        {badge}
      </Link>
    );
  }

  return badge;
};
