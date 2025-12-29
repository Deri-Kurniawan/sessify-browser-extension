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
		author: pkg.author.name as any,
		homepage_url: pkg.homepage,
		version: pkg.version,
		version_name: pkg.version_name || pkg.version,
		permissions: [
			"sidePanel",
			"cookies",
			"storage",
			"tabs",
			"activeTab",
			"scripting",
			"unlimitedStorage",
			/**
			 * Caution: Using "<all_urls>" permission may lead to your extension being rejected during the review process for some browsers.
			 * 
			 * Publisher restrictions:
			 * - [Opera Add-on Store]: Manifest V3 extensions require URL permissions to only be present in the"host_permissions" field, please move them there: {''}
			 */
			"<all_urls>",
		],
		host_permissions: ["https://*/*", "http://*/*"],
		content_scripts: [
			{
				js: ["content-scripts/content.js"],
				matches: ["http://*/*", "https://*/*"],
			},
		],
		commands: {
			"toggle-feature": {
				suggested_key: {
					default: "Alt+Shift+S",
					windows: "Alt+Shift+S",
					linux: "Alt+Shift+S",
					mac: "Command+Shift+S",
					chromeos: "Alt+Shift+S",
				},
				description: "Toggle feature",
			},
		},

		/**
		 * Firefox
		 * @see https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/#when-do-you-need-an-add-on-id
		 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings
		 */
		browser_specific_settings: {
			gecko: {
				id: "{65005012-da8c-4536-9b03-6248965f257d}",
				strict_min_version: "58.0",
				// https://extensionworkshop.com/documentation/manage/updating-your-extension/
				// "update_url": "https://example.com/updates.json"
			},
		},

		/**
		 * Other browsers (Chrome, Edge, Opera, Vivaldi, Brave, etc.)
		 */
		sidebar_action: {
			default_panel: "sidepanel.html",
			default_icon: {
				16: "icons/16.png",
				32: "icons/32.png",
				48: "icons/48.png",
				128: "icons/128.png",
			},
			default_title: "Sessify",
		},
	},
});
