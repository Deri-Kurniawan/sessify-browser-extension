import { handleError } from "../utils";
import { BrowserTabs } from "./BrowserTabs";
import { Cookie } from "./Cookie";

/**
 * A helper class for managing site storage (localStorage, sessionStorage, cookies) in a Chrome Extension.
 *
 * environment: Site Context (injected script)
 */

// biome-ignore lint/complexity/noStaticOnlyClass: utility class
class SiteStorage {
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
			await Cookie.removeMany(
				tab.url,
				cookies.map((cookie) => ({
					...cookie,
					url: `http${cookie.secure ? "s" : ""}://${cookie.domain.replace(
						/^\./,
						"",
					)}${cookie.path}`,
				})),
			);
		} catch (error) {
			handleError("clearSiteStorageData", error);
			throw new SiteStorageError("Failed to clear site storage data", error);
		}
	}

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
						sameSite: cookie.sameSite || "Lax",
						expirationDate: cookie.expirationDate,
					}),
				),
			);

			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				args: [state.localStorage, state.sessionStorage],
				func: (localData, sessionData) => {
					try {
						Object.entries(localData).forEach(([key, value]) => {
							localStorage.setItem(key, value);
						});
						Object.entries(sessionData).forEach(([key, value]) => {
							sessionStorage.setItem(key, value);
						});
					} catch (err) {
						handleError("restoreStorages", err);
					}
				},
			});
		} catch {
			throw new SiteStorageError("Failed to apply site storage data");
		}
	}
}

class SiteStorageError extends Error {
	constructor(
		message: string,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "SiteStorageError";
		if (originalError instanceof Error) {
			this.stack = originalError.stack;
		}
	}
}

export { SiteStorage };
