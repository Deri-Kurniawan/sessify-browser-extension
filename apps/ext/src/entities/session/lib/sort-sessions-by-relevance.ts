import type { Browser } from "#imports";
import type { Session } from "../model/types";

const EXACT_MATCH_SCORE = 1;
const NO_MATCH_SCORE = 0;

export function sortSessionsByRelevance(
  sessions: Session[],
  activeTabUrl: URL,
  activeTab: Browser.tabs.Tab | null,
): Session[] {
  return sessions
    .map((session) => {
      if (
        activeTabUrl.hostname === session.domain.fqdn &&
        (session.domain.port === null
          ? activeTabUrl.port === ""
          : session.domain.port === Number.parseInt(activeTabUrl.port, 10))
      ) {
        return {
          ...session,
          appIconUrl: activeTab?.favIconUrl || session.appIconUrl,
        };
      }

      return session;
    })
    .sort((sessionA, sessionB) => {
      const sessionAIsExactMatch =
        sessionA.domain.fqdn === activeTabUrl.hostname
          ? EXACT_MATCH_SCORE
          : NO_MATCH_SCORE;
      const sessionBIsExactMatch =
        sessionB.domain.fqdn === activeTabUrl.hostname
          ? EXACT_MATCH_SCORE
          : NO_MATCH_SCORE;

      if (sessionAIsExactMatch !== sessionBIsExactMatch) {
        return sessionBIsExactMatch - sessionAIsExactMatch;
      }

      return sessionB.createdAt - sessionA.createdAt;
    });
}
