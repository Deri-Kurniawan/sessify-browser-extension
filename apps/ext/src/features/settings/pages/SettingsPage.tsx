import { Button } from "@sessify/ui/components/button";
import { Settings2Icon } from "lucide-react";
import pkg from "@/../package.json";
import ContentWrapper from "@/components/ContentWrapper";
import Placeholder, {
  PlaceholderDescription,
  PlaceholderIcon,
  PlaceholderTitle,
} from "@/components/Placeholder";
import TopBar from "@/components/TopBar";

const SettingsPage = () => {
  return (
    <>
      <TopBar title="Settings" />
      <ContentWrapper className="flex items-center justify-center">
        <Placeholder
          description="Settings will be available in future updates. Stay tuned!"
          title="No settings available yet"
        >
          <PlaceholderIcon>
            <Settings2Icon className="size-12 text-gray-400" />
          </PlaceholderIcon>
          <PlaceholderTitle />
          <PlaceholderDescription />
          <Button asChild className="mt-4">
            <a
              href={pkg.repository.url}
              rel="noreferrer noopener"
              target="_blank"
            >
              View on GitHub
            </a>
          </Button>
        </Placeholder>
      </ContentWrapper>
    </>
  );
};

export default SettingsPage;
