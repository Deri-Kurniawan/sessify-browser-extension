import type { ComponentProps } from "react";
import { RouterProvider } from "react-router";
import type RootLayout from "@/app/layouts/root-layout";
import { AppProviders } from "@/app/providers";
import { createAppRouter } from "@/app/router";

type ExtensionAppProps = {
  launchType?: ComponentProps<typeof RootLayout>["launchType"];
};

export default function ExtensionApp({
  launchType = "popup",
}: ExtensionAppProps) {
  const router = createAppRouter(launchType);

  return (
    <AppProviders watchTabChange={launchType === "sidepanel"}>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
