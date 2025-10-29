import { SettingsIcon, UsersIcon } from "lucide-react";
import type { FC } from "react";
import { Outlet } from "react-router";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/Sonner";

interface RootLayoutProps {
	launchType?: "popup" | "sidepanel";
}

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
			<div className="flex flex-col h-screen">
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
			<Toaster position="top-right" richColors closeButton />
		</div>
	);
};

export default RootLayout;
