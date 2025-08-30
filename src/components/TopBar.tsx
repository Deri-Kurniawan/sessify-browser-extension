import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface TopBarProps {
  title?: string;
  className?: string;
  children?: ReactNode;
}

const TopBar: FC<TopBarProps> = ({
  title = "Sessify",
  className = "",
  children,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between p-4 shadow z-10 bg-neutral-50 min-h-[68px]",
        className
      )}
    >
      <h1 className="text-xl font-semibold">{title}</h1>
      {children && <div className="flex gap-2">{children}</div>}
    </header>
  );
};

export default TopBar;
