import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
	manifest_version: 3,
	name: pkg.launcherName || pkg.name,
	description: pkg.description,
	author: {
		email: pkg.author.email,
	},
	homepage_url: pkg.homepage || "",
	version: pkg.version,
	icons: {
		16: "public/icon16.png",
		32: "public/icon32.png",
		48: "public/icon48.png",
		128: "public/icon128.png",
	},
	action: {
		default_icon: {
			16: "public/icon16.png",
			32: "public/icon32.png",
			48: "public/icon48.png",
			128: "public/icon128.png",
		},
		default_popup: "src/popup/index.html",
	},
	background: {
		service_worker: "src/background/background.ts",
	},
	permissions: [
		"sidePanel",
		"contentSettings",
		"cookies",
		"storage",
		"tabs",
		"activeTab",
		"scripting",
		"unlimitedStorage",
	],
	host_permissions: ["https://*/*", "http://*/*"],
	content_scripts: [
		{
			js: ["src/content/main.tsx"],
			matches: ["http://*/*", "https://*/*"],
		},
	],
	side_panel: {
		default_path: "src/sidepanel/index.html",
	},
	options_page: "src/options/index.html",
});
