import "server-only";

import { cookies } from "next/headers";

/**
 * Keystatic's GitHub storage uses this access-token cookie after login.
 * Keystatic itself reads this same cookie in the browser. We use its presence
 * as the shared session gate because server-side GitHub API validation can be
 * unavailable in local/dev environments even while Keystatic is working.
 */
export async function getKeystaticGitHubUser(request?: Request) {
  const token = await getKeystaticGitHubAccessToken(request);

  if (!token) return null;

  return { login: "Keystatic GitHub user" };
}

export async function getKeystaticGitHubAccessToken(request?: Request) {
  return request?.headers.get("x-keystatic-access-token") ??
    (await cookies()).get("keystatic-gh-access-token")?.value ??
    null;
}
