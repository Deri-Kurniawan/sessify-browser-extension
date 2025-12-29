import { cn } from "@sessify/ui/lib/utils";
import type { FC, ReactNode } from "react";

type TopBarProps = {
	title?: string;
	className?: string;
	children?: ReactNode;
};

const TopBar: FC<TopBarProps> = ({
	title = "Sessify",
	className = "",
	children,
}) => {
	return (
		<header
			className={cn(
				"z-10 flex min-h-17 items-center justify-between bg-neutral-50 p-4 shadow",
				className,
			)}
		>
			<h1 className="font-semibold text-xl">{title}</h1>
			{children && <div className="flex gap-2">{children}</div>}
		</header>
	);
};

export default TopBar;
