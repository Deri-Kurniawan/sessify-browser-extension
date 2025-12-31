import { UserIcon } from "lucide-react";
import { InfoList, SectionTitle } from "@/components/ui";
import { dataWeDontCollect } from "./constants";

export function DataWeDontCollectSection() {
  return (
    <section>
      <SectionTitle
        icon={UserIcon}
        iconColor="red"
        title="What We Don't Collect"
      />
      <InfoList
        cardClassName="border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-900/5"
        iconColor="red"
        items={dataWeDontCollect}
      />
    </section>
  );
}
