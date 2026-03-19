import type z from "zod";
import type {
  activeSessionIdSchema,
  persistedCookieSchema,
  sessionDomainSchema,
  sessionListSchema,
  sessionSchema,
  sessionStateSchema,
} from "./schema";

export type PersistedCookie = z.infer<typeof persistedCookieSchema>;
export type SessionDomain = z.infer<typeof sessionDomainSchema>;
export type SessionState = z.infer<typeof sessionStateSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type SessionList = z.infer<typeof sessionListSchema>;
export type ActiveSessionId = z.infer<typeof activeSessionIdSchema>;
