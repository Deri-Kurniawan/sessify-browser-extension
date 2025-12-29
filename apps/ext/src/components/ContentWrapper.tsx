import { cn } from "@sessify/ui/lib/utils";
import type { FC, HTMLAttributes } from "react";

interface ContentWrapperProps extends HTMLAttributes<HTMLDivElement> {}

const ContentWrapper: FC<ContentWrapperProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<main className={cn("flex flex-1 flex-col", className)} {...props}>
			{children}
		</main>
	);
};

export default ContentWrapper;
