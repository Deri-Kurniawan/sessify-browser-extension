import React from "react";
import ReactDOM from "react-dom/client";
import "@sessify/ui/styles/index";
import "@/styles/globals.css";
import ExtensionApp from "./extension-app";

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
