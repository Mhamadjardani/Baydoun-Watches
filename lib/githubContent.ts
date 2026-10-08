import "server-only";

/**
 * Reads/writes product JSON files directly via GitHub's API, using a
 * server-side Personal Access Token. This replaces going through
 * api.keystatic.cloud's GraphQL proxy, which only accepts its own internal
 * client's queries (confirmed: it rejects even the simplest possible ad-hoc
 * query with "Invalid query data" - not something we can work around by
 * changing our query shape).
 *
 * This does NOT touch Keystatic's session/auth at all - that's handled in
 * adminAuth.ts. Actual repo access here uses its own dedicated credential.
 *
 * Required env var: GITHUB_ADMIN_PAT
 *   Fine-grained GitHub PAT, scoped to ONLY this repo, with
 *   Contents: Read and write permission. Generate at:
 *   GitHub -> Settings -> Developer settings -> Fine-grained tokens
 */

const GITHUB_API = "https://api.github.com";
export const REPO_OWNER = "Mhamadjardani";
export const REPO_NAME = "Baydoun-Watches";
const BRANCH = "main";

// Reads are cached per server instance so repeated admin refreshes don't
// re-hit GitHub. Writes below update the cache directly.
const READ_CACHE_TTL_MS = 30_000;
export const MAX_BATCH_SIZE = 48;

const PRODUCT_FOLDERS: Record<string, string> = {
  calvinKlein: "calvin-klein",
  casio: "casio",
  dkny: "dkny",
  lacoste: "lacoste",
  omorfia: "omorfia",
  rovina: "rovina",
  tommyHilfiger: "tommy-hilfiger",
};

type ProductData = Record<string, unknown>;
type ProductRef = { brand: string; sku: string };

const readCache = new Map<string, { product: ProductData | null; expires: number }>();

/** Thrown when GitHub rate-limits the PAT; callers should surface Retry-After. */
export class GitHubRateLimitError extends Error {
  constructor(public retryAfterSeconds: number) {
    super(`GitHub rate limit reached. Try again in ${retryAfterSeconds}s.`);
  }
}

export function productFilePath(brand: string, sku: string) {
  const folder = PRODUCT_FOLDERS[brand];
  if (!folder) throw new Error("Unknown product brand");
  return `src/content/products/${folder}/${sku}.json`;
}

function cacheKey(brand: string, sku: string) {
  return `${brand}/${sku}`;
}

function requirePat() {
  const pat = process.env.GITHUB_ADMIN_PAT;
  if (!pat) throw new Error("GITHUB_ADMIN_PAT is not configured on the server");
  return pat;
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${requirePat()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function throwIfRateLimited(response: Response) {
  const exhausted = response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0";
  const secondary = response.status === 403 && response.headers.has("retry-after");
  if (response.status !== 429 && !exhausted && !secondary) return;

  const retryAfter = Number(response.headers.get("retry-after"));
  const reset = Number(response.headers.get("x-ratelimit-reset"));
  const seconds = retryAfter > 0
    ? retryAfter
    : reset > 0
      ? Math.max(1, Math.ceil(reset - Date.now() / 1000))
      : 60;
  throw new GitHubRateLimitError(seconds);
}

/**
 * Reads many product files with a single GraphQL request (cost: 1 point).
 * Returns a map keyed by "brand/sku"; missing files map to null.
 */
export async function readGitHubProducts(refs: ProductRef[]) {
  const results = new Map<string, ProductData | null>();
  const now = Date.now();
  const toFetch: ProductRef[] = [];

  for (const ref of refs) {
    const key = cacheKey(ref.brand, ref.sku);
    if (results.has(key)) continue;
    const cached = readCache.get(key);
    if (cached && cached.expires > now) results.set(key, cached.product);
    else toFetch.push(ref);
  }

  if (toFetch.length === 0) return results;

  const variables: Record<string, string> = {};
  const declarations: string[] = [];
  const fields: string[] = [];
  toFetch.forEach((ref, index) => {
    variables[`e${index}`] = `${BRANCH}:${productFilePath(ref.brand, ref.sku)}`;
    declarations.push(`$e${index}: String!`);
    fields.push(`p${index}: object(expression: $e${index}) { ... on Blob { text } }`);
  });
  const query = `query(${declarations.join(", ")}) { repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") { ${fields.join(" ")} } }`;

  const response = await fetch(`${GITHUB_API}/graphql`, {
    method: "POST",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  throwIfRateLimited(response);
  if (!response.ok) {
    throw new Error(`GitHub read failed (${response.status}): ${await response.text()}`);
  }

  const body = (await response.json()) as {
    data?: { repository: Record<string, { text: string } | null> | null };
    errors?: { type?: string; message: string }[];
  };
  if (body.errors?.some((error) => error.type === "RATE_LIMITED")) {
    throw new GitHubRateLimitError(60);
  }
  if (!body.data?.repository) {
    throw new Error(`GitHub read failed: ${body.errors?.map((error) => error.message).join("; ") ?? "no data"}`);
  }

  const expires = Date.now() + READ_CACHE_TTL_MS;
  toFetch.forEach((ref, index) => {
    const blob = body.data!.repository![`p${index}`];
    const product = blob ? (JSON.parse(blob.text) as ProductData) : null;
    const key = cacheKey(ref.brand, ref.sku);
    readCache.set(key, { product, expires });
    results.set(key, product);
  });

  if (readCache.size > 2000) {
    for (const [key, entry] of readCache) if (entry.expires <= Date.now()) readCache.delete(key);
  }

  return results;
}

/**
 * Uncached single-file read that also returns the blob sha, for writes.
 * Returns null if the file doesn't exist (404), throws on any other failure.
 */
export async function readGitHubProduct(brand: string, sku: string) {
  const path = productFilePath(brand, sku);
  const url = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;

  const response = await fetch(url, { headers: githubHeaders(), cache: "no-store" });
  if (response.status === 404) return null;
  throwIfRateLimited(response);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub read failed (${response.status}): ${detail}`);
  }

  const body = (await response.json()) as { content: string; encoding: string; sha: string };
  const content = Buffer.from(body.content, body.encoding as BufferEncoding).toString("utf8");

  return {
    path,
    sha: body.sha,
    product: JSON.parse(content) as ProductData,
  };
}

export async function updateGitHubProductImageCount(
  brand: string,
  sku: string,
  imageCount: number,
  current?: NonNullable<Awaited<ReturnType<typeof readGitHubProduct>>>,
) {
  current ??= (await readGitHubProduct(brand, sku)) ?? undefined;
  if (!current) throw new Error("Product not found in GitHub");

  const updatedProduct = { ...current.product, imageCount };
  const newContent = Buffer.from(`${JSON.stringify(updatedProduct, null, 2)}\n`, "utf8").toString("base64");

  const url = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${current.path}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Update image count for ${sku}`,
      content: newContent,
      sha: current.sha,
      branch: BRANCH,
    }),
  });

  throwIfRateLimited(response);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub write failed (${response.status}): ${detail}`);
  }

  readCache.set(cacheKey(brand, sku), { product: updatedProduct, expires: Date.now() + READ_CACHE_TTL_MS });
  return updatedProduct;
}
