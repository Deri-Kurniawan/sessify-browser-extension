import { env } from "@/env";

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
}

const GITHUB_URL_REGEX = /github\.com\/([^/]+)\/([^/]+)/;

export async function getLatestRelease(): Promise<GitHubRelease | null> {
  try {
    const match = env.NEXT_PUBLIC_GITHUB_URL.match(GITHUB_URL_REGEX);

    if (!match) {
      return null;
    }

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Sessify-Website",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const data: GitHubRelease = await response.json();
    return data;
  } catch {
    return null;
  }
}
