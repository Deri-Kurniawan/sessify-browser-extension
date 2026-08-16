import React from "react";
import ReactDOM from "react-dom/client";
import ExtensionApp from "./extension-app";

import "@/styles/globals.css";
import "@sessify/ui/styles/index";

export function mountExtensionApp(
  rootId: string,
  launchType: "popup" | "sidepanel",
) {
  ReactDOM.createRoot(document.getElementById(rootId) as HTMLElement).render(
    <React.StrictMode>
      <ExtensionApp launchType={launchType} />
    </React.StrictMode>,
  );
}
