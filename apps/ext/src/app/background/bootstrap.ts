import { browser } from "#imports";
import {
  handleBackgroundRequest,
  initializeSessionManagement,
  registerStorageDefaults,
  syncActiveTabBadge,
} from "@/features/session-management";
import type { MessageResponse } from "@/shared/api/background-client";
import type { BackgroundAction } from "@/shared/config";
import { browserActionApi, traceError } from "@/shared/lib";

export function bootstrapBackground() {
  browser.runtime.setUninstallURL(
    browser.runtime.getManifest().homepage_url as string,
  );

  void initializeSessionManagement();

  browser.runtime.onInstalled.addListener(() => {
    console.log(`${browser.runtime.getManifest().name} extension installed.`);

    browser.runtime.setUninstallURL(
      `${browser.runtime.getManifest().homepage_url as string}/feedback?ref=uninstall`,
    );

    registerStorageDefaults();
  });

  browser.runtime.onMessage.addListener((request, _, sendResponse) => {
    void handleBackgroundRequestAsync(request, sendResponse);
    return true;
  });

  browser.tabs.onActivated.addListener(() => {
    void syncActiveTabBadge();
  });
  browser.tabs.onUpdated.addListener(() => {
    void syncActiveTabBadge();
  });

  browser.commands.onCommand.addListener((command) => {
    if (command === "toggle-feature") {
      browserActionApi.openPopup();
    }
  });
}

async function handleBackgroundRequestAsync(
  request: { action: BackgroundAction; payload?: unknown },
  sendResponse: (response: MessageResponse) => void,
): Promise<boolean> {
  let apiResponse: MessageResponse;

  try {
    apiResponse = await handleBackgroundRequest(request);
  } catch (error) {
    const processedError =
      error instanceof Error ? error : new Error(String(error));
    traceError("handleBackgroundRequestAsync", processedError);
    apiResponse = { success: false, message: processedError.message };
  }

  sendResponse(apiResponse);
  return true;
}
