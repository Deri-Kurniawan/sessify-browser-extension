import { SettingsIcon, UsersIcon } from "lucide-react";
import type { FC, HTMLAttributes } from "react";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

interface NavBarProps extends HTMLAttributes<HTMLElement> {}

const NavBar: FC<NavBarProps> = ({ className, ...props }) => {
	const navLinks = [
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
	];

	return (
		<nav {...props} className={cn("w-full z-50", className)}>
			<ul className="flex justify-around">
				{navLinks.map((link, index) => (
					<li key={`${link.label}${index}`} className="size-full">
						<NavLink
							to={link.to}
							className={({ isActive }) =>
								cn(
									"flex flex-col items-center justify-center gap-1 p-4 bg-white cursor-pointer size-full hover:bg-neutral-100",
									isActive && "[&>span]:font-semibold bg-neutral-50",
								)
							}
						>
							{link.icon}
							<span className="text-sm">{link.label}</span>
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default NavBar;
