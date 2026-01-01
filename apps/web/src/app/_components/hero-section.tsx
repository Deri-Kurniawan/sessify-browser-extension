import { Button } from "@sessify/ui/components/button";
import { cn } from "@sessify/ui/lib/utils";
import { ArrowRightIcon, GlobeIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import digitalIdentityIntegration from "@/assets/images/digital-identity-integration.webp";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { browserSupport } from "@/configs/browser-support";

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
    (b) => b.name === userBrowserType,
  );

  return (
    <section
      className={cn("relative overflow-hidden py-24 lg:py-32", className)}
    >
      <AnnouncementBanner />

      <div className="relative flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-6">
            <h1 className="mx-auto max-w-4xl text-balance font-bold text-4xl tracking-tight md:text-6xl lg:text-7xl">
              Stop the endless{" "}
              <span className="text-primary/80">login/logout loop.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
              Sessify manages your browser sessions efficiently. Save and switch
              between different browsing contexts, preserving cookies, local
              storage, and session data without losing your place.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            {supportedBrowser &&
            (isDesktop || supportedBrowser?.mobileSupport) ? (
              <Button
                asChild
                className="group bg-primary text-primary-foreground capitalize hover:bg-primary/90"
                size="lg"
              >
                <a
                  href={supportedBrowser?.storeUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {supportedBrowser?.icon}
                  Add to {supportedBrowser?.name}
                  <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
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
                href="https://youtu.be/qLa0dN7h3XE?si=HBVLc9Q6BPbHpo_E"
                rel="noopener noreferrer"
                target="_blank"
              >
                <PlayIcon className="size-4" />
                Learn in 5 minutes
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-1">
        <Image
          alt="Hero Background"
          className="size-full select-none rounded-lg object-cover object-center opacity-10"
          height={1080}
          priority
          quality={50}
          src={digitalIdentityIntegration}
          width={1920}
        />
      </div>
    </section>
  );
};

export default HeroSection;
