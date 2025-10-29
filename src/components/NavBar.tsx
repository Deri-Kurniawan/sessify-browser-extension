import type { FC, HTMLAttributes } from "react";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

interface NavBarProps extends HTMLAttributes<HTMLElement> {
	data: {
		to: string;
		icon: React.ReactNode;
		label: string;
	}[];
}

const NavBar: FC<NavBarProps> = ({ data, className, ...props }) => {
	return (
		<nav {...props} className={cn("w-full z-50", className)}>
			<ul className="flex justify-around">
				{data.map((link, index) => (
					<li key={`${link.label}${index}`} className="size-full">
						<NavLink
							to={link.to}
							className={({ isActive }) =>
								cn(
									"flex flex-col items-center justify-center gap-1 p-4 size-full",
									"transition duration-150 ease-in-out",
									"bg-white hover:bg-neutral-100 text-primary/80 hover:text-primary/90",
									"cursor-pointer",
									isActive && "[&>span]:font-medium bg-neutral-50 text-primary",
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
