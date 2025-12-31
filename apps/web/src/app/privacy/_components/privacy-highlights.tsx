import { FeatureCard } from "@/components/ui";
import { privacyHighlights } from "./constants";

export function PrivacyHighlights() {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {privacyHighlights.map((highlight) => (
        <FeatureCard
          bgColor={highlight.bgColor}
          description={highlight.description}
          icon={highlight.icon}
          iconColor={highlight.iconColor}
          key={highlight.title}
          title={highlight.title}
        />
      ))}
    </div>
  );
}
