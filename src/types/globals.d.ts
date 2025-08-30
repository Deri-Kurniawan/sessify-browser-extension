declare interface AppSession {
	id: string;
	appIconUrl: string;
	title: string;
	domain: string;
	createdAt: number;
	updatedAt: number;
	state: {
		localStorage: Record<string, string>;
		sessionStorage: Record<string, string>;
		cookies: chrome.cookies.Cookie[];
	};
}

declare interface MessageResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
}

declare type EnumBackgroundAction =
	| "GET_FILTERED_SESSIONS_BY_ACTIVE_TAB"
	| "SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE"
	| "DELETE_SESSION_BY_ID"
	| "CREATE_NEW_SESSION"
	| "REFRESH_CURRENT_TAB"
	| "SWITCH_SESSION_BY_ID"
	| "GET_ACTIVE_SESSION";
