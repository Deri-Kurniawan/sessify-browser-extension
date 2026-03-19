import moment from "moment";
import { parse as tldtsParse } from "tldts";
import type { Browser } from "#imports";
import type { SiteStorageState } from "@/shared/lib/browser/site-storage";
import type { Session } from "../model/types";

export function createSession(
  currentTab: Browser.tabs.Tab,
  tabUrl: URL,
  tabStorage: SiteStorageState,
  title: string | null,
): Session {
  const parsedDomain = tldtsParse(currentTab.url || "");

  return {
    id: crypto.randomUUID(),
    appIconUrl: currentTab.favIconUrl || "/public/icon32.png",
    title: title || moment().format("MMM D, YYYY, HH:mm:ss"),
    domain: {
      domain: parsedDomain.domain || "",
      subdomain: parsedDomain.subdomain || "",
      sld: parsedDomain.domainWithoutSuffix || "",
      tld: parsedDomain.publicSuffix || "",
      fqdn: parsedDomain.hostname || tabUrl.hostname,
      isIp: Boolean(parsedDomain.isIp),
      isIcann: Boolean(parsedDomain.isIcann),
      port: tabUrl.port ? Number.parseInt(tabUrl.port, 10) : null,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    state: {
      localStorage: tabStorage.localStorage,
      sessionStorage: tabStorage.sessionStorage,
      cookies: tabStorage.cookies,
    },
  };
}
