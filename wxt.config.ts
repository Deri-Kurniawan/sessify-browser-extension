import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";
import pkg from "./package.json";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	srcDir: "src",
	outDir: "dist",
	publicDir: "public",

	vite: () => ({
		plugins: [tailwindcss()],
	}),

	manifest: {
		manifest_version: 3,
		name: pkg.launcherName || pkg.name,
		description: pkg.description,
		author: {
			email: pkg.author.email,
		},
		homepage_url: pkg.homepage,
		version: pkg.version,
		permissions: [
			"sidePanel",
			"contentSettings",
			"cookies",
			"storage",
			"tabs",
			"activeTab",
			"scripting",
			"unlimitedStorage",
			"<all_urls>",
		],
		host_permissions: ["https://*/*", "http://*/*"],
		content_scripts: [
			{
				js: ["src/entrypoints/content.ts"],
				matches: ["http://*/*", "https://*/*"],
			},
		],

		/**
		 * Firefox
		 * @see https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/#when-do-you-need-an-add-on-id
		 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings
		 */
		browser_specific_settings: {
			gecko: {
				id: "@sessify-dev-extension-id",
				strict_min_version: "58.0",
				// https://extensionworkshop.com/documentation/manage/updating-your-extension/
				// "update_url": "https://example.com/updates.json"
			},
		},
	},
});
