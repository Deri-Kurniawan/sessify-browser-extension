import { type Browser, browser } from "#imports";
import { traceError } from "@/shared/lib/monitoring/trace-error";

export class CookieError extends Error {
  public cause?: unknown;

  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "CookieError";
    this.cause = originalError;
  }
}

export async function getAllCookies(
  data: Browser.cookies.GetAllDetails,
): Promise<Browser.cookies.Cookie[]> {
  try {
    return await browser.cookies.getAll({ ...data });
  } catch (error) {
    traceError("getAllCookies", error);
    throw new CookieError("Failed to get cookies", error);
  }
}

export async function removeManyCookies(
  url: string,
  cookies: Browser.cookies.Cookie[],
): Promise<void> {
  try {
    await Promise.allSettled(
      cookies.map((cookie) =>
        browser.cookies.remove({ url, name: cookie.name }),
      ),
    );
  } catch (error) {
    traceError("removeManyCookies", error);
    throw new CookieError(`Failed to remove many cookies from ${url}`, error);
  }
}
