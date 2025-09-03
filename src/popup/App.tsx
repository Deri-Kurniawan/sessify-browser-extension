import type { ComponentProps, FC } from "react";
import { createHashRouter, RouterProvider } from "react-router";
import RootLayout from "@/components/layouts/RootLayout";
import { SessionProvider } from "@/features/session/hooks/useSessions";
import SessionPage from "@/features/session/pages/SessionPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

interface AppProps {
	launchType?: ComponentProps<typeof RootLayout>["launchType"];
}

const App: FC<AppProps> = ({ launchType = "popup" }) => {
	const router = createHashRouter([
		{
			// biome-ignore lint/correctness/noNestedComponentDefinitions: router layout
			Component: (props) => <RootLayout {...props} launchType={launchType} />,
			children: [
				{
					path: "/",
					Component: SessionPage,
					index: true,
				},
				{
					path: "/settings",
					Component: SettingsPage,
				},
			],
		},
	]);

	return (
		<SessionProvider>
			<RouterProvider router={router} />
		</SessionProvider>
	);
};

export default App;
