import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sendMessage<T>(message: {
  action: EnumBackgroundAction;
  payload?: any;
}): Promise<MessageResponse<T>> {
  return new Promise((resolve) => {
    window.chrome.runtime.sendMessage(
      message,
      (response: MessageResponse<T>) => {
        if (window.chrome.runtime.lastError) {
          resolve({
            success: false,
            message: window.chrome.runtime.lastError.message || "Unknown error",
          });
        } else {
          resolve(response);
        }
      }
    );
  });
}

export const handleError = (operation: string, error: unknown): void => {
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

export * from "./helpers";
