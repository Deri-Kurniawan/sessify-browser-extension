import { Button } from "@sessify/ui/components/button";
import { Card, CardContent } from "@sessify/ui/components/card";
import { GithubIcon, HandshakeIcon } from "lucide-react";
import Link from "next/link";
import { SectionContainer } from "@/components/ui";
import { env } from "@/env";

export default function OpenSourceCTA() {
  return (
    <SectionContainer>
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
        <CardContent className="p-8 text-center md:p-12">
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Built in the Open
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Sessify is completely open source. Review the code, contribute
            features, report bugs, or fork it to create your own version.
            Transparency is at our core.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="min-w-[200px]" size="lg">
              <a
                href={env.NEXT_PUBLIC_GITHUB_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GithubIcon className="size-5 shrink-0" />
                View on GitHub
              </a>
            </Button>
            <Button
              asChild
              className="min-w-[200px]"
              size="lg"
              variant="outline"
            >
              <Link href="/feedback">
                <HandshakeIcon className="size-5 shrink-0" />
                Contribute
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </SectionContainer>
  );
}
