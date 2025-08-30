import { handleError } from "../utils";

/**
 * A helper class for managing cookies in a Chrome Extension.
 *
 * environment: Chrome Extensions
 */
class Cookie {
  static async getAll(
    data: chrome.cookies.GetAllDetails
  ): Promise<chrome.cookies.Cookie[]> {
    try {
      const cookies = await chrome.cookies.getAll({ ...data });
      return cookies;
    } catch (error) {
      handleError("getAllCookies", error);
      throw new CookieError("Failed to get cookies", error);
    }
  }

  static async set(
    cookie: chrome.cookies.SetDetails
  ): Promise<chrome.cookies.Cookie | null> {
    try {
      const setCookie = await chrome.cookies.set(cookie);
      return setCookie || null;
    } catch (error) {
      handleError("setCookie", error);
      throw new CookieError("Failed to set cookie", error);
    }
  }

  static async setMany(cookies: chrome.cookies.Cookie[]): Promise<void> {
    try {
      const setPromises = cookies.map((cookie) =>
        chrome.cookies.set({
          url: origin,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path || "/",
          secure: cookie.secure || false,
          httpOnly: cookie.httpOnly || false,
          sameSite: cookie.sameSite || "lax",
          expirationDate: cookie.expirationDate,
        })
      );
      await Promise.allSettled(setPromises);
    } catch (error) {
      handleError("setManyCookies", error);
      throw new CookieError("Failed to set many cookies", error);
    }
  }

  static async remove(url: string, name: string): Promise<void> {
    try {
      await chrome.cookies.remove({ url, name });
    } catch (error) {
      handleError("removeCookie", error);
      throw new CookieError("Failed to remove cookie", error);
    }
  }

  static async removeMany(
    url: string,
    cookies: chrome.cookies.Cookie[]
  ): Promise<void> {
    try {
      const removePromises = cookies.map((cookie) =>
        chrome.cookies.remove({ url, name: cookie.name })
      );
      await Promise.allSettled(removePromises);
    } catch (error) {
      handleError("removeManyCookies", error);
      throw new CookieError("Failed to remove many cookies", error);
    }
  }
}

class CookieError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "CookieError";
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }
}

export { Cookie };
