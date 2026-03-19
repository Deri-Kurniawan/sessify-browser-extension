import { browser } from "#imports";
import type { BackgroundMessage, MessageResponse } from "./types";

export async function sendToBackground<TResponse = unknown, TPayload = unknown>(
  message: BackgroundMessage<TPayload>,
): Promise<MessageResponse<TResponse>> {
  return await browser.runtime.sendMessage({ ...message });
}
