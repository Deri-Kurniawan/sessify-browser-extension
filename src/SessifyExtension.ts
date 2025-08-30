/// <reference types="chrome"/>
/// <reference path="./types/globals.d.ts"/>

import { CONFIGS } from "@/config";
import { BrowserTabs, SiteStorage, Storage } from "@/lib/utils";
import { handleError } from "./lib/utils";

class SessifyExtension {
  init(): void {
    chrome.runtime.setUninstallURL(
      chrome.runtime.getManifest().homepage_url as string
    );

    this._registerListeners();
  }

  private _registerListeners(): void {
    chrome.runtime.onInstalled.addListener(() => {
      console.log(`${chrome.runtime.getManifest().name} extension installed.`);
      if (!this._isChrome) {
        throw new SessifyExtensionError(
          "Only Chrome extensions are supported at this time"
        );
      }
    });

    chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
      (async () => {
        switch (message.action as EnumBackgroundAction) {
          case "GET_FILTERED_SESSIONS_BY_ACTIVE_TAB": {
            const currentTab = await BrowserTabs.getCurrentActive();

            if (!currentTab?.url) {
              SessifyExtension.sendResponse(
                sendResponse,
                false,
                "No active tab found"
              );
              return;
            }

            const url = new URL(currentTab.url);
            const sessions = await Storage.get<AppSession[]>(
              CONFIGS.SESSION_STORAGE.KEYS.SESSIONS
            );

            const filteredSessions = (
              sessions?.filter((s) => {
                // Match exact domain or subdomain
                const sessionDomain = s.domain.toLowerCase();
                const currentHost = url.hostname.toLowerCase();

                // Ensure that we match either the exact domain or subdomains, including different TLDs (Top Level Domains)
                return (
                  currentHost === sessionDomain ||
                  currentHost.endsWith(`.${sessionDomain}`) // Check subdomains
                );
              }) || []
            ).map((s) => ({
              ...s,
              appIconUrl: currentTab.favIconUrl || s.appIconUrl,
            }));

            SessifyExtension.sendResponse(
              sendResponse,
              true,
              "Sessions retrieved successfully",
              filteredSessions
            );
            break;
          }
          case "SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE": {
            const { title = null } = message.payload ?? {};

            const existingSessions = await Storage.get<AppSession[]>(
              "sessions"
            );
            const currentTab = await BrowserTabs.getCurrentActive();

            if (!currentTab?.url) {
              SessifyExtension.sendResponse(
                sendResponse,
                false,
                "No active tab found"
              );
              return;
            }

            const url = new URL(currentTab.url);
            const siteStorage = await SiteStorage.getStorageFromCurrentTab();
            const newSession: AppSession = {
              id: crypto.randomUUID(),
              appIconUrl: currentTab.favIconUrl || "/public/icon32.png",
              title: title || new Date().toLocaleString(),
              domain: url.host,
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
              updatedSessions
            );

            SessifyExtension.sendResponse(
              sendResponse,
              true,
              "Session saved successfully",
              newSession
            );
            break;
          }
          case "SWITCH_SESSION_BY_ID": {
            const { sessionId } = message.payload ?? {};

            if (!sessionId) {
              SessifyExtension.sendResponse(
                sendResponse,
                false,
                "No session ID provided"
              );
              return;
            }
            const existingSessions = await Storage.get<AppSession[]>(
              CONFIGS.SESSION_STORAGE.KEYS.SESSIONS
            );
            const session = existingSessions?.find((s) => s.id === sessionId);
            if (!session) {
              SessifyExtension.sendResponse(
                sendResponse,
                false,
                `Session with ID ${sessionId} not found`
              );
              return;
            }
            await SiteStorage.clearStorageForCurrentTab();
            await SiteStorage.applyStorageToCurrentTab(session.state);
            await Storage.set(
              CONFIGS.SESSION_STORAGE.KEYS.ACTIVE_SESSION_ID,
              sessionId
            );

            SessifyExtension.sendResponse(
              sendResponse,
              true,
              "Session switched successfully",
              sessionId
            );
            break;
          }
          case "DELETE_SESSION_BY_ID": {
            const { sessionId } = message.payload ?? {};
            if (!sessionId) {
              SessifyExtension.sendResponse(
                sendResponse,
                false,
                "No session ID provided"
              );
              return;
            }

            const existingSessions = await Storage.get<AppSession[]>(
              CONFIGS.SESSION_STORAGE.KEYS.SESSIONS
            );

            const updatedSessions = existingSessions?.filter(
              (s) => s.id !== sessionId
            );

            await Storage.set(
              CONFIGS.SESSION_STORAGE.KEYS.SESSIONS,
              updatedSessions || []
            );

            SessifyExtension.sendResponse(
              sendResponse,
              true,
              "Session deleted successfully",
              sessionId
            );
            break;
          }
          case "CREATE_NEW_SESSION": {
            const currentTab = await BrowserTabs.getCurrentActive();
            if (!currentTab?.id) {
              SessifyExtension.sendResponse(
                sendResponse,
                false,
                "No active tab found"
              );
              return;
            }
            await SiteStorage.clearStorageForCurrentTab();
            SessifyExtension.sendResponse(
              sendResponse,
              true,
              "New session created successfully"
            );
            break;
          }
          case "REFRESH_CURRENT_TAB": {
            const currentTab = await BrowserTabs.getCurrentActive();
            if (!currentTab?.id) {
              SessifyExtension.sendResponse(
                sendResponse,
                false,
                "No active tab found"
              );
              return;
            }
            await BrowserTabs.reload(currentTab.id);
            SessifyExtension.sendResponse(
              sendResponse,
              true,
              "Current tab refreshed successfully"
            );
            break;
          }
          case "GET_ACTIVE_SESSION": {
            const activeSessionId = await Storage.get<string>(
              CONFIGS.SESSION_STORAGE.KEYS.ACTIVE_SESSION_ID
            );
            SessifyExtension.sendResponse(
              sendResponse,
              true,
              "Active session ID retrieved successfully",
              activeSessionId || null
            );
            break;
          }
          default:
            throw new SessifyExtensionError(
              "Unknown action: " + message.action
            );
        }
      })().catch((error) => {
        const err = error instanceof Error ? error : new Error(String(error));
        handleError("handleMessageAsync", err);
        sendResponse({ success: false, message: err.message });
      });
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
      typeof chrome !== undefined && !!chrome.runtime && !!chrome.runtime.id
    );
  }

  static createResponse<T = unknown>(
    success: boolean,
    message: string,
    data?: T
  ): MessageResponse<T> {
    return { success, data, message };
  }

  static sendResponse<T = unknown>(
    sendResponse: (response: MessageResponse<T>) => void,
    success: boolean,
    message: string,
    data?: T
  ): void {
    sendResponse(this.createResponse(success, message, data));
  }
}

class SessifyExtensionError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "SessifyExtensionError";
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }
}

export { SessifyExtension };
