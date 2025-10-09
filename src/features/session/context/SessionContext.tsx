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
import { sendToBackground } from "@/lib/utils";

export const SessionContext = createContext<{
	sessions: AppSession[];
	activeSessionId: string;
	error: string | null;
	loadSessions: () => Promise<MessageResponse<AppSession[]>>;
	loadActiveSession: () => Promise<MessageResponse<string>>;
	createNewSession: () => Promise<MessageResponse>;
	refreshCurrentTab: () => Promise<MessageResponse>;
	saveNewSession: (
		data?: Partial<Pick<AppSession, "title">>,
	) => Promise<MessageResponse<AppSession>>;
	switchSessionById: (id: string) => Promise<MessageResponse>;
	deleteSessionById: (id: string) => Promise<MessageResponse>;
	updateSessionById: (
		id: string,
		data: Partial<Pick<AppSession, "title">>,
	) => Promise<MessageResponse>;
} | null>(null);

const useSessions = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSessions must be used within a <SessionProvider />");
	}
	return context;
};

const SessionProvider: FC<{
	watchTabChange?: boolean;
	children: ReactNode;
}> = ({ children, watchTabChange = true }) => {
	const [sessions, setSessions] = useState<AppSession[]>([]);
	const [activeSessionId, setActiveSessionId] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const loadSessions = useCallback(async () => {
		const res = await sendToBackground<AppSession[]>({
			action: "GET_FILTERED_SESSIONS_BY_ACTIVE_TAB",
		});
		if (res.success && res.data) {
			setSessions(res.data);
			return res;
		} else {
			setError(
				res.message
					? `Could not load sessions: ${res.message}`
					: "Could not load sessions. Please try again.",
			);
			return res;
		}
	}, []);

	const loadActiveSession = useCallback(async () => {
		const res = await sendToBackground<string>({
			action: "GET_ACTIVE_SESSION",
		});

		if (res.success && res.data) {
			setActiveSessionId(res.data);
			return res;
		} else {
			setError(
				res.message
					? `Could not load active session: ${res.message}`
					: "Could not load active session. Please try again.",
			);
			return res;
		}
	}, []);

	const createNewSession = useCallback(async () => {
		const res = await sendToBackground({ action: "CREATE_NEW_SESSION" });
		if (res.success) {
			setActiveSessionId("");
			return res;
		}

		setError(
			res.message
				? `Could not create new session: ${res.message}`
				: "Could not create new session. Please try again.",
		);
		return res;
	}, []);

	const refreshCurrentTab = useCallback(async () => {
		const res = await sendToBackground({ action: "REFRESH_CURRENT_TAB" });
		if (res.success) {
			return res;
		}
		setError(
			res.message
				? `Could not refresh tab: ${res.message}`
				: "Could not refresh tab. Please try again.",
		);
		return res;
	}, []);

	const saveNewSession = useCallback(
		async (data?: Partial<Pick<AppSession, "title">>) => {
			const res = await sendToBackground<AppSession>({
				action: "SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE",
				payload: data,
			});
			if (res.success) {
				setSessions((prev) => [...prev, res.data!]);
				setActiveSessionId(res.data!.id);
				return res;
			} else {
				setError(
					res.message
						? `Could not save session: ${res.message}`
						: "Could not save session. Please try again.",
				);
				return res;
			}
		},
		[],
	);

	const switchSessionById = useCallback(async (id: string) => {
		const res = await sendToBackground({
			action: "SWITCH_SESSION_BY_ID",
			payload: { sessionId: id },
		});
		if (res.success) {
			setActiveSessionId(id);
			return res;
		} else {
			setError(
				res.message
					? `Could not switch session: ${res.message}`
					: "Could not switch session. Please try again.",
			);
			return res;
		}
	}, []);

	const deleteSessionById = useCallback(async (id: string) => {
		const res = await sendToBackground({
			action: "DELETE_SESSION_BY_ID",
			payload: {
				sessionId: id,
			},
		});
		if (res.success) {
			setSessions((prev) => prev.filter((s) => s.id !== id));
			return res;
		} else {
			setError(
				res.message
					? `Could not delete session: ${res.message}`
					: "Could not delete session. Please try again.",
			);
			return res;
		}
	}, []);

	const updateSessionById = useCallback(
		async (id: string, data: Partial<Pick<AppSession, "title">>) => {
			const res = await sendToBackground({
				action: "UPDATE_SESSION_BY_ID",
				payload: {
					sessionId: id,
					...data,
				},
			});
			if (res.success) {
				setSessions((prev) =>
					prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
				);
				loadSessions();
				return res;
			} else {
				setError(
					res.message
						? `Could not update session: ${res.message}`
						: "Could not update session. Please try again.",
				);
				return res;
			}
		},
		[loadSessions],
	);

	useEffect(() => {
		loadSessions().catch((err) => {
			setError(err.message);
		});
		loadActiveSession().catch((err) => {
			setError(err.message);
		});
	}, [loadSessions, loadActiveSession]);

	useEffect(() => {
		if (!watchTabChange) return;
		const handleTabChange = () => {
			loadSessions();
			loadActiveSession();
		};
		browser.tabs.onActivated.addListener(handleTabChange);
		browser.tabs.onUpdated.addListener(handleTabChange);
		return () => {
			browser.tabs.onActivated.removeListener(handleTabChange);
			browser.tabs.onUpdated.removeListener(handleTabChange);
		};
	}, [loadSessions, loadActiveSession, watchTabChange]);

	// Listen to storage changes
	useEffect(() => {
		const storageListener = (changes: any, areaName: string) => {
			if (areaName !== "local") return;
			if (changes.sessions || changes.activeSessions) {
				loadSessions().catch((e) => setError(String(e?.message || e)));
				loadActiveSession().catch((e) => setError(String(e?.message || e)));
			}
		};

		browser.storage.onChanged.addListener(storageListener);

		return () => {
			browser.storage.onChanged.removeListener(storageListener);
		};
	}, [loadSessions, loadActiveSession]);

	return (
		<SessionContext.Provider
			value={{
				sessions,
				activeSessionId,
				error,
				loadSessions,
				loadActiveSession,
				createNewSession,
				refreshCurrentTab,
				saveNewSession,
				switchSessionById,
				deleteSessionById,
				updateSessionById,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
};

export { SessionProvider, useSessions };
