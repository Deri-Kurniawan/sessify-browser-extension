import moment from "moment";
import { parse as tldtsParse } from "tldts";
import { browser } from "#imports";
import {
  createSession,
  filterSessionsForUrl,
  type Session,
  sortSessionsByRelevance,
} from "@/entities/session";
import type { MessageResponse } from "@/shared/api/background-client";
import { extensionConfig } from "@/shared/config";
import {
  applyStorageToCurrentTab,
  browserActionApi,
  clearStorageForCurrentTab,
  getCurrentActiveTab,
  getStorageFromCurrentTab,
  getStorageValue,
  reloadTab,
  removeStorageValue,
  setStorageValue,
  traceError,
} from "@/shared/lib";

const ALLOWED_PROTOCOLS = ["http:", "https:"];
const IP_ADDRESS_REGEX = /^\d{1,3}(\.\d{1,3}){3}$/;

const errorMessages = {
  noActiveTab: "No active tab found",
  invalidUrl: "Session management is not supported on non-http/https pages.",
  unsupportedProtocol:
    "Session management is only supported for http, https, and localhost pages.",
  unsupportedPageType: "Saving session on this type of page is not supported.",
  noSessionId: "No session ID provided",
  sessionNotFound: (sessionId: string) =>
    `Session with ID ${sessionId} not found`,
  updateFailed: "Update failed. Session not found",
  unknownAction: (action: string) => `Unknown action: ${action}`,
} as const;

export class SessionManagementError extends Error {
  public cause?: unknown;

  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "SessionManagementError";
    this.cause = originalError;
  }
}

export async function initializeSessionManagement(): Promise<void> {
  browserActionApi.setBadgeBackgroundColor({
    color: extensionConfig.settings.default.badgeColor,
  });
  browserActionApi.setBadgeTextColor({
    color: extensionConfig.settings.default.badgeTextColor,
  });

  await syncActiveTabBadge();
}

export function registerStorageDefaults(): void {
  storage.defineItem(`local:${extensionConfig.keys.activeSessionId}`, {
    init: () => "",
  });
  storage.defineItem(`local:${extensionConfig.keys.sessions}`, {
    init: () => [],
  });
  storage.defineItem(`sync:${extensionConfig.keys.settings}`, {
    init: () => ({
      ...extensionConfig.settings.default,
    }),
  });
}

export async function listSessionsForActiveTab(): Promise<
  MessageResponse<Session[]>
> {
  try {
    const activeTabUrl = await requireSupportedActiveTabUrl();
    const storedSessions = await readStoredSessions();
    const matchingSessions = filterSessionsForUrl(activeTabUrl, storedSessions);
    const activeTab = await getCurrentActiveTab();

    const sortedSessions = sortSessionsByRelevance(
      matchingSessions,
      activeTabUrl,
      activeTab,
    );

    await syncActiveTabBadge();

    return {
      success: true,
      message: "Sessions retrieved successfully",
      data: sortedSessions,
    };
  } catch (error) {
    if (error instanceof SessionManagementError) {
      await syncActiveTabBadge();
      return {
        success: true,
        message: "No sessions available for this page type",
        data: [],
      };
    }

    throw error;
  }
}

export async function saveActiveTabSession(payload?: {
  title?: string;
}): Promise<MessageResponse<Session>> {
  const { title = null } = payload ?? {};
  const currentTab = await getCurrentActiveTab();

  if (!currentTab?.url) {
    return { success: false, message: errorMessages.noActiveTab };
  }

  const currentTabUrl = new URL(currentTab.url);

  if (!ALLOWED_PROTOCOLS.includes(currentTabUrl.protocol)) {
    return { success: false, message: errorMessages.unsupportedPageType };
  }

  const activeTabStorage = await readActiveTabStorageSafely();

  if (!activeTabStorage) {
    return { success: false, message: errorMessages.unsupportedPageType };
  }

  const newSession = createSession(
    currentTab,
    currentTabUrl,
    activeTabStorage,
    title,
  );
  await writeSession(newSession);
  await syncActiveTabBadge();

  return {
    success: true,
    message: "Session saved successfully",
    data: newSession,
  };
}

export async function activateSession(payload?: {
  sessionId?: string;
}): Promise<MessageResponse<string>> {
  const { sessionId } = payload ?? {};

  if (!sessionId) {
    return { success: false, message: errorMessages.noSessionId };
  }

  const storedSessions = await readStoredSessions();
  const targetSession = storedSessions.find(
    (session) => session.id === sessionId,
  );

  if (!targetSession) {
    return {
      success: false,
      message: errorMessages.sessionNotFound(sessionId),
    };
  }

  const currentTab = await getCurrentActiveTab();

  if (!(currentTab?.id && currentTab.url)) {
    return { success: false, message: errorMessages.noActiveTab };
  }

  const navigationMessage = await navigateToSessionIfNeeded(
    currentTab,
    targetSession,
  );

  await clearStorageForCurrentTab();
  await applyStorageToCurrentTab(targetSession.state);
  await setStorageValue(extensionConfig.keys.activeSessionId, sessionId);
  await syncActiveTabBadge();

  return {
    success: true,
    message: navigationMessage
      ? `Session switched successfully ${navigationMessage}`
      : "Session switched successfully",
    data: sessionId,
  };
}

export async function updateSession(payload?: {
  sessionId?: string;
  title?: string;
}): Promise<MessageResponse<Session>> {
  const { sessionId, title = moment().format("MMM D, YYYY, hh:mm:ss") } =
    payload ?? {};

  if (!sessionId) {
    return { success: false, message: errorMessages.noSessionId };
  }

  const storedSessions = await readStoredSessions();
  const sessionIndex = storedSessions.findIndex(
    (session) => session.id === sessionId,
  );

  if (sessionIndex === -1) {
    return { success: false, message: errorMessages.updateFailed };
  }

  const updatedSession = {
    ...storedSessions[sessionIndex],
    title,
    updatedAt: Date.now(),
  };

  const updatedSessions = [...storedSessions];
  updatedSessions[sessionIndex] = updatedSession;

  await setStorageValue(extensionConfig.keys.sessions, updatedSessions);
  await syncActiveTabBadge();

  return {
    success: true,
    message: "Session updated successfully",
    data: updatedSession,
  };
}

export async function deleteSession(payload?: {
  sessionId?: string;
}): Promise<MessageResponse<string>> {
  const { sessionId } = payload ?? {};

  if (!sessionId) {
    return { success: false, message: errorMessages.noSessionId };
  }

  const storedSessions = await readStoredSessions();
  const remainingSessions = storedSessions.filter(
    (session) => session.id !== sessionId,
  );

  await setStorageValue(extensionConfig.keys.sessions, remainingSessions);
  await syncActiveTabBadge();

  return {
    success: true,
    message: "Session deleted successfully",
    data: sessionId,
  };
}

export async function createEmptySession(): Promise<MessageResponse> {
  const currentTab = await getCurrentActiveTab();

  if (!currentTab?.id) {
    return { success: false, message: errorMessages.noActiveTab };
  }

  await clearStorageForCurrentTab();
  await removeStorageValue(extensionConfig.keys.activeSessionId);
  await syncActiveTabBadge();

  return {
    success: true,
    message: "New session created successfully",
  };
}

export async function reloadActiveTab(): Promise<MessageResponse> {
  const currentTab = await getCurrentActiveTab();

  if (!currentTab?.id) {
    return { success: false, message: errorMessages.noActiveTab };
  }

  await reloadTab(currentTab.id);

  return {
    success: true,
    message: "Current tab refreshed successfully",
  };
}

export async function readActiveSessionId(): Promise<
  MessageResponse<string | null>
> {
  const activeSessionId = await getStorageValue<string>(
    extensionConfig.keys.activeSessionId,
  );

  return {
    success: true,
    message: "Active session ID retrieved successfully",
    data: activeSessionId || null,
  };
}

export async function syncActiveTabBadge(): Promise<void> {
  try {
    const activeTabUrl = await requireSupportedActiveTabUrl();
    const storedSessions = await readStoredSessions();
    const matchingSessions = filterSessionsForUrl(activeTabUrl, storedSessions);

    if (matchingSessions.length === 0) {
      browserActionApi.setBadgeText({ text: "" });
      return;
    }

    const badgeText =
      matchingSessions.length > extensionConfig.settings.default.badgeMaxCount
        ? `${extensionConfig.settings.default.badgeMaxCount}+`
        : matchingSessions.length.toString();

    browserActionApi.setBadgeText({ text: badgeText });
  } catch {
    browserActionApi.setBadgeText({ text: "" });
  }
}

async function requireSupportedActiveTabUrl(): Promise<URL> {
  const activeTab = await getCurrentActiveTab();

  if (!activeTab?.url) {
    throw new SessionManagementError(errorMessages.noActiveTab);
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(activeTab.url);
  } catch {
    throw new SessionManagementError(errorMessages.invalidUrl);
  }

  if (
    !ALLOWED_PROTOCOLS.includes(parsedUrl.protocol) &&
    parsedUrl.hostname !== "localhost"
  ) {
    throw new SessionManagementError(errorMessages.unsupportedProtocol);
  }

  return parsedUrl;
}

async function readStoredSessions(): Promise<Session[]> {
  return (
    (await getStorageValue<Session[]>(extensionConfig.keys.sessions)) || []
  );
}

async function readActiveTabStorageSafely() {
  try {
    return await getStorageFromCurrentTab();
  } catch (error) {
    traceError("readActiveTabStorageSafely", error);
    return null;
  }
}

async function writeSession(newSession: Session): Promise<void> {
  const storedSessions = await readStoredSessions();
  const updatedSessions = [...storedSessions, newSession];

  await setStorageValue(extensionConfig.keys.sessions, updatedSessions);
  await setStorageValue(extensionConfig.keys.activeSessionId, newSession.id);
}

async function navigateToSessionIfNeeded(
  currentTab: Awaited<ReturnType<typeof getCurrentActiveTab>>,
  targetSession: Session,
): Promise<string | null> {
  if (!(currentTab?.id && currentTab.url)) {
    return null;
  }

  const currentTabUrl = new URL(currentTab.url);
  const currentHost = currentTabUrl.hostname;
  const currentPort = currentTabUrl.port;
  const sessionHost = targetSession.domain.fqdn;
  const sessionPort = targetSession.domain.port
    ? targetSession.domain.port.toString()
    : "";

  if (
    !shouldNavigateToSession(
      currentHost,
      currentPort,
      sessionHost,
      sessionPort,
      targetSession,
    )
  ) {
    return null;
  }

  const targetUrl = `${currentTabUrl.protocol}//${sessionHost}${sessionPort ? `:${sessionPort}` : ""}`;
  await browser.tabs.update(currentTab.id, { url: targetUrl });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const updatedTab = await getCurrentActiveTab();
  if (!updatedTab?.id) {
    throw new SessionManagementError(errorMessages.noActiveTab);
  }

  return `and navigated to ${sessionHost}${sessionPort ? `:${sessionPort}` : ""}`;
}

function shouldNavigateToSession(
  currentHost: string,
  currentPort: string,
  sessionHost: string,
  sessionPort: string,
  targetSession: Session,
): boolean {
  if (currentHost === sessionHost && currentPort === sessionPort) {
    return false;
  }

  const currentDomain = tldtsParse(currentHost).domain?.toLowerCase();
  const sessionDomain = targetSession.domain.domain.toLowerCase();

  if (currentDomain && sessionDomain && currentDomain === sessionDomain) {
    return true;
  }

  if (currentHost === "localhost" && sessionHost === "localhost") {
    return true;
  }

  return (
    IP_ADDRESS_REGEX.test(currentHost) &&
    IP_ADDRESS_REGEX.test(sessionHost) &&
    currentHost === sessionHost
  );
}

export function createUnknownActionError(
  action: string,
): SessionManagementError {
  return new SessionManagementError(errorMessages.unknownAction(action));
}
