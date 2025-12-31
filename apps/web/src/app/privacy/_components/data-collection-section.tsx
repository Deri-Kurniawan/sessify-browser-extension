import { CheckIcon } from "lucide-react";
import { InfoList, SectionTitle } from "@/components/ui";
import { dataWeCollect } from "./constants";

export function DataCollectionSection() {
  return (
    <section>
      <SectionTitle
        icon={CheckIcon}
        iconColor="green"
        title="What Data We Collect"
      />
      <InfoList iconColor="green" items={dataWeCollect} />
    </section>
  );
}
