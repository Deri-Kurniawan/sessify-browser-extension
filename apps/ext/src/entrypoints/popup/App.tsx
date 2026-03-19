import type { ComponentProps } from "react";
import { ExtensionApp } from "@/app/entrypoints";

type AppProps = {
  launchType?: ComponentProps<typeof ExtensionApp>["launchType"];
};

export default function App({ launchType = "popup" }: AppProps) {
  return <ExtensionApp launchType={launchType} />;
}
