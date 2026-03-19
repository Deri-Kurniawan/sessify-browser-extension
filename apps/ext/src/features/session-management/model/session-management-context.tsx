import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { browser } from "#imports";
import type { Session } from "@/entities/session";
import {
  type MessageResponse,
  sessionBackgroundClient,
} from "@/shared/api/background-client";
import { extensionConfig } from "@/shared/config";

type SessionManagementContextValue = {
  sessions: Session[];
  activeSessionId: string;
  error: string | null;
  listSessions: () => Promise<MessageResponse<Session[]>>;
  readActiveSessionId: () => Promise<MessageResponse<string | null>>;
  createEmptySession: () => Promise<MessageResponse>;
  reloadActiveTab: () => Promise<MessageResponse>;
  saveActiveTabSession: (
    data?: Partial<Pick<Session, "title">>,
  ) => Promise<MessageResponse<Session>>;
  activateSession: (sessionId: string) => Promise<MessageResponse>;
  deleteSession: (sessionId: string) => Promise<MessageResponse<string>>;
  updateSession: (
    sessionId: string,
    data: Partial<Pick<Session, "title">>,
  ) => Promise<MessageResponse<Session>>;
};

const SessionManagementContext =
  createContext<SessionManagementContextValue | null>(null);

export function useSessionManagement() {
  const context = useContext(SessionManagementContext);

  if (!context) {
    throw new Error(
      "useSessionManagement must be used within a SessionManagementProvider",
    );
  }

  return context;
}

export const SessionManagementProvider: FC<{
  watchTabChange?: boolean;
  children: ReactNode;
}> = ({ children, watchTabChange = true }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const listSessions = useCallback(async () => {
    const response = await sessionBackgroundClient.listSessionsForActiveTab();

    if (response.success) {
      setSessions(response.data || []);
      return response;
    }

    setError(
      response.message
        ? `Could not load sessions: ${response.message}`
        : "Could not load sessions. Please try again.",
    );
    return response;
  }, []);

  const readActiveSessionId = useCallback(async () => {
    const response = await sessionBackgroundClient.readActiveSessionId();

    if (response.success) {
      setActiveSessionId(response.data || "");
      return response;
    }

    setError(
      response.message
        ? `Could not load active session: ${response.message}`
        : "Could not load active session. Please try again.",
    );
    return response;
  }, []);

  const createEmptySession = useCallback(async () => {
    const response = await sessionBackgroundClient.createEmptySession();

    if (response.success) {
      setActiveSessionId("");
      return response;
    }

    setError(
      response.message
        ? `Could not create new session: ${response.message}`
        : "Could not create new session. Please try again.",
    );
    return response;
  }, []);

  const reloadActiveTab = useCallback(async () => {
    const response = await sessionBackgroundClient.reloadActiveTab();

    if (response.success) {
      return response;
    }

    setError(
      response.message
        ? `Could not refresh tab: ${response.message}`
        : "Could not refresh tab. Please try again.",
    );
    return response;
  }, []);

  const saveActiveTabSession = useCallback(
    async (data?: Partial<Pick<Session, "title">>) => {
      const response = await sessionBackgroundClient.saveActiveTabSession(data);

      if (response.success && response.data) {
        const newSession = response.data;
        setSessions((previousSessions) => [...previousSessions, newSession]);
        setActiveSessionId(newSession.id);
        return response;
      }

      setError(
        response.message
          ? `Could not save session: ${response.message}`
          : "Could not save session. Please try again.",
      );
      return response;
    },
    [],
  );

  const activateSession = useCallback(async (sessionId: string) => {
    const response = await sessionBackgroundClient.activateSession(sessionId);

    if (response.success) {
      setActiveSessionId(sessionId);
      return response;
    }

    setError(
      response.message
        ? `Could not switch session: ${response.message}`
        : "Could not switch session. Please try again.",
    );
    return response;
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    const response = await sessionBackgroundClient.deleteSession(sessionId);

    if (response.success) {
      setSessions((previousSessions) =>
        previousSessions.filter((session) => session.id !== sessionId),
      );
      return response;
    }

    setError(
      response.message
        ? `Could not delete session: ${response.message}`
        : "Could not delete session. Please try again.",
    );
    return response;
  }, []);

  const updateSession = useCallback(
    async (sessionId: string, data: Partial<Pick<Session, "title">>) => {
      const response = await sessionBackgroundClient.updateSession(
        sessionId,
        data,
      );

      if (response.success && response.data) {
        const updatedSession = response.data;
        setSessions((previousSessions) =>
          previousSessions.map((session) =>
            session.id === sessionId ? updatedSession : session,
          ),
        );
        return response;
      }

      setError(
        response.message
          ? `Could not update session: ${response.message}`
          : "Could not update session. Please try again.",
      );
      return response;
    },
    [],
  );

  useEffect(() => {
    listSessions().catch((currentError: Error) => {
      setError(currentError.message);
    });
    readActiveSessionId().catch((currentError: Error) => {
      setError(currentError.message);
    });
  }, [listSessions, readActiveSessionId]);

  useEffect(() => {
    if (!watchTabChange) {
      return;
    }

    const handleTabChange = () => {
      void listSessions();
      void readActiveSessionId();
    };

    browser.tabs.onActivated.addListener(handleTabChange);
    browser.tabs.onUpdated.addListener(handleTabChange);

    return () => {
      browser.tabs.onActivated.removeListener(handleTabChange);
      browser.tabs.onUpdated.removeListener(handleTabChange);
    };
  }, [listSessions, readActiveSessionId, watchTabChange]);

  useEffect(() => {
    const storageListener = (
      changes: Record<string, unknown>,
      areaName: string,
    ) => {
      if (areaName !== "local") {
        return;
      }

      if (
        changes[extensionConfig.keys.sessions] ||
        changes[extensionConfig.keys.activeSessionId]
      ) {
        void listSessions().catch((currentError: Error) =>
          setError(String(currentError?.message || currentError)),
        );
        void readActiveSessionId().catch((currentError: Error) =>
          setError(String(currentError?.message || currentError)),
        );
      }
    };

    browser.storage.onChanged.addListener(storageListener);

    return () => {
      browser.storage.onChanged.removeListener(storageListener);
    };
  }, [listSessions, readActiveSessionId]);

  return (
    <SessionManagementContext.Provider
      value={{
        sessions,
        activeSessionId,
        error,
        listSessions,
        readActiveSessionId,
        createEmptySession,
        reloadActiveTab,
        saveActiveTabSession,
        activateSession,
        deleteSession,
        updateSession,
      }}
    >
      {children}
    </SessionManagementContext.Provider>
  );
};
