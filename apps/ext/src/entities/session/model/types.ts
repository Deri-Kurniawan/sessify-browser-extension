import type { Browser } from "#imports";
import type { SiteStorageState } from "@/shared/lib/browser/site-storage";

export type SessionDomain = {
  domain: string;
  sld: string;
  subdomain: string;
  fqdn: string;
  tld: string;
  isIp: boolean;
  isIcann: boolean;
  port: number | null;
};

export type SessionState = SiteStorageState & {
  cookies: Browser.cookies.Cookie[];
};

export type Session = {
  id: string;
  appIconUrl: string;
  title: string;
  domain: SessionDomain;
  createdAt: number;
  updatedAt: number;
  state: SessionState;
};
