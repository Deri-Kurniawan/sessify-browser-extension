/// <reference types="chrome"/>

import { traceError } from "../utils";

/**
 * A utility class for managing local storage in a Chrome Extension.
 * All methods are static and handle errors by logging and throwing custom errors.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: utility class
class Storage {
	/**
	 * Retrieves a value from storage by key.
	 * @param key The key to retrieve.
	 * @returns A promise that resolves to the value or null if not found.
	 * @throws {StorageError} If retrieval fails.
	 */
	static async get<T>(key: string): Promise<T | null> {
		try {
			const result = await chrome.storage.local.get(key);
			return (result[key] as T) ?? null;
		} catch (error) {
			traceError("getStorage", error);
			throw new StorageError(`Failed to get key "${key}" from storage`, error);
		}
	}

	/**
	 * Sets a value in storage for the given key.
	 * @param key The key to set.
	 * @param value The value to store.
	 * @throws {StorageError} If setting fails.
	 */
	static async set<T>(key: string, value: T): Promise<void> {
		try {
			await chrome.storage.local.set({ [key]: value });
		} catch (error) {
			traceError("setStorage", error);
			throw new StorageError(`Failed to set key "${key}" in storage`, error);
		}
	}

	/**
	 * Removes a key from storage.
	 * @param key The key to remove.
	 * @throws {StorageError} If removal fails.
	 */
	static async remove(key: string): Promise<void> {
		try {
			await chrome.storage.local.remove(key);
		} catch (error) {
			traceError("removeStorage", error);
			throw new StorageError(
				`Failed to remove key "${key}" from storage`,
				error,
			);
		}
	}

	/**
	 * Clears all data from storage.
	 * @throws {StorageError} If clearing fails.
	 */
	static async clear(): Promise<void> {
		try {
			await chrome.storage.local.clear();
		} catch (error) {
			traceError("clearStorage", error);
			throw new StorageError("Failed to clear storage", error);
		}
	}
}

/**
 * Custom error class for Storage operations.
 */
class StorageError extends Error {
	public cause?: unknown;

	/**
	 * @param message The error message.
	 * @param originalError The original error that caused this error.
	 */
	constructor(
		message: string,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "StorageError";
		this.cause = originalError;
	}
}

export { Storage };
