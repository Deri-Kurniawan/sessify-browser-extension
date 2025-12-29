import { SettingsIcon, UsersIcon } from "lucide-react";
import type { FC } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";

type RootLayoutProps = {
	launchType?: "popup" | "sidepanel";
};

const RootLayout: FC<RootLayoutProps> = ({ launchType = "sidepanel" }) => {
	const containerClass = (() => {
		switch (launchType) {
			case "popup":
				return "w-full min-w-[380px] min-h-[600px] max-w-[380px]";
			default:
				return "w-full";
		}
	})();

	return (
		<div className={containerClass}>
			<div className="flex h-screen flex-col">
				<Outlet />
				<NavBar
					data={[
						{
							to: "/",
							icon: <UsersIcon className="size-6" />,
							label: "Sessions",
						},
						{
							to: "/settings",
							icon: <SettingsIcon className="size-6" />,
							label: "Settings",
						},
					]}
				/>
			</div>
			<Toaster closeButton position="top-right" richColors />
		</div>
	);
};

export default RootLayout;
