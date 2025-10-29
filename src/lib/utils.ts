import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { browser } from "#imports";
import type { EnumBackgroundActionType } from "@/types/background";

export const browserActionAPI = browser.action ?? browser.browserAction;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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
