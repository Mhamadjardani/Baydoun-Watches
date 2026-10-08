import "server-only";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";

import { REPO_NAME, REPO_OWNER } from "./githubContent";

/**
 * Admin gate. The client forwards the Keystatic GitHub session token (see
 * browserKeystaticToken() in ProductImageAdmin.tsx) via the
 * x-keystatic-access-token header; the cookie is the fallback. A token only
 * counts if GitHub accepts it AND its user can push to the content repo -
 * i.e. exactly the people who can already edit products in Keystatic.
 *
 * Results are cached per server instance (keyed by a hash of the token) so
 * admin requests don't each cost two GitHub calls.
 */

export type AdminUser = { login: string };

const ALLOWED_TTL_MS = 5 * 60_000;
const DENIED_TTL_MS = 60_000;
const sessions = new Map<string, { user: AdminUser | null; expires: number }>();

async function readSessionToken(request?: Request) {
  return request?.headers.get("x-keystatic-access-token") ||
    (await cookies()).get("keystatic-gh-access-token")?.value ||
    null;
}

async function verifyWithGitHub(token: string): Promise<{ user: AdminUser | null; cacheable: boolean }> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const denied = (status: number) => ({ user: null, cacheable: status === 401 || status === 403 || status === 404 });

  const repoResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, { headers, cache: "no-store" });
  if (!repoResponse.ok) return denied(repoResponse.status);
  const repo = (await repoResponse.json()) as { permissions?: { push?: boolean } };
  if (!repo.permissions?.push) return { user: null, cacheable: true };

  const userResponse = await fetch("https://api.github.com/user", { headers, cache: "no-store" });
  if (!userResponse.ok) return denied(userResponse.status);
  const { login } = (await userResponse.json()) as { login: string };
  return { user: { login }, cacheable: true };
}

/** Returns the signed-in Keystatic user if they have push access to the repo, else null. */
export async function getAdminUser(request?: Request): Promise<AdminUser | null> {
  const token = await readSessionToken(request);
  if (!token) return null;

  const key = createHash("sha256").update(token).digest("hex");
  const cached = sessions.get(key);
  if (cached && cached.expires > Date.now()) return cached.user;

  try {
    const { user, cacheable } = await verifyWithGitHub(token);
    if (cacheable) {
      sessions.set(key, { user, expires: Date.now() + (user ? ALLOWED_TTL_MS : DENIED_TTL_MS) });
      if (sessions.size > 200) {
        for (const [entryKey, entry] of sessions) if (entry.expires <= Date.now()) sessions.delete(entryKey);
      }
    }
    return user;
  } catch (error) {
    console.error("Admin session verification failed", error);
    return null;
  }
}
