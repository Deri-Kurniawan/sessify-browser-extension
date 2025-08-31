import {
	createContext,
	type FC,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { sendMessage } from "@/lib/utils";

const sessionContext = createContext<{
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
} | null>(null);

const useSessions = () => {
	const context = useContext(sessionContext);
	if (!context) {
		throw new Error("useSessions must be used within a SessionProvider");
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
		const res = await sendMessage<AppSession[]>({
			action: "GET_FILTERED_SESSIONS_BY_ACTIVE_TAB",
		});
		if (res.success && res.data) {
			setSessions(res.data);
			return res;
		} else {
			setError(res.message || "Failed to load data");
			return res;
		}
	}, []);

	const loadActiveSession = useCallback(async () => {
		const res = await sendMessage<string>({
			action: "GET_ACTIVE_SESSION",
		});

		if (res.success && res.data) {
			setActiveSessionId(res.data);
			return res;
		} else {
			setError(res.message || "Failed to load active session");
			return res;
		}
	}, []);

	const createNewSession = useCallback(async () => {
		const res = await sendMessage({ action: "CREATE_NEW_SESSION" });
		if (res.success) {
			setActiveSessionId("");
			return res;
		}

		setError(res.message);
		return res;
	}, []);

	const refreshCurrentTab = useCallback(async () => {
		const res = await sendMessage({ action: "REFRESH_CURRENT_TAB" });
		if (res.success) {
			return res;
		}
		setError(res.message);
		return res;
	}, []);

	const saveNewSession = useCallback(
		async (data?: Partial<Pick<AppSession, "title">>) => {
			const res = await sendMessage<AppSession>({
				action: "SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE",
				payload: data,
			});
			if (res.success) {
				setSessions((prev) => [...prev, res.data!]);
				setActiveSessionId(res.data!.id);
				return res;
			} else {
				setError(res.message || "Failed to save session");
				return res;
			}
		},
		[],
	);

	const switchSessionById = useCallback(async (id: string) => {
		const res = await sendMessage({
			action: "SWITCH_SESSION_BY_ID",
			payload: { sessionId: id },
		});
		if (res.success) {
			return res;
		} else {
			setError(res.message || "Failed to switch session");
			return res;
		}
	}, []);

	const deleteSessionById = useCallback(async (id: string) => {
		const res = await sendMessage({
			action: "DELETE_SESSION_BY_ID",
			payload: {
				sessionId: id,
			},
		});
		if (res.success) {
			setSessions((prev) => prev.filter((s) => s.id !== id));
			return res;
		} else {
			setError(res.message || "Failed to delete session");
			return res;
		}
	}, []);

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
		window.chrome.tabs.onActivated.addListener(handleTabChange);
		window.chrome.tabs.onUpdated.addListener(handleTabChange);
		return () => {
			window.chrome.tabs.onActivated.removeListener(handleTabChange);
			window.chrome.tabs.onUpdated.removeListener(handleTabChange);
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

		window.chrome.storage.onChanged.addListener(storageListener);

		return () => {
			window.chrome.storage.onChanged.removeListener(storageListener);
		};
	}, [loadSessions, loadActiveSession]);

	return (
		<sessionContext.Provider
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
			}}
		>
			{children}
		</sessionContext.Provider>
	);
};

export { SessionProvider, useSessions };
