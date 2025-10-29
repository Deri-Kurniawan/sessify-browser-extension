import type { FC, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ContentWrapperProps extends HTMLAttributes<HTMLDivElement> {}

const ContentWrapper: FC<ContentWrapperProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<main className={cn("flex flex-col flex-1", className)} {...props}>
			{children}
		</main>
	);
};

export default ContentWrapper;
