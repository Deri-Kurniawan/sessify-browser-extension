import type { ComponentProps } from "react";
import { createHashRouter } from "react-router";
import { SessionsPage } from "@/pages/sessions";
import { SettingsPage } from "@/pages/settings";
import RootLayout from "../layouts/root-layout";

export function createAppRouter(
  launchType: ComponentProps<typeof RootLayout>["launchType"] = "popup",
) {
  return createHashRouter([
    {
      Component: (props) => <RootLayout {...props} launchType={launchType} />,
      children: [
        {
          path: "/",
          Component: SessionsPage,
          index: true,
        },
        {
          path: "/settings",
          Component: SettingsPage,
        },
      ],
    },
  ]);
}
