/// <reference types="chrome"/>
/// <reference path="../types/globals.d.ts"/>

import moment from "moment";
import { parse as tldtsParse } from "tldts";
import { CONFIGS } from "@/config";
import { BrowserTabs, SiteStorage, Storage } from "../lib/helpers";
import { handleError } from "../lib/utils";

/**
 * Main class for managing the Sessify Chrome extension background operations.
 */
class SessifyExtension {
	private static readonly ALLOWED_PROTOCOLS_ARRAY = ["http:", "https:"];
	private static readonly IP_ADDRESS_REGEX = /^\d{1,3}(\.\d{1,3}){3}$/;
	private static readonly EXACT_MATCH_SCORE = 1;
	private static readonly NO_MATCH_SCORE = 0;
	private static readonly ERROR_MESSAGES = {
		NO_ACTIVE_TAB: "No active tab found",
		INVALID_URL: "Session management is not supported on non-http/https pages.",
		UNSUPPORTED_PROTOCOL:
			"Session management is only supported for http, https, and localhost pages.",
		UNSUPPORTED_PAGE_TYPE:
			"Saving session on this type of page is not supported.",
		NO_SESSION_ID: "No session ID provided",
		SESSION_NOT_FOUND: (id: string) => `Session with ID ${id} not found`,
		UPDATE_FAILED: "Update failed. Session not found",
		UNKNOWN_ACTION: (action: string) => `Unknown action: ${action}`,
	} as const;

	/**
	 * Initializes the extension services.
	 */
	init(): void {
		chrome.runtime.setUninstallURL(
			chrome.runtime.getManifest().homepage_url as string,
		);

		chrome.action.setBadgeTextColor({
			color: CONFIGS.BADGE.COLORS.TEXT.DEFAULT,
		});
		chrome.action.setBadgeBackgroundColor({
			color: CONFIGS.BADGE.COLORS.BACKGROUND.ACTIVE,
		});

		this._registerEventListeners();
		this._updateBadgeForActiveTab();
	}

	/**
	 * Registers all Chrome extension event listeners.
	 */
	private _registerEventListeners(): void {
		chrome.runtime.onInstalled.addListener(() => {
			console.log(`${chrome.runtime.getManifest().name} extension installed.`);
			if (!this._isRunningInChrome) {
				throw new SessifyExtensionError(
					"Only Chrome extensions are supported at this time",
				);
			}
		});

		chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
			this._handleMessageAsync(request, sendResponse);

			/**
			 * Returning true is required for asynchronous processing.
			 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
			 */
			return true;
		});

		chrome.tabs.onActivated.addListener(() => this._updateBadgeForActiveTab());
		chrome.tabs.onUpdated.addListener(() => this._updateBadgeForActiveTab());
	}

	/**
	 * Handles incoming messages asynchronously.
	 */
	private async _handleMessageAsync(
		request: any,
		sendResponse: (response: MessageResponse) => void,
	): Promise<boolean> {
		let apiResponse: MessageResponse | null = null;

		try {
			apiResponse = await this._processRequest(request);
		} catch (error) {
			const processedError =
				error instanceof Error ? error : new Error(String(error));
			handleError("handleMessageAsync", processedError);
			apiResponse = { success: false, message: processedError.message };
		}

		if (apiResponse) {
			SessifyExtension.sendResponse(
				sendResponse,
				apiResponse.success,
				apiResponse.message,
				apiResponse.data,
			);
		}

		/**
		 * Returning true is required for asynchronous processing.
		 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
		 */
		return true;
	}

	/**
	 * Processes the incoming request and returns appropriate response.
	 */
	private async _processRequest(request: any): Promise<MessageResponse> {
		switch (request.action as EnumBackgroundAction) {
			case "GET_FILTERED_SESSIONS_BY_ACTIVE_TAB":
				return await this._handleGetFilteredSessions();

			case "SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE":
				return await this._handleSaveCurrentTabStorage(request.payload);

			case "SWITCH_SESSION_BY_ID":
				return await this._handleSwitchSession(request.payload);

			case "UPDATE_SESSION_BY_ID":
				return await this._handleUpdateSession(request.payload);

			case "DELETE_SESSION_BY_ID":
				return await this._handleDeleteSession(request.payload);

			case "CREATE_NEW_SESSION":
				return await this._handleCreateNewSession();

			case "REFRESH_CURRENT_TAB":
				return await this._handleRefreshCurrentTab();

			case "GET_ACTIVE_SESSION":
				return await this._handleGetActiveSession();

			default:
				throw new SessifyExtensionError(
					SessifyExtension.ERROR_MESSAGES.UNKNOWN_ACTION(request.action),
				);
		}
	}

	/**
	 * Handles getting filtered sessions for the active tab.
	 */
	private async _handleGetFilteredSessions(): Promise<
		MessageResponse<AppSession[]>
	> {
		const activeTabUrl = await this._validateAndGetActiveTabUrl();
		const allSessions = await this._getAllSessions();
		const matchingSessions = this._filterSessionsForUrl(
			activeTabUrl,
			allSessions,
		);
		const activeTab = await BrowserTabs.getCurrentActive();

		const sortedSessions = this._sortSessionsByRelevance(
			matchingSessions,
			activeTabUrl,
			activeTab,
		);

		this._updateBadgeForActiveTab();

		return {
			success: true,
			message: "Sessions retrieved successfully",
			data: sortedSessions,
		};
	}

	/**
	 * Handles saving current tab storage to extension storage.
	 */
	private async _handleSaveCurrentTabStorage(payload: {
		title?: string;
	}): Promise<MessageResponse<AppSession>> {
		const { title = null } = payload ?? {};
		const currentTab = await BrowserTabs.getCurrentActive();

		if (!currentTab?.url) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.NO_ACTIVE_TAB,
			};
		}

		const tabUrl = new URL(currentTab.url);

		if (
			!SessifyExtension.ALLOWED_PROTOCOLS_ARRAY.includes(tabUrl.protocol as any)
		) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.UNSUPPORTED_PAGE_TYPE,
			};
		}

		const tabStorage = await this._getTabStorageSafely();

		if (!tabStorage) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.UNSUPPORTED_PAGE_TYPE,
			};
		}

		const newSession = await this._createNewSession(
			currentTab,
			tabUrl,
			title,
			tabStorage,
		);
		await this._saveSessionToStorage(newSession);

		this._updateBadgeForActiveTab();

		return {
			success: true,
			message: "Session saved successfully",
			data: newSession,
		};
	}

	/**
	 * Handles switching to a specific session by ID.
	 */
	private async _handleSwitchSession(payload: {
		sessionId?: string;
		title?: string;
	}): Promise<MessageResponse<string>> {
		const { sessionId } = payload ?? {};

		if (!sessionId) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.NO_SESSION_ID,
			};
		}

		const existingSessions = await this._getAllSessions();
		const targetSession = existingSessions?.find(
			(session) => session.id === sessionId,
		);

		if (!targetSession) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.SESSION_NOT_FOUND(sessionId),
			};
		}

		await SiteStorage.clearStorageForCurrentTab();
		await SiteStorage.applyStorageToCurrentTab(targetSession.state);
		await Storage.set(
			CONFIGS.SESSION_STORAGE.KEYS.ACTIVE_SESSION_ID,
			sessionId,
		);

		this._updateBadgeForActiveTab();

		return {
			success: true,
			message: "Session switched successfully",
			data: sessionId,
		};
	}

	/**
	 * Handles updating a session by ID.
	 */
	private async _handleUpdateSession(payload: {
		sessionId?: string;
		title?: string;
	}): Promise<MessageResponse<AppSession>> {
		const { sessionId, title = moment().format("MMM D, YYYY, h:mm:ss") } =
			payload ?? {};

		if (!sessionId) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.NO_SESSION_ID,
			};
		}

		const existingSessions = await this._getAllSessions();
		const sessionIndex = existingSessions?.findIndex(
			(session) => session.id === sessionId,
		);

		if (!sessionIndex || sessionIndex === -1) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.UPDATE_FAILED,
			};
		}

		const updatedSession = {
			...existingSessions![sessionIndex],
			title,
			updatedAt: Date.now(),
		};

		const updatedSessions = [...(existingSessions || [])];
		updatedSessions[sessionIndex] = updatedSession;

		await Storage.set(CONFIGS.SESSION_STORAGE.KEYS.SESSIONS, updatedSessions);

		this._updateBadgeForActiveTab();

		return {
			success: true,
			message: "Session updated successfully",
			data: updatedSession,
		};
	}

	/**
	 * Handles deleting a session by ID.
	 */
	private async _handleDeleteSession(payload: {
		sessionId?: string;
		title?: string;
	}): Promise<MessageResponse<string>> {
		const { sessionId } = payload ?? {};

		if (!sessionId) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.NO_SESSION_ID,
			};
		}

		const existingSessions = await this._getAllSessions();
		const filteredSessions = existingSessions?.filter(
			(session) => session.id !== sessionId,
		);

		await Storage.set(
			CONFIGS.SESSION_STORAGE.KEYS.SESSIONS,
			filteredSessions || [],
		);

		this._updateBadgeForActiveTab();

		return {
			success: true,
			message: "Session deleted successfully",
			data: sessionId,
		};
	}

	/**
	 * Handles creating a new session.
	 */
	private async _handleCreateNewSession(): Promise<MessageResponse> {
		const currentTab = await BrowserTabs.getCurrentActive();

		if (!currentTab?.id) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.NO_ACTIVE_TAB,
			};
		}

		await SiteStorage.clearStorageForCurrentTab();
		await Storage.remove(CONFIGS.SESSION_STORAGE.KEYS.ACTIVE_SESSION_ID);

		this._updateBadgeForActiveTab();

		return {
			success: true,
			message: "New session created successfully",
		};
	}

	/**
	 * Handles refreshing the current tab.
	 */
	private async _handleRefreshCurrentTab(): Promise<MessageResponse> {
		const currentTab = await BrowserTabs.getCurrentActive();

		if (!currentTab?.id) {
			return {
				success: false,
				message: SessifyExtension.ERROR_MESSAGES.NO_ACTIVE_TAB,
			};
		}

		await BrowserTabs.reload(currentTab.id);

		return {
			success: true,
			message: "Current tab refreshed successfully",
		};
	}

	/**
	 * Handles getting the active session ID.
	 */
	private async _handleGetActiveSession(): Promise<
		MessageResponse<string | null>
	> {
		const activeSessionId = await Storage.get<string>(
			CONFIGS.SESSION_STORAGE.KEYS.ACTIVE_SESSION_ID,
		);

		return {
			success: true,
			message: "Active session ID retrieved successfully",
			data: activeSessionId || null,
		};
	}

	/**
	 * Safely gets tab storage, handling potential errors.
	 */
	private async _getTabStorageSafely(): Promise<Awaited<
		ReturnType<typeof SiteStorage.getStorageFromCurrentTab>
	> | null> {
		try {
			return await SiteStorage.getStorageFromCurrentTab();
		} catch (error) {
			handleError("getSiteStorageFromCurrentTab", error);
			return null;
		}
	}

	/**
	 * Creates a new session object.
	 */
	private async _createNewSession(
		currentTab: chrome.tabs.Tab,
		tabUrl: URL,
		title: string | null,
		tabStorage: Awaited<
			ReturnType<typeof SiteStorage.getStorageFromCurrentTab>
		>,
	): Promise<AppSession> {
		const parsedDomain = tldtsParse(currentTab.url!);

		return {
			id: crypto.randomUUID(),
			appIconUrl: currentTab.favIconUrl || "/public/icon32.png",
			title: title || moment().format("MMM D, YYYY, h:mm:ss"),
			domain: {
				domain: parsedDomain.domain || "",
				subdomain: parsedDomain.subdomain || "",
				sld: parsedDomain.domainWithoutSuffix || "",
				tld: parsedDomain.publicSuffix || "",
				fqdn: parsedDomain.hostname || tabUrl.hostname,
				isIp: parsedDomain.isIp || false,
				isIcann: parsedDomain.isIcann || false,
			},
			createdAt: Date.now(),
			updatedAt: Date.now(),
			state: {
				localStorage: tabStorage.localStorage,
				sessionStorage: tabStorage.sessionStorage,
				cookies: tabStorage.cookies,
			},
		};
	}

	/**
	 * Saves a session to storage and sets it as active.
	 */
	private async _saveSessionToStorage(newSession: AppSession): Promise<void> {
		const existingSessions = await this._getAllSessions();
		const updatedSessions = existingSessions
			? [...existingSessions, newSession]
			: [newSession];

		await Storage.set(CONFIGS.SESSION_STORAGE.KEYS.SESSIONS, updatedSessions);
		await Storage.set(
			CONFIGS.SESSION_STORAGE.KEYS.ACTIVE_SESSION_ID,
			newSession.id,
		);
	}

	/**
	 * Sorts sessions by relevance (exact FQDN match first, then by creation date).
	 */
	private _sortSessionsByRelevance(
		sessions: AppSession[],
		activeTabUrl: URL,
		activeTab: chrome.tabs.Tab | null,
	): AppSession[] {
		return sessions
			.map((session) => {
				// Only update appIconUrl if exact FQDN match
				if (activeTabUrl.hostname === session.domain.fqdn) {
					return {
						...session,
						appIconUrl: activeTab?.favIconUrl || session.appIconUrl,
					};
				}
				return session;
			})
			.sort((sessionA, sessionB) => {
				const sessionAIsExactMatch =
					sessionA.domain.fqdn === activeTabUrl.hostname
						? SessifyExtension.EXACT_MATCH_SCORE
						: SessifyExtension.NO_MATCH_SCORE;
				const sessionBIsExactMatch =
					sessionB.domain.fqdn === activeTabUrl.hostname
						? SessifyExtension.EXACT_MATCH_SCORE
						: SessifyExtension.NO_MATCH_SCORE;

				if (sessionAIsExactMatch !== sessionBIsExactMatch) {
					return sessionBIsExactMatch - sessionAIsExactMatch; // exact domain match first
				}
				return sessionB.createdAt - sessionA.createdAt; // newest first
			});
	}

	/**
	 * Checks if the extension is running in Chrome.
	 */
	private get _isRunningInChrome(): boolean {
		return (
			typeof chrome !== "undefined" && !!chrome.runtime && !!chrome.runtime.id
		);
	}

	/**
	 * Updates the badge text based on the number of sessions for the current tab.
	 */
	private _updateBadgeForActiveTab(): void {
		(async () => {
			try {
				const activeTabUrl = await this._validateAndGetActiveTabUrl();
				const allSessions = await this._getAllSessions();
				const matchingSessions = this._filterSessionsForUrl(
					activeTabUrl,
					allSessions,
				);

				if (matchingSessions.length === 0) {
					chrome.action.setBadgeText({ text: "" });
					return;
				}

				const badgeText =
					matchingSessions.length > CONFIGS.BADGE.MAX_COUNT
						? `${CONFIGS.BADGE.MAX_COUNT}+`
						: matchingSessions.length.toString();

				chrome.action.setBadgeText({ text: badgeText });
			} catch (error) {
				handleError("_updateBadgeForActiveTab", error);
				chrome.action.setBadgeText({ text: "" });
			}
		})();
	}

	/**
	 * Retrieves and validates the current active tab's URL.
	 * @returns A promise that resolves to the validated URL.
	 * @throws {SessifyExtensionError} If no tab, invalid URL, or unsupported protocol.
	 */
	private async _validateAndGetActiveTabUrl(): Promise<URL> {
		const activeTab = await BrowserTabs.getCurrentActive();
		if (!activeTab?.url) {
			throw new SessifyExtensionError(
				SessifyExtension.ERROR_MESSAGES.NO_ACTIVE_TAB,
			);
		}

		let parsedUrl: URL;
		try {
			parsedUrl = new URL(activeTab.url);
		} catch {
			throw new SessifyExtensionError(
				SessifyExtension.ERROR_MESSAGES.INVALID_URL,
			);
		}

		if (
			!SessifyExtension.ALLOWED_PROTOCOLS_ARRAY.includes(
				parsedUrl.protocol as any,
			) &&
			parsedUrl.hostname !== "localhost"
		) {
			throw new SessifyExtensionError(
				SessifyExtension.ERROR_MESSAGES.UNSUPPORTED_PROTOCOL,
			);
		}

		return parsedUrl;
	}

	/**
	 * Retrieves all sessions from storage.
	 * @returns A promise that resolves to the array of sessions.
	 */
	private async _getAllSessions(): Promise<AppSession[]> {
		return (
			(await Storage.get<AppSession[]>(
				CONFIGS.SESSION_STORAGE.KEYS.SESSIONS,
			)) || []
		);
	}

	/**
	 * Filters sessions that match the given URL.
	 * @param targetUrl The URL to match sessions against.
	 * @param sessions The sessions to filter.
	 * @returns The filtered array of sessions.
	 */
	private _filterSessionsForUrl(
		targetUrl: URL,
		sessions: AppSession[],
	): AppSession[] {
		return sessions.filter((session) => {
			const targetHostname = targetUrl.hostname;

			// Handle localhost
			if (
				targetHostname === "localhost" &&
				session.domain.sld === "localhost"
			) {
				return true;
			}

			// Handle IP addresses
			if (SessifyExtension.IP_ADDRESS_REGEX.test(targetHostname)) {
				return targetHostname === session.domain.fqdn;
			}

			const sessionDomain = session.domain.domain.toLowerCase();
			const targetDomain =
				tldtsParse(targetHostname).domain?.toLowerCase() || "";

			if (targetDomain === sessionDomain) return true;
			if (targetHostname.endsWith(`.${sessionDomain}`)) return true;

			return false;
		});
	}

	/**
	 * Creates a response object.
	 * @param success Whether the operation was successful.
	 * @param message The response message.
	 * @param data Optional data to include.
	 * @returns The response object.
	 */
	static createResponse<T = unknown>(
		success: boolean,
		message: string,
		data?: T,
	): MessageResponse<T> {
		return { success, data, message };
	}

	/**
	 * Sends a response using the provided sendResponse function.
	 * @param sendResponse The function to send the response.
	 * @param success Whether the operation was successful.
	 * @param message The response message.
	 * @param data Optional data to include.
	 */
	static sendResponse<T = unknown>(
		sendResponse: (response: MessageResponse<T>) => void,
		success: boolean,
		message: string,
		data?: T,
	): void {
		sendResponse(SessifyExtension.createResponse(success, message, data));
	}
}

/**
 * Custom error class for SessifyExtension operations.
 */
export class SessifyExtensionError extends Error {
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
		this.name = "SessifyExtensionError";
		this.cause = originalError;
	}
}

export { SessifyExtension };
