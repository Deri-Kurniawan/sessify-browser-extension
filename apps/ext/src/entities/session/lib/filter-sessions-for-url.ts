import { parse as tldtsParse } from "tldts";
import type { Session } from "../model/types";

const IP_ADDRESS_REGEX = /^\d{1,3}(\.\d{1,3}){3}$/;

export function filterSessionsForUrl(
  targetUrl: URL,
  sessions: Session[],
): Session[] {
  return sessions.filter((session) => {
    const targetHostname = targetUrl.hostname;

    if (targetHostname === "localhost" && session.domain.sld === "localhost") {
      return true;
    }

    if (IP_ADDRESS_REGEX.test(targetHostname)) {
      return targetHostname === session.domain.fqdn;
    }

    const sessionDomain = session.domain.domain.toLowerCase();
    const targetDomain = tldtsParse(targetHostname).domain?.toLowerCase() || "";

    if (targetDomain === sessionDomain) {
      return true;
    }

    return targetHostname.endsWith(`.${sessionDomain}`);
  });
}
