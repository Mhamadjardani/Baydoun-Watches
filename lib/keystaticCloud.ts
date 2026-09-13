import "server-only";

const CLOUD_API = "https://api.keystatic.cloud";
const CLOUD_GRAPHQL = `${CLOUD_API}/v1/github/graphql`;
const CLOUD_HEADERS = { "x-keystatic-version": "0.5.50" };
// Keystatic Cloud resolves the connected repository from the Cloud session.
// Its own client uses these proxy variables rather than the GitHub account name.
const OWNER = "repo-owner";
const REPOSITORY = "repo-name";

const PRODUCT_FOLDERS: Record<string, string> = {
  calvinKlein: "calvin-klein",
  casio: "casio",
  dkny: "dkny",
  lacoste: "lacoste",
  omorfia: "omorfia",
  rovina: "rovina",
  tommyHilfiger: "tommy-hilfiger",
};

type CloudTreeEntry = { path: string; oid: string; type: string };

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, ...CLOUD_HEADERS };
}

export function productFilePath(brand: string, sku: string) {
  const folder = PRODUCT_FOLDERS[brand];
  if (!folder) throw new Error("Unknown product brand");
  return `src/content/products/${folder}/${sku}.json`;
}

async function cloudGraphql<T>(token: string, query: string, variables: Record<string, unknown>) {
  const response = await fetch(CLOUD_GRAPHQL, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const body = (await response.json()) as { data?: T; errors?: Array<{ message?: string }> };
  if (!response.ok || body.errors?.length || !body.data) {
    throw new Error(body.errors?.[0]?.message ?? "Keystatic Cloud request failed");
  }
  return body.data;
}

async function branchInfo(token: string) {
  const data = await cloudGraphql<{
    repository: { owner: { login: string }; name: string; ref: { target: { oid: string; tree: { oid: string } } } | null } | null;
  }>(token, `query ProductBranch($owner: String!, $name: String!, $ref: String!) {
    repository(owner: $owner, name: $name) {
      ref(qualifiedName: $ref) {
        target { oid ... on Commit { tree { oid } } }
      }
    }
  }`, { owner: OWNER, name: REPOSITORY, ref: "refs/heads/main" });

  const info = data.repository?.ref?.target;
  if (!info?.oid || !info.tree?.oid || !data.repository) throw new Error("Main branch is unavailable in Keystatic Cloud");
  return { ...info, repositoryNameWithOwner: `${data.repository.owner.login}/${data.repository.name}` };
}

export async function readCloudProduct(token: string, brand: string, sku: string) {
  const path = productFilePath(brand, sku);
  const branch = await branchInfo(token);
  const treeResponse = await fetch(`${CLOUD_API}/v1/github/trees/${branch.tree.oid}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!treeResponse.ok) throw new Error("Could not read the product tree from Keystatic Cloud");
  const treeBody = (await treeResponse.json()) as { tree?: CloudTreeEntry[] };
  const entry = treeBody.tree?.find((item) => item.path === path && item.type === "blob");
  if (!entry) return null;

  const blobResponse = await fetch(`${CLOUD_API}/v1/github/blob/${entry.oid}`, {
    headers: { ...authHeaders(token), Accept: "application/octet-stream" },
    cache: "no-store",
  });
  if (!blobResponse.ok) throw new Error("Could not read the product file from Keystatic Cloud");
  return {
    path,
    commitOid: branch.oid,
    repositoryNameWithOwner: branch.repositoryNameWithOwner,
    product: JSON.parse(await blobResponse.text()) as Record<string, unknown>,
  };
}

export async function updateCloudProductImageCount(token: string, brand: string, sku: string, imageCount: number) {
  const current = await readCloudProduct(token, brand, sku);
  if (!current) throw new Error("Product not found in Keystatic Cloud");
  const product = { ...current.product, imageCount };
  const content = Buffer.from(`${JSON.stringify(product, null, 2)}\n`, "utf8").toString("base64");

  await cloudGraphql(token, `mutation UpdateProduct($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) { ref { target { oid } } }
  }`, {
    input: {
      branch: { repositoryNameWithOwner: current.repositoryNameWithOwner, branchName: "main" },
      expectedHeadOid: current.commitOid,
      message: { headline: `Update image count for ${sku}` },
      fileChanges: { additions: [{ path: current.path, contents: content }], deletions: [] },
    },
  });
}
