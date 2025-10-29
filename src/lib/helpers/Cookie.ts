import { type Browser, browser } from "#imports";
import { traceError } from "@/lib/utils";

/**
 * A utility class for managing cookies in a Chrome Extension.
 * All methods are static and handle errors by logging and throwing custom errors.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: utility class
class Cookie {
	/**
	 * Retrieves all cookies matching the specified details.
	 * @param data The details to filter cookies.
	 * @returns A promise that resolves to an array of cookies.
	 * @throws {CookieError} If the retrieval fails.
	 */
	static async getAll(
		data: Browser.cookies.GetAllDetails,
	): Promise<Browser.cookies.Cookie[]> {
		try {
			const cookies = await browser.cookies.getAll({ ...data });
			return cookies;
		} catch (error) {
			traceError("getAllCookies", error);
			throw new CookieError("Failed to get cookies", error);
		}
	}

	/**
	 * Sets a single cookie with the specified details.
	 * @param cookie The details of the cookie to set.
	 * @returns A promise that resolves to the set cookie or null if failed.
	 * @throws {CookieError} If the setting fails.
	 */
	static async set(
		cookie: Browser.cookies.SetDetails,
	): Promise<Browser.cookies.Cookie | null> {
		try {
			const setCookie = await browser.cookies.set(cookie);
			return setCookie || null;
		} catch (error) {
			traceError("setCookie", error);
			throw new CookieError("Failed to set cookie", error);
		}
	}

	/**
	 * Sets multiple cookies with fallback values for missing properties.
	 * @param cookies An array of cookie objects to set.
	 * @throws {CookieError} If any setting fails.
	 */
	static async setMany(cookies: Browser.cookies.Cookie[]): Promise<void> {
		try {
			const setPromises = cookies.map((cookie) => {
				const protocol = cookie.secure ? "https:" : "http:";
				const url = `${protocol}//${cookie.domain}${cookie.path || "/"}`;
				return browser.cookies.set({
					...cookie,
					url,
					path: cookie.path || "/",
					secure: cookie.secure || false,
					httpOnly: cookie.httpOnly || false,
					sameSite: cookie.sameSite || "lax",
				});
			});

			await Promise.allSettled(setPromises);
		} catch (error) {
			traceError("setManyCookies", error);
			throw new CookieError("Failed to set many cookies", error);
		}
	}

	/**
	 * Removes a single cookie by URL and name.
	 * @param url The URL associated with the cookie.
	 * @param name The name of the cookie to remove.
	 * @throws {CookieError} If the removal fails.
	 */
	static async remove(url: string, name: string): Promise<void> {
		try {
			await browser.cookies.remove({ url, name });
		} catch (error) {
			traceError("removeCookie", error);
			throw new CookieError(
				`Failed to remove cookie ${name} from ${url}`,
				error,
			);
		}
	}

	/**
	 * Removes multiple cookies by URL and cookie objects.
	 * @param url The URL associated with the cookies.
	 * @param cookies An array of cookie objects to remove.
	 * @throws {CookieError} If any removal fails.
	 */
	static async removeMany(
		url: string,
		cookies: Browser.cookies.Cookie[],
	): Promise<void> {
		try {
			const removePromises = cookies.map((cookie) =>
				browser.cookies.remove({ url, name: cookie.name }),
			);
			await Promise.allSettled(removePromises);
		} catch (error) {
			traceError("removeManyCookies", error);
			throw new CookieError(`Failed to remove many cookies from ${url}`, error);
		}
	}
}

/**
 * Custom error class for Cookie operations.
 */
class CookieError extends Error {
	public cause?: unknown;

	/**
	 * @param message The error message.
	 * @param originalError The original error that caused this error.
	 */
	constructor(
		message: string,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "CookieError";
		this.cause = originalError;
	}
}

export { Cookie };
