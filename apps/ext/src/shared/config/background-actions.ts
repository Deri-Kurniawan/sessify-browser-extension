import z from "zod";

export const backgroundActionSchema = z.enum([
  "GET_FILTERED_SESSIONS_BY_ACTIVE_TAB",
  "SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE",
  "UPDATE_SESSION_BY_ID",
  "DELETE_SESSION_BY_ID",
  "CREATE_NEW_SESSION",
  "REFRESH_CURRENT_TAB",
  "SWITCH_SESSION_BY_ID",
  "GET_ACTIVE_SESSION",
]);

export type BackgroundAction = z.infer<typeof backgroundActionSchema>;

export const backgroundActions = {
  listSessionsForActiveTab:
    backgroundActionSchema.enum.GET_FILTERED_SESSIONS_BY_ACTIVE_TAB,
  saveActiveTabSession:
    backgroundActionSchema.enum.SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE,
  updateSession: backgroundActionSchema.enum.UPDATE_SESSION_BY_ID,
  deleteSession: backgroundActionSchema.enum.DELETE_SESSION_BY_ID,
  createEmptySession: backgroundActionSchema.enum.CREATE_NEW_SESSION,
  reloadActiveTab: backgroundActionSchema.enum.REFRESH_CURRENT_TAB,
  activateSession: backgroundActionSchema.enum.SWITCH_SESSION_BY_ID,
  readActiveSessionId: backgroundActionSchema.enum.GET_ACTIVE_SESSION,
} as const;
