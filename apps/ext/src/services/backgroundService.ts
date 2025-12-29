import { EnumBackgroundAction } from "@/constants";
import { sendToBackground } from "@/lib/utils";

export const backgroundService = {
	getFilteredSessionByActiveTab: async () => {
		return await sendToBackground<AppSession[]>({
			action: EnumBackgroundAction.enum.GET_FILTERED_SESSIONS_BY_ACTIVE_TAB,
		});
	},
	getActiveSession: async () => {
		return await sendToBackground<string>({
			action: EnumBackgroundAction.enum.GET_ACTIVE_SESSION,
		});
	},
	createNewSession: async () => {
		return await sendToBackground({
			action: EnumBackgroundAction.enum.CREATE_NEW_SESSION,
		});
	},
	refreshCurrentTab: async () => {
		return await sendToBackground({
			action: EnumBackgroundAction.enum.REFRESH_CURRENT_TAB,
		});
	},
	saveNewSession: async (data?: Partial<Pick<AppSession, "title">>) => {
		return await sendToBackground<AppSession>({
			action:
				EnumBackgroundAction.enum.SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE,
			payload: { ...data },
		});
	},
	updateSessionById: async (
		id: string,
		data: Partial<Pick<AppSession, "title">>,
	) => {
		return await sendToBackground<AppSession>({
			action: EnumBackgroundAction.enum.UPDATE_SESSION_BY_ID,
			payload: {
				sessionId: id,
				...data,
			},
		});
	},
	switchSessionById: async (id: string) => {
		return await sendToBackground({
			action: EnumBackgroundAction.enum.SWITCH_SESSION_BY_ID,
			payload: { sessionId: id },
		});
	},
	deleteSessionById: async (id: string) => {
		return await sendToBackground<{ deletedId: string }>({
			action: EnumBackgroundAction.enum.DELETE_SESSION_BY_ID,
			payload: { sessionId: id },
		});
	},
};
