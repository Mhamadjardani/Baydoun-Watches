import "server-only";

const GITHUB_API = "https://api.github.com";
const OWNER = "Mhamadjardani";
const REPOSITORY = "Baydoun-Watches";

const PRODUCT_FOLDERS: Record<string, string> = {
  calvinKlein: "calvin-klein",
  casio: "casio",
  // dkny: "dkny",
  lacoste: "lacoste",
  omorfia: "omorfia",
  rovina: "rovina",
  tommyHilfiger: "tommy-hilfiger",
};

function githubHeaders(token: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export function productFilePath(brand: string, sku: string) {
  const folder = PRODUCT_FOLDERS[brand];
  if (!folder) throw new Error("Unknown product brand");
  return `src/content/products/${folder}/${sku}.json`;
}

export async function readCloudProduct(token: string, brand: string, sku: string) {
  const path = productFilePath(brand, sku);
  const response = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPOSITORY}/contents/${path}?ref=main`, {
    headers: githubHeaders(token),
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Could not read the product file from GitHub");

  const file = (await response.json()) as { sha: string; content: string };
  return {
    path,
    sha: file.sha,
    product: JSON.parse(Buffer.from(file.content.replace(/\s/g, ""), "base64").toString("utf8")) as Record<string, unknown>,
  };
}

export async function updateCloudProductImageCount(token: string, brand: string, sku: string, imageCount: number) {
  const current = await readCloudProduct(token, brand, sku);
  if (!current) throw new Error("Product not found in GitHub");
  const product = { ...current.product, imageCount };
  const content = Buffer.from(`${JSON.stringify(product, null, 2)}\n`, "utf8").toString("base64");
  const response = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPOSITORY}/contents/${current.path}`, {
    method: "PUT",
    headers: { ...githubHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message: `Update image count for ${sku}`, content, sha: current.sha }),
  });
  if (!response.ok) throw new Error("Image deleted, but imageCount could not be updated in GitHub");
}
