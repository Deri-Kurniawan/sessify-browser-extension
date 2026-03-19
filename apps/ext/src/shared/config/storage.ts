export const storageNamespace = "sessify";

export const storageVersion = 1 as const;

export const storageKeys = {
  sessions: `${storageNamespace}.sessions`,
  activeSessionId: `${storageNamespace}.activeSessionId`,
  settings: `${storageNamespace}.settings`,
  schemaVersion: `${storageNamespace}.schemaVersion`,
} as const;

export const legacyStorageKeys = {
  sessions: "sessify_sessions_v1",
  activeSessionId: "sessify_active_session_id_v1",
  settings: "sessify_settings_v1",
  schemaVersion: "sessify_schema_version_v2",
} as const;
