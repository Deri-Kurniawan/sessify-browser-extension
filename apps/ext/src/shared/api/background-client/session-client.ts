import type { Session } from "@/entities/session";
import { backgroundActions } from "@/shared/config";
import { sendToBackground } from "./send-to-background";
import type { MessageResponse } from "./types";

export const sessionBackgroundClient = {
  listSessionsForActiveTab(): Promise<MessageResponse<Session[]>> {
    return sendToBackground<Session[]>({
      action: backgroundActions.listSessionsForActiveTab,
    });
  },
  readActiveSessionId(): Promise<MessageResponse<string | null>> {
    return sendToBackground<string | null>({
      action: backgroundActions.readActiveSessionId,
    });
  },
  createEmptySession(): Promise<MessageResponse> {
    return sendToBackground({
      action: backgroundActions.createEmptySession,
    });
  },
  reloadActiveTab(): Promise<MessageResponse> {
    return sendToBackground({
      action: backgroundActions.reloadActiveTab,
    });
  },
  saveActiveTabSession(data?: Partial<Pick<Session, "title">>) {
    return sendToBackground<Session, Partial<Pick<Session, "title">>>({
      action: backgroundActions.saveActiveTabSession,
      payload: { ...data },
    });
  },
  updateSession(sessionId: string, data: Partial<Pick<Session, "title">>) {
    return sendToBackground<Session, { sessionId: string; title?: string }>({
      action: backgroundActions.updateSession,
      payload: {
        sessionId,
        ...data,
      },
    });
  },
  activateSession(sessionId: string): Promise<MessageResponse> {
    return sendToBackground({
      action: backgroundActions.activateSession,
      payload: { sessionId },
    });
  },
  deleteSession(sessionId: string): Promise<MessageResponse<string>> {
    return sendToBackground<string, { sessionId: string }>({
      action: backgroundActions.deleteSession,
      payload: { sessionId },
    });
  },
};
