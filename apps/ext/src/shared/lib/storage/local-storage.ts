import { browser } from "#imports";
import { traceError } from "@/shared/lib/monitoring/trace-error";

export class ExtensionStorageError extends Error {
  public cause?: unknown;

  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "ExtensionStorageError";
    this.cause = originalError;
  }
}

export async function getStorageValue<T>(key: string): Promise<T | null> {
  try {
    const result = await browser.storage.local.get(key);
    return (result[key] as T) ?? null;
  } catch (error) {
    traceError("getStorage", error);
    throw new ExtensionStorageError(
      `Failed to get key "${key}" from storage`,
      error,
    );
  }
}

export async function setStorageValue<T>(key: string, value: T): Promise<void> {
  try {
    await browser.storage.local.set({ [key]: value });
  } catch (error) {
    traceError("setStorage", error);
    throw new ExtensionStorageError(
      `Failed to set key "${key}" in storage`,
      error,
    );
  }
}

export async function removeStorageValue(key: string): Promise<void> {
  try {
    await browser.storage.local.remove(key);
  } catch (error) {
    traceError("removeStorage", error);
    throw new ExtensionStorageError(
      `Failed to remove key "${key}" from storage`,
      error,
    );
  }
}
