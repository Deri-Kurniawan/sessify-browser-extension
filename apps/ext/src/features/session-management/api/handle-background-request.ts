import type { MessageResponse } from "@/shared/api/background-client";
import { type BackgroundAction, backgroundActions } from "@/shared/config";
import {
  activateSession,
  createEmptySession,
  createUnknownActionError,
  deleteSession,
  listSessionsForActiveTab,
  readActiveSessionId,
  reloadActiveTab,
  saveActiveTabSession,
  updateSession,
} from "../model/background-session-service";

export async function handleBackgroundRequest(request: {
  action: BackgroundAction;
  payload?: unknown;
}): Promise<MessageResponse> {
  switch (request.action) {
    case backgroundActions.listSessionsForActiveTab:
      return await listSessionsForActiveTab();
    case backgroundActions.saveActiveTabSession:
      return await saveActiveTabSession(request.payload as { title?: string });
    case backgroundActions.activateSession:
      return await activateSession(request.payload as { sessionId?: string });
    case backgroundActions.updateSession:
      return await updateSession(
        request.payload as { sessionId?: string; title?: string },
      );
    case backgroundActions.deleteSession:
      return await deleteSession(request.payload as { sessionId?: string });
    case backgroundActions.createEmptySession:
      return await createEmptySession();
    case backgroundActions.reloadActiveTab:
      return await reloadActiveTab();
    case backgroundActions.readActiveSessionId:
      return await readActiveSessionId();
    default:
      throw createUnknownActionError(request.action);
  }
}
