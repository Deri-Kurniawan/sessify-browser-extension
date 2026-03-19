import { type Browser, browser } from "#imports";
import { getCurrentActiveTab } from "@/shared/lib/browser/browser-tabs";
import { getAllCookies, removeManyCookies } from "@/shared/lib/browser/cookies";
import { traceError } from "@/shared/lib/monitoring/trace-error";

export type SiteStorageState = {
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  cookies: Browser.cookies.Cookie[];
};

export class SiteStorageError extends Error {
  public cause?: unknown;

  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "SiteStorageError";
    this.cause = originalError;
  }
}

export async function getStorageFromCurrentTab(): Promise<SiteStorageState> {
  try {
    const tab = await getCurrentActiveTab();
    if (!(tab?.id && tab.url)) {
      return { localStorage: {}, sessionStorage: {}, cookies: [] };
    }

    const [result] = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: (): Pick<SiteStorageState, "localStorage" | "sessionStorage"> => ({
        localStorage: { ...localStorage },
        sessionStorage: { ...sessionStorage },
      }),
    });

    const cookies = await getAllCookies({ url: tab.url });

    return {
      localStorage: result?.result?.localStorage || {},
      sessionStorage: result?.result?.sessionStorage || {},
      cookies,
    };
  } catch (error) {
    traceError("getSiteStorageData", error);
    throw new SiteStorageError("Failed to retrieve site storage data", error);
  }
}

export async function clearStorageForCurrentTab(): Promise<void> {
  try {
    const tab = await getCurrentActiveTab();
    if (!(tab?.id && tab.url)) {
      return;
    }

    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: (): void => {
        localStorage.clear();
        sessionStorage.clear();
      },
    });

    const cookies = await getAllCookies({ url: tab.url });
    await removeManyCookies(tab.url, cookies);
  } catch (error) {
    traceError("clearSiteStorageData", error);
    throw new SiteStorageError("Failed to clear site storage data", error);
  }
}

export async function applyStorageToCurrentTab(
  state: SiteStorageState,
): Promise<void> {
  try {
    const tab = await getCurrentActiveTab();
    if (!(tab?.id && tab.url)) {
      return;
    }

    const url = new URL(tab.url);

    await Promise.allSettled(
      (state.cookies || []).map((cookie) =>
        browser.cookies.set({
          url: url.origin,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path || "/",
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite || "lax",
          expirationDate: cookie.expirationDate,
        }),
      ),
    );

    await browser.scripting.executeScript({
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
    traceError("applySiteStorageData", error);
    throw new SiteStorageError("Failed to apply site storage data", error);
  }
}
