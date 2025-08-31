/// <reference types="chrome"/>
/// <reference path="../types/globals.d.ts"/>

import moment from "moment";
import { parse as tldtsParse } from "tldts";
import { CONFIGS } from "@/config";
import { BrowserTabs, SiteStorage, Storage } from "@/lib/utils";
import { handleError } from "../lib/utils";

class SessifyExtension {
	init(): void {
		chrome.runtime.setUninstallURL(
			chrome.runtime.getManifest().homepage_url as string,
		);

		this._registerListeners();
	}

	private _registerListeners(): void {
		chrome.runtime.onInstalled.addListener(() => {
			console.log(`${chrome.runtime.getManifest().name} extension installed.`);
			if (!this._isChrome) {
				throw new SessifyExtensionError(
					"Only Chrome extensions are supported at this time",
				);
			}
		});

		chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
			(async () => {
				let response: MessageResponse | null = null;
				try {
					switch (message.action as EnumBackgroundAction) {
						case "GET_FILTERED_SESSIONS_BY_ACTIVE_TAB": {
							const currentTab = await BrowserTabs.getCurrentActive();
							if (!currentTab?.url) {
								response = { success: false, message: "No active tab found" };
								break;
							}
							const url = new URL(currentTab.url);
							const sessions = await Storage.get<AppSession[]>(
								CONFIGS.SESSION_STORAGE.KEYS.SESSIONS,
							);
							const filteredSessions = (
								sessions?.filter((s) => {
									const currentHost = url.hostname;

									// Handle localhost
									if (
										currentHost === "localhost" &&
										s.domain.sld === "localhost"
									) {
										return true;
									}

									// Handle IP addresses
									if (/^\d{1,3}(\.\d{1,3}){3}$/.test(currentHost)) {
										return currentHost === s.domain.fqdn;
									}

									const sessionRegistered = s.domain.domain.toLowerCase();
									const currentRegistered =
										tldtsParse(currentHost).domain?.toLowerCase() || "";

									if (currentRegistered === sessionRegistered) return true;
									if (currentHost.endsWith(`.${sessionRegistered}`))
										return true;

									return false;
								}) || []
							)
								.map((session) => {
									// Only update appIconUrl if exact FQDN match
									if (url.hostname === session.domain.fqdn) {
										return {
											...session,
											appIconUrl: currentTab.favIconUrl || session.appIconUrl,
										};
									}
									return session;
								})
								// sort: exact fqdn match first, then by createdAt desc
								.sort((a, b) => {
									const aExact = a.domain.fqdn === url.hostname ? 1 : 0;
									const bExact = b.domain.fqdn === url.hostname ? 1 : 0;

									if (aExact !== bExact) {
										return bExact - aExact; // exact domain match first
									}
									return b.createdAt - a.createdAt; // newest first
								});

							response = {
								success: true,
								message: "Sessions retrieved successfully",
								data: filteredSessions,
							};
							break;
						}
						case "SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE": {
							const { title = null } = message.payload ?? {};
							const existingSessions =
								await Storage.get<AppSession[]>("sessions");
							const currentTab = await BrowserTabs.getCurrentActive();
							if (!currentTab?.url) {
								response = { success: false, message: "No active tab found" };
								break;
							}
							const url = new URL(currentTab.url);
							const siteStorage = await SiteStorage.getStorageFromCurrentTab();
							const parsed = tldtsParse(currentTab.url);
							const newSession: AppSession = {
								id: crypto.randomUUID(),
								appIconUrl: currentTab.favIconUrl || "/public/icon32.png",
								title: title || moment().format("MMM D, YYYY, h:mm:ss"),
								domain: {
									domain: parsed.domain || "",
									subdomain: parsed.subdomain || "",
									sld: parsed.domainWithoutSuffix || "",
									tld: parsed.publicSuffix || "",
									fqdn: parsed.hostname || url.hostname,
									isIp: parsed.isIp || false,
									isIcann: parsed.isIcann || false,
								},
								createdAt: Date.now(),
								updatedAt: Date.now(),
								state: {
									localStorage: siteStorage.localStorage,
									sessionStorage: siteStorage.sessionStorage,
									cookies: siteStorage.cookies,
								},
							};
							const updatedSessions = existingSessions
								? [...existingSessions, newSession]
								: [newSession];
							await Storage.set(
								CONFIGS.SESSION_STORAGE.KEYS.SESSIONS,
								updatedSessions,
							);
							response = {
								success: true,
								message: "Session saved successfully",
								data: newSession,
							};
							break;
						}
						case "SWITCH_SESSION_BY_ID": {
							const { sessionId } = message.payload ?? {};
							if (!sessionId) {
								response = {
									success: false,
									message: "No session ID provided",
								};
								break;
							}
							const existingSessions = await Storage.get<AppSession[]>(
								CONFIGS.SESSION_STORAGE.KEYS.SESSIONS,
							);
							const session = existingSessions?.find((s) => s.id === sessionId);
							if (!session) {
								response = {
									success: false,
									message: `Session with ID ${sessionId} not found`,
								};
								break;
							}
							await SiteStorage.clearStorageForCurrentTab();
							await SiteStorage.applyStorageToCurrentTab(session.state);
							await Storage.set(
								CONFIGS.SESSION_STORAGE.KEYS.ACTIVE_SESSION_ID,
								sessionId,
							);
							response = {
								success: true,
								message: "Session switched successfully",
								data: sessionId,
							};
							break;
						}
						case "DELETE_SESSION_BY_ID": {
							const { sessionId } = message.payload ?? {};
							if (!sessionId) {
								response = {
									success: false,
									message: "No session ID provided",
								};
								break;
							}
							const existingSessions = await Storage.get<AppSession[]>(
								CONFIGS.SESSION_STORAGE.KEYS.SESSIONS,
							);
							const updatedSessions = existingSessions?.filter(
								(s) => s.id !== sessionId,
							);
							await Storage.set(
								CONFIGS.SESSION_STORAGE.KEYS.SESSIONS,
								updatedSessions || [],
							);
							response = {
								success: true,
								message: "Session deleted successfully",
								data: sessionId,
							};
							break;
						}
						case "CREATE_NEW_SESSION": {
							const currentTab = await BrowserTabs.getCurrentActive();
							if (!currentTab?.id) {
								response = { success: false, message: "No active tab found" };
								break;
							}
							await SiteStorage.clearStorageForCurrentTab();
							response = {
								success: true,
								message: "New session created successfully",
							};
							break;
						}
						case "REFRESH_CURRENT_TAB": {
							const currentTab = await BrowserTabs.getCurrentActive();
							if (!currentTab?.id) {
								response = { success: false, message: "No active tab found" };
								break;
							}
							await BrowserTabs.reload(currentTab.id);
							response = {
								success: true,
								message: "Current tab refreshed successfully",
							};
							break;
						}
						case "GET_ACTIVE_SESSION": {
							const activeSessionId = await Storage.get<string>(
								CONFIGS.SESSION_STORAGE.KEYS.ACTIVE_SESSION_ID,
							);
							response = {
								success: true,
								message: "Active session ID retrieved successfully",
								data: activeSessionId || null,
							};
							break;
						}
						default:
							throw new SessifyExtensionError(
								`Unknown action: ${message.action}`,
							);
					}
				} catch (error) {
					const err = error instanceof Error ? error : new Error(String(error));
					handleError("handleMessageAsync", err);
					response = { success: false, message: err.message };
				}
				if (response) {
					SessifyExtension.sendResponse(
						sendResponse,
						response.success,
						response.message,
						response.data,
					);
				}
			})();
			/**
			 * Returning true is required when you want to send a response asynchronously.
			 * This keeps the message channel open for the response.
			 * and you'll see: "The message port closed before a response was received.".
			 *
			 * Reference:
			 * @see https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
			 * @see https://stackoverflow.com/q/54126343
			 *
			 */
			return true;
		});
	}

	private get _isChrome(): boolean {
		return (
			typeof chrome !== "undefined" && !!chrome.runtime && !!chrome.runtime.id
		);
	}

	static createResponse<T = unknown>(
		success: boolean,
		message: string,
		data?: T,
	): MessageResponse<T> {
		return { success, data, message };
	}

	static sendResponse<T = unknown>(
		sendResponse: (response: MessageResponse<T>) => void,
		success: boolean,
		message: string,
		data?: T,
	): void {
		sendResponse(SessifyExtension.createResponse(success, message, data));
	}
}

class SessifyExtensionError extends Error {
	constructor(
		message: string,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "SessifyExtensionError";
		if (originalError instanceof Error) {
			this.stack = originalError.stack;
		}
	}
}

export { SessifyExtension };
