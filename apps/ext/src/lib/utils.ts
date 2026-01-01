import { browser } from "#imports";
import type { EnumBackgroundActionType } from "@/types/background";

export const browserActionAPI = browser.action ?? browser.browserAction;

export async function sendToBackground<T = unknown>(message: {
  action: EnumBackgroundActionType;
  payload?: any;
}): Promise<MessageResponse<T>> {
  return await browser.runtime.sendMessage({ ...message });
}

export const traceError = (operation: string, error: unknown): void => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown error";

  console.error(`[${operation}] Error:`, errorMessage, {
    fullError: error,
  });
};

export * from "./helpers/index";
