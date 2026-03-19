import { cn } from "@sessify/ui/lib/utils";
import {
  createContext,
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useContext,
} from "react";

type PlaceholderProps = {
  title?: string;
  description?: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  children?: ReactNode;
};

const PlaceholderContext = createContext<{
  title?: string | null;
  description?: string | null;
}>({
  title: null,
  description: null,
});

const usePlaceholder = () => {
  const ctx = useContext(PlaceholderContext);
  if (!ctx) {
    throw new Error("usePlaceholder must be used within a PlaceholderProvider");
  }
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
          "flex flex-col items-center justify-center gap-2 p-8 text-center",
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
    <div className={cn("rounded-full bg-neutral-50 p-4", className)}>
      {children}
    </div>
  );
};

export const PlaceholderTitle: FC<{
  className?: string;
}> = ({ className = "" }) => {
  const { title } = usePlaceholder();
  return (
    <h3 className={cn("font-semibold text-gray-900 text-xl", className)}>
      {title}
    </h3>
  );
};

export const PlaceholderDescription: FC<{
  className?: string;
}> = ({ className = "" }) => {
  const { description } = usePlaceholder();
  return (
    <p className={cn("max-w-sm text-pretty text-gray-600", className)}>
      {description}
    </p>
  );
};

export default Placeholder;
