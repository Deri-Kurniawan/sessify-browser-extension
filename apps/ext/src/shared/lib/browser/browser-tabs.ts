import { type Browser, browser } from "#imports";
import { traceError } from "@/shared/lib/monitoring/trace-error";

export class BrowserTabsError extends Error {
  public cause?: unknown;

  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "BrowserTabsError";
    this.cause = originalError;
  }
}

export async function getCurrentActiveTab(): Promise<Browser.tabs.Tab | null> {
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

export async function reloadTab(tabId: number): Promise<void> {
  try {
    await browser.tabs.reload(tabId);
  } catch (error) {
    traceError("reloadTab", error);
    throw new BrowserTabsError(`Failed to reload tab ${tabId}`, error);
  }
}
