import { DatabaseIcon } from "lucide-react";
import { InfoList, SectionTitle } from "@/components/ui";
import { dataProtection } from "./constants";

export function DataProtectionSection() {
  return (
    <section>
      <SectionTitle
        icon={DatabaseIcon}
        iconColor="blue"
        title="How We Protect Your Data"
      />
      <InfoList iconColor="blue" items={dataProtection} />
    </section>
  );
}
