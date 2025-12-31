import {
  FeatureCard,
  GradientText,
  SectionContainer,
  SectionHeader,
} from "@/components/ui";
import { features } from "@/data/home-page-data";

export default function FeaturesSection() {
  return (
    <SectionContainer>
      <SectionHeader
        description="Everything you need to manage your browsing sessions efficiently and securely"
        title={
          <>
            Powerful Features for{" "}
            <GradientText>Better Productivity</GradientText>
          </>
        }
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
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
    </SectionContainer>
  );
}
