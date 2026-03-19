import { ZodError, type ZodType } from "zod";
import {
  type ActiveSessionId,
  activeSessionIdSchema,
  type Session,
  sessionListSchema,
} from "@/entities/session";
import {
  defaultSettings,
  legacyStorageKeys,
  type Settings,
  settingsSchema,
  storageKeys,
  storageVersion,
} from "@/shared/config";
import {
  getStorageValue,
  removeStorageValue,
  setStorageValue,
} from "./local-storage";

function parseStoredValue<T>(
  schema: ZodType<T>,
  value: unknown,
  fallbackValue: T,
): T {
  if (value === null || value === undefined || value === "") {
    return fallbackValue;
  }

  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      return fallbackValue;
    }
    throw error;
  }
}

async function readStorageValueWithLegacyFallback<T>(
  key: string,
  legacyKey: string,
): Promise<T | null> {
  const value = await getStorageValue<T>(key);
  if (value !== null && value !== undefined) {
    return value;
  }

  return await getStorageValue<T>(legacyKey);
}

export const settingsRepository = {
  async read(): Promise<Settings> {
    const value = await readStorageValueWithLegacyFallback<unknown>(
      storageKeys.settings,
      legacyStorageKeys.settings,
    );
    return parseStoredValue(settingsSchema, value, defaultSettings);
  },
  async write(settings: Settings): Promise<void> {
    await setStorageValue(storageKeys.settings, settingsSchema.parse(settings));
  },
};

export const sessionRepository = {
  async readAll(): Promise<Session[]> {
    const value = await readStorageValueWithLegacyFallback<unknown>(
      storageKeys.sessions,
      legacyStorageKeys.sessions,
    );
    return parseStoredValue(sessionListSchema, value, []);
  },
  async writeAll(sessions: Session[]): Promise<void> {
    await setStorageValue(
      storageKeys.sessions,
      sessionListSchema.parse(sessions),
    );
  },
};

export const activeSessionRepository = {
  async read(): Promise<ActiveSessionId> {
    const value = await readStorageValueWithLegacyFallback<unknown>(
      storageKeys.activeSessionId,
      legacyStorageKeys.activeSessionId,
    );
    return parseStoredValue(activeSessionIdSchema, value, null);
  },
  async write(sessionId: ActiveSessionId): Promise<void> {
    await setStorageValue(
      storageKeys.activeSessionId,
      activeSessionIdSchema.parse(sessionId),
    );
  },
  async clear(): Promise<void> {
    await removeStorageValue(storageKeys.activeSessionId);
  },
};

async function clearLegacyStorageKeys(): Promise<void> {
  await Promise.all([
    removeStorageValue(legacyStorageKeys.sessions),
    removeStorageValue(legacyStorageKeys.activeSessionId),
    removeStorageValue(legacyStorageKeys.settings),
    removeStorageValue(legacyStorageKeys.schemaVersion),
  ]);
}

export async function migrateStorageState(): Promise<void> {
  const currentVersion = await readStorageValueWithLegacyFallback<number>(
    storageKeys.schemaVersion,
    legacyStorageKeys.schemaVersion,
  );

  if (currentVersion === storageVersion) {
    return;
  }

  const sessions = await sessionRepository.readAll();
  const settings = await settingsRepository.read();
  const activeSessionId = await activeSessionRepository.read();

  await Promise.all([
    sessionRepository.writeAll(sessions),
    settingsRepository.write(settings),
    activeSessionRepository.write(activeSessionId),
    setStorageValue(storageKeys.schemaVersion, storageVersion),
  ]);

  await clearLegacyStorageKeys();
}
