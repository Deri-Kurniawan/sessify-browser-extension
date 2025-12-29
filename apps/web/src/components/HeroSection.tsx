import { Badge } from "@sessify/ui/components/badge";
import { Button } from "@sessify/ui/components/button";
import { cn } from "@sessify/ui/lib/utils";
import {
  CodeIcon,
  FileCode2Icon,
  GlobeIcon,
  ShieldIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import extensionSidepanelSnapshot from "@/assets/images/extension-sidepanel-snapshot.png";
import { browserSupport } from "@/configs/browser-support";
import { env } from "@/env";

const HeroSection = ({
  userBrowserType = "chrome",
  isDesktop = true,
  className = "",
}: {
  userBrowserType?: string;
  isDesktop?: boolean;
  className?: string;
}) => {
  const supportedBrowser = browserSupport.find(
    (b) => b.name === userBrowserType
  );

  return (
    <section className={cn("relative overflow-hidden", className)}>
      <div className="grid items-center gap-12 lg:grid-cols-1">
        {/* Content */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="w-fit" variant="secondary">
              <ShieldIcon className="size-3" />
              Privacy First
            </Badge>

            <div>
              <h1 className="text-pretty font-semibold text-4xl tracking-tight md:text-5xl">
                Sessify—
                <span className="text-primary">Session Manager</span>
              </h1>

              <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
                No more repetitive logins—store sessions, swap in seconds.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <ZapIcon className="size-4 text-primary" />
              Free Forever
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <ShieldIcon className="size-4 text-primary" />
              Privacy in your hands
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <CodeIcon className="size-4 text-primary" />
              Open Source
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {supportedBrowser &&
            (isDesktop || supportedBrowser?.mobileSupport) ? (
              <Button
                asChild
                className="bg-primary text-primary-foreground capitalize hover:bg-primary/90"
                size="lg"
              >
                <a
                  href={supportedBrowser?.storeUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {supportedBrowser?.icon}
                  Add to {supportedBrowser?.name}
                </a>
              </Button>
            ) : (
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled
                size="lg"
              >
                <GlobeIcon className="size-5" />
                {isDesktop ? "Unsupported Browser" : "Unsupported on Mobile"}
              </Button>
            )}

            <Button asChild size="lg" variant="outline">
              <a
                href={`${env.NEXT_PUBLIC_GITHUB_URL}/releases`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FileCode2Icon className="size-5" />
                GitHub Release
              </a>
            </Button>
          </div>
        </div>

        {/* Visual Element */}
        <div className="overflow-hidden rounded-lg border shadow">
          <Image
            alt="Sessify Extension Sidepanel Snapshot"
            className="rounded-lg shadow-lg"
            priority
            src={extensionSidepanelSnapshot}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
