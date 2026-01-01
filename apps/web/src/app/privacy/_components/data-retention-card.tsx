import { CheckIcon } from "lucide-react";
import { IconWrapper, InfoCard } from "@/components/ui";
import { dataRetentionItems } from "./constants";

export function DataRetentionCard() {
  return (
    <InfoCard title="Data Retention">
      <div className="mb-4 flex items-center gap-3">
        <IconWrapper
          className="bg-amber-100 dark:bg-amber-900/20"
          icon={CheckIcon}
          iconClassName="text-amber-600 dark:text-amber-400"
          size="sm"
        />
      </div>
      <p className="mt-2 text-sm leading-relaxed">
        Your session data is stored locally on your device until you choose to
        delete it. You have full control over your data and can:
      </p>
      <ul className="mt-4 space-y-3">
        {dataRetentionItems.map((item) => (
          <li className="flex items-start gap-3" key={item}>
            <CheckIcon className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
            <span className="text-muted-foreground text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </InfoCard>
  );
}
