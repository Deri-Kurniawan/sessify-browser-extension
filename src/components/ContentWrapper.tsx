import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface ContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

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
