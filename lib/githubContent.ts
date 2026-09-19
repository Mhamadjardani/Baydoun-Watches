import "server-only";

/**
 * Reads/writes product JSON files directly via GitHub's REST Contents API,
 * using a server-side Personal Access Token. This replaces going through
 * api.keystatic.cloud's GraphQL proxy, which only accepts its own internal
 * client's queries (confirmed: it rejects even the simplest possible ad-hoc
 * query with "Invalid query data" - not something we can work around by
 * changing our query shape).
 *
 * This does NOT touch Keystatic Cloud's session/auth at all - that's still
 * used purely as the "is this person logged in" gate in adminAuth.ts. Actual
 * repo access here uses its own dedicated credential, so it works
 * identically regardless of which storage mode the browser session came
 * from.
 *
 * Required env var: GITHUB_ADMIN_PAT
 *   Fine-grained GitHub PAT, scoped to ONLY this repo, with
 *   Contents: Read and write permission. Generate at:
 *   GitHub -> Settings -> Developer settings -> Fine-grained tokens
 */

const GITHUB_API = "https://api.github.com";
const REPO_OWNER = "Mhamadjardani";
const REPO_NAME = "Baydoun-Watches";
const BRANCH = "main";

const PRODUCT_FOLDERS: Record<string, string> = {
  calvinKlein: "calvin-klein",
  casio: "casio",
  dkny: "dkny",
  lacoste: "lacoste",
  omorfia: "omorfia",
  rovina: "rovina",
  tommyHilfiger: "tommy-hilfiger",
};

export function productFilePath(brand: string, sku: string) {
  const folder = PRODUCT_FOLDERS[brand];
  if (!folder) throw new Error("Unknown product brand");
  return `src/content/products/${folder}/${sku}.json`;
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

/**
 * Returns null if the file doesn't exist (404), throws on any other failure.
 */
export async function readGitHubProduct(brand: string, sku: string) {
  const path = productFilePath(brand, sku);
  const url = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;

  const response = await fetch(url, { headers: githubHeaders(), cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub read failed (${response.status}): ${detail}`);
  }

  const body = (await response.json()) as { content: string; encoding: string; sha: string };
  const content = Buffer.from(body.content, body.encoding as BufferEncoding).toString("utf8");

  return {
    path,
    sha: body.sha,
    product: JSON.parse(content) as Record<string, unknown>,
  };
}

export async function updateGitHubProductImageCount(brand: string, sku: string, imageCount: number) {
  const current = await readGitHubProduct(brand, sku);
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

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub write failed (${response.status}): ${detail}`);
  }

  return updatedProduct;
}
