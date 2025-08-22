// import "@/styles/global.css"; // tailwindcss affecting the current webview styles

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./views/App.tsx";

const container = document.createElement("div");
container.id = "sessify-webview";
document.body.appendChild(container);
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
