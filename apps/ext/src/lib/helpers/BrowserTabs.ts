import { type Browser, browser } from "#imports";
import { traceError } from "@/lib/utils";

/**
 * A utility class for managing browser tabs using the Chrome Extensions API.
 * All methods are static and handle errors by logging and throwing custom errors.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: utility class
class BrowserTabs {
	/**
	 * Retrieves the currently active tab in the current window.
	 * @returns A promise that resolves to the active tab or null if none found.
	 * @throws {BrowserTabsError} If the query fails.
	 */
	static async getCurrentActive(): Promise<Browser.tabs.Tab | null> {
		try {
			const tabs = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			return tabs.length > 0 ? tabs[0] : null;
		} catch (error) {
			traceError("getCurrentActiveTab", error);
			throw new BrowserTabsError("Failed to get current active tab", error);
		}
	}

	/**
	 * Reloads the specified tab.
	 * @param tabId The ID of the tab to reload.
	 * @throws {BrowserTabsError} If the reload fails.
	 */
	static async reload(tabId: number): Promise<void> {
		try {
			await browser.tabs.reload(tabId);
		} catch (error) {
			traceError("reloadTab", error);
			throw new BrowserTabsError(`Failed to reload tab ${tabId}`, error);
		}
	}

	/**
	 * Closes the specified tab.
	 * @param tabId The ID of the tab to close.
	 * @throws {BrowserTabsError} If the close fails.
	 */
	static async close(tabId: number): Promise<void> {
		try {
			await browser.tabs.remove(tabId);
		} catch (error) {
			traceError("closeTab", error);
			throw new BrowserTabsError(`Failed to close tab ${tabId}`, error);
		}
	}

	/**
	 * Creates a new tab with the specified URL.
	 * @param url The URL to open in the new tab.
	 * @returns A promise that resolves to the created tab.
	 * @throws {BrowserTabsError} If the creation fails.
	 */
	static async create(url: string): Promise<Browser.tabs.Tab> {
		try {
			const tab = await browser.tabs.create({ url });
			return tab;
		} catch (error) {
			traceError("createTab", error);
			throw new BrowserTabsError(`Failed to create tab with URL ${url}`, error);
		}
	}
}

/**
 * Custom error class for BrowserTabs operations.
 */
class BrowserTabsError extends Error {
	public cause?: unknown;

	/**
	 * @param message The error message.
	 * @param originalError The original error that caused this error.
	 */
	constructor(
		message: string,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "BrowserTabsError";
		this.cause = originalError;
	}
}

export { BrowserTabs };
