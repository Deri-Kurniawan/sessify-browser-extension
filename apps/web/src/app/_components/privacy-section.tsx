import { FeatureCard, SectionHeader } from "@/components/ui";
import { privacyFeatures } from "@/data/home-page-data";

export default function PrivacySection() {
  return (
    <section className="border-y bg-muted/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader
          description="Unlike other session managers that sync your data to the cloud, Sessify keeps everything 100% local. No accounts, no servers, no tracking. Just pure, privacy-respecting functionality."
          title="Your Data Never Leaves Your Device"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {privacyFeatures.map((feature) => (
            <FeatureCard
              bgColor={feature.bgColor}
              description={feature.description}
              icon={feature.icon}
              iconColor={feature.iconColor}
              key={feature.title}
              title={feature.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
