import { cn } from "@sessify/ui/lib/utils";
import type { FC, HTMLAttributes } from "react";
import { NavLink } from "react-router";

interface NavBarProps extends HTMLAttributes<HTMLElement> {
	data: {
		to: string;
		icon: React.ReactNode;
		label: string;
	}[];
}

const NavBar: FC<NavBarProps> = ({ data, className, ...props }) => {
	return (
		<nav {...props} className={cn("z-50 w-full", className)}>
			<ul className="flex justify-around">
				{data.map((link, index) => (
					<li className="size-full" key={`${link.label}${index}`}>
						<NavLink
							className={({ isActive }) =>
								cn(
									"flex size-full flex-col items-center justify-center gap-1 p-4",
									"transition duration-150 ease-in-out",
									"bg-white text-primary/80 hover:bg-neutral-100 hover:text-primary/90",
									"cursor-pointer",
									isActive && "bg-neutral-50 text-primary [&>span]:font-medium",
								)
							}
							to={link.to}
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
