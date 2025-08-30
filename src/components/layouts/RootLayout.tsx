import type { FC } from "react";
import { Outlet } from "react-router";
import NavBar from "../NavBar";
import { Toaster } from "../ui/sonner";

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
				<NavBar />
			</div>
			<Toaster position="top-right" richColors closeButton />
		</div>
	);
};

export default RootLayout;
