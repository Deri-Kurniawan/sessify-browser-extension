import {
	createContext,
	type FC,
	type HTMLAttributes,
	type ReactNode,
	useContext,
} from "react";
import { cn } from "@/lib/utils";

interface PlaceholderProps {
	icon?: ReactNode;
	title?: string;
	description?: string;
	className?: HTMLAttributes<HTMLDivElement>["className"];
	children?: ReactNode;
}

const PlaceholderContext = createContext<{
	title?: string | null;
	description?: string | null;
}>({
	title: null,
	description: null,
});

const usePlaceholder = () => {
	const ctx = useContext(PlaceholderContext);
	if (!ctx)
		throw new Error("usePlaceholder must be used within a PlaceholderProvider");
	return ctx;
};

const Placeholder: FC<PlaceholderProps> = ({
	title,
	description,
	className = "",
	children,
}) => {
	return (
		<PlaceholderContext.Provider value={{ title, description }}>
			<div
				className={cn(
					"flex flex-col items-center justify-center p-8 text-center gap-2",
					className,
				)}
			>
				{children}
			</div>
		</PlaceholderContext.Provider>
	);
};

export const PlaceholderIcon: FC<{
	children: ReactNode;
	className?: string;
}> = ({ children, className = "" }) => {
	return (
		<div className={cn("p-4 rounded-full bg-neutral-50", className)}>
			{children}
		</div>
	);
};

export const PlaceholderTitle: FC<{
	children?: ReactNode;
	className?: string;
}> = ({ className = "" }) => {
	const { title } = usePlaceholder();
	return (
		<h3 className={cn("text-xl font-semibold text-gray-900", className)}>
			{title}
		</h3>
	);
};

export const PlaceholderDescription: FC<{
	children?: ReactNode;
	className?: string;
}> = ({ className = "" }) => {
	const { description } = usePlaceholder();
	return (
		<p className={cn("max-w-sm text-gray-600 text-pretty", className)}>
			{description}
		</p>
	);
};

export default Placeholder;
