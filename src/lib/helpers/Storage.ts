import { handleError } from "../utils";

/**
 * A helper class for managing local storage in a Chrome Extension.
 *
 * environment: Chrome Extensions
 */

// biome-ignore lint/complexity/noStaticOnlyClass: utility class
class Storage {
	static async get<T>(key: string): Promise<T | null> {
		try {
			const result = await chrome.storage.local.get(key);
			return result[key] ?? null;
		} catch (error) {
			handleError("getStorage", error);
			throw new StorageError(`Failed to get key "${key}" from storage`, error);
		}
	}

	static async set<T>(key: string, value: T): Promise<void> {
		try {
			await chrome.storage.local.set({ [key]: value });
		} catch (error) {
			handleError("setStorage", error);
			throw new StorageError(`Failed to set key "${key}" in storage`, error);
		}
	}

	static async remove(key: string): Promise<void> {
		try {
			await chrome.storage.local.remove(key);
		} catch (error) {
			handleError("removeStorage", error);
			throw new StorageError(
				`Failed to remove key "${key}" from storage`,
				error,
			);
		}
	}

	static async clear(): Promise<void> {
		try {
			await chrome.storage.local.clear();
		} catch (error) {
			handleError("clearStorage", error);
			throw new StorageError("Failed to clear storage", error);
		}
	}
}

class StorageError extends Error {
	constructor(
		message: string,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "StorageError";
		if (originalError instanceof Error) {
			this.stack = originalError.stack;
		}
	}
}

export { Storage };
