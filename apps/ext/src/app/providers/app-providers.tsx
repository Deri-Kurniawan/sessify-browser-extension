import type { PropsWithChildren } from "react";
import { SessionManagementProvider } from "@/features/session-management";

export function AppProviders({
  children,
  watchTabChange = true,
}: PropsWithChildren<{ watchTabChange?: boolean }>) {
  return (
    <SessionManagementProvider watchTabChange={watchTabChange}>
      {children}
    </SessionManagementProvider>
  );
}
