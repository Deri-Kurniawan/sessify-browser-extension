import { handleError } from "../utils";

/**
 * A helper class for managing browser tabs using the Chrome Extensions API.
 */
class BrowserTabs {
  static async getCurrentActive(): Promise<chrome.tabs.Tab | null> {
    try {
      const [tabs] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      return tabs || null;
    } catch (error) {
      handleError("getCurrentActiveTab", error);
      throw new BrowserTabsError("Failed to get current active tab", error);
    }
  }

  static async reload(tabId: number): Promise<void> {
    try {
      await chrome.tabs.reload(tabId);
    } catch (error) {
      handleError("reloadTab", error);
      throw new BrowserTabsError("Failed to reload tab", error);
    }
  }

  static async close(tabId: number): Promise<void> {
    try {
      await chrome.tabs.remove(tabId);
    } catch (error) {
      handleError("closeTab", error);
      throw new BrowserTabsError("Failed to close tab", error);
    }
  }

  static async create(url: string): Promise<chrome.tabs.Tab> {
    try {
      const tab = await chrome.tabs.create({ url });
      return tab;
    } catch (error) {
      handleError("createTab", error);
      throw new BrowserTabsError("Failed to create tab", error);
    }
  }
}

class BrowserTabsError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "BrowserTabsError";
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }
}

export { BrowserTabs };
