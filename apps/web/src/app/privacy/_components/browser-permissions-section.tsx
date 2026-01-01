import { CookieIcon } from "lucide-react";
import { InfoList, SectionTitle } from "@/components/ui";
import { browserPermissions } from "./constants";

export function BrowserPermissionsSection() {
  return (
    <section>
      <SectionTitle
        icon={CookieIcon}
        iconColor="purple"
        title="Browser Permissions"
      />
      <p className="mb-4 text-muted-foreground">
        Sessify requests the following browser permissions to function properly:
      </p>
      <InfoList iconColor="purple" items={browserPermissions} />
    </section>
  );
}
