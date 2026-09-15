import "server-only";

import { cookies } from "next/headers";

/**
 * Shared session gate for both storage modes. The client (see
 * browserKeystaticToken() in ProductImageAdmin.tsx) already resolves the
 * right token itself - GitHub's cookie value if present, otherwise the
 * Keystatic Cloud token from localStorage - and always forwards it via the
 * same x-keystatic-access-token header. So this one function correctly
 * handles both modes already; no separate "cloud" variant is needed.
 */
export async function getKeystaticGitHubUser(request?: Request) {
  const token = await getKeystaticGitHubAccessToken(request);

  if (!token) return null;

  return { login: "Keystatic session user" };
}

export async function getKeystaticGitHubAccessToken(request?: Request) {
  return request?.headers.get("x-keystatic-access-token") ??
    (await cookies()).get("keystatic-gh-access-token")?.value ??
    null;
}
