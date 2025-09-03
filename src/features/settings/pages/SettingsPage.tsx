import { Settings2Icon } from "lucide-react";
import pkg from "@/../package.json";
import ContentWrapper from "@/components/ContentWrapper";
import Placeholder, {
	PlaceholderDescription,
	PlaceholderIcon,
	PlaceholderTitle,
} from "@/components/Placeholder";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
	return (
		<>
			<TopBar title="Settings" />
			<ContentWrapper className="flex items-center justify-center">
				<Placeholder
					title="No settings available yet"
					description="Settings will be available in future updates. Stay tuned!"
				>
					<PlaceholderIcon>
						<Settings2Icon className="text-gray-400 size-12" />
					</PlaceholderIcon>
					<PlaceholderTitle />
					<PlaceholderDescription />
					<Button asChild className="mt-4">
						<a
							href={pkg.repository.url}
							target="_blank"
							rel="noreferrer noopener"
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
