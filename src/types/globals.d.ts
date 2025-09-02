declare interface AppSession {
	id: string;
	appIconUrl: string;
	title: string;
	domain: {
		/**
		 * Registered Domain (Domain Name)
		 * SLD + TLD
		 * Example: "example.com"
		 */
		domain: string;

		/**
		 * Second Level Domain (SLD)
		 * Example: "example" from "example.com"
		 */
		sld: string;

		/**
		 * Subdomain part (if any)
		 * Example: "blog" from "blog.example.com"
		 * Can also be multi-level: "api.dev" from "api.dev.example.com"
		 */
		subdomain: string;

		/**
		 * Fully Qualified Domain Name (FQDN / full hostname)
		 * Example: "blog.example.com"
		 */
		fqdn: string;

		/**
		 * Top Level Domain (TLD / public suffix)
		 * Example: "com" or "my.id"
		 */
		tld: string;

		/**
		 * Whether the hostname is an IP address
		 */
		isIp: boolean;

		/**
		 * Whether the suffix is a valid ICANN-managed TLD
		 */
		isIcann: boolean;
	};
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
	| "UPDATE_SESSION_BY_ID"
	| "DELETE_SESSION_BY_ID"
	| "CREATE_NEW_SESSION"
	| "REFRESH_CURRENT_TAB"
	| "SWITCH_SESSION_BY_ID"
	| "GET_ACTIVE_SESSION";
