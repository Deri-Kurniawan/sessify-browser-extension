/// <reference types="chrome"/>

import { handleError } from "../utils";
import { BrowserTabs } from "./BrowserTabs";
import { Cookie } from "./Cookie";

/**
 * A utility class for managing site storage (localStorage, sessionStorage, cookies) in a Chrome Extension.
 * All methods are static and handle errors by logging and throwing custom errors.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: utility class
class SiteStorage {
	/**
	 * Retrieves storage data from the current active tab.
	 * @returns A promise that resolves to an object containing localStorage, sessionStorage, and cookies.
	 * @throws {SiteStorageError} If retrieval fails.
	 */
	static async getStorageFromCurrentTab(): Promise<{
		localStorage: Record<string, string>;
		sessionStorage: Record<string, string>;
		cookies: chrome.cookies.Cookie[];
	}> {
		try {
			const tab = await BrowserTabs.getCurrentActive();
			if (!tab?.id || !tab.url) {
				return { localStorage: {}, sessionStorage: {}, cookies: [] };
			}
			const [result] = await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: (): {
					localStorage: Record<string, string>;
					sessionStorage: Record<string, string>;
				} => ({
					localStorage: { ...localStorage },
					sessionStorage: { ...sessionStorage },
				}),
			});
			const cookies = await Cookie.getAll({ url: tab.url });
			return {
				localStorage: result?.result?.localStorage || {},
				sessionStorage: result?.result?.sessionStorage || {},
				cookies,
			};
		} catch (error) {
			handleError("getSiteStorageData", error);
			throw new SiteStorageError("Failed to retrieve site storage data", error);
		}
	}

	/**
	 * Clears all storage data for the current active tab.
	 * @throws {SiteStorageError} If clearing fails.
	 */
	static async clearStorageForCurrentTab(): Promise<void> {
		try {
			const tab = await BrowserTabs.getCurrentActive();
			if (!tab?.id || !tab.url) {
				return;
			}
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: (): void => {
					localStorage.clear();
					sessionStorage.clear();
				},
			});
			const cookies = await Cookie.getAll({ url: tab.url });
			await Cookie.removeMany(tab.url, cookies);
		} catch (error) {
			handleError("clearSiteStorageData", error);
			throw new SiteStorageError("Failed to clear site storage data", error);
		}
	}

	/**
	 * Applies storage data to the current active tab.
	 * @param state The storage state to apply.
	 * @throws {SiteStorageError} If applying fails.
	 */
	static async applyStorageToCurrentTab(state: {
		localStorage: Record<string, string>;
		sessionStorage: Record<string, string>;
		cookies: chrome.cookies.Cookie[];
	}): Promise<void> {
		try {
			const tab = await BrowserTabs.getCurrentActive();
			if (!tab?.id || !tab.url) {
				return;
			}

			const url = new URL(tab.url);

			await Promise.allSettled(
				(state.cookies || []).map((cookie) =>
					chrome.cookies.set({
						url: url.origin,
						name: cookie.name,
						value: cookie.value,
						domain: cookie.domain,
						path: cookie.path || "/",
						secure: cookie.secure || false,
						httpOnly: cookie.httpOnly || false,
						sameSite: cookie.sameSite || "lax",
						expirationDate: cookie.expirationDate,
					}),
				),
			);

			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				args: [state.localStorage, state.sessionStorage],
				func: (localData, sessionData) => {
					Object.entries(localData).forEach(([key, value]) => {
						localStorage.setItem(key, value);
					});
					Object.entries(sessionData).forEach(([key, value]) => {
						sessionStorage.setItem(key, value);
					});
				},
			});
		} catch (error) {
			handleError("applySiteStorageData", error);
			throw new SiteStorageError("Failed to apply site storage data", error);
		}
	}
}

/**
 * Custom error class for SiteStorage operations.
 */
class SiteStorageError extends Error {
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
		this.name = "SiteStorageError";
		this.cause = originalError;
	}
}

export { SiteStorage };
