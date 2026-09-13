"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Product = { slug: string; brand: string; title: string; imageCount: number; price: number; image: string };
type Props = { products: Product[]; githubLogin: string; supabaseUrl: string };
const PAGE_SIZE = 24;

function browserKeystaticToken() {
  const githubToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("keystatic-gh-access-token="))
    ?.split("=")[1];

  if (githubToken) return decodeURIComponent(githubToken);

  try {
    const cloudData = JSON.parse(localStorage.getItem("keystatic-cloud-access-token") ?? "null") as { token?: string; project?: string } | null;
    if (cloudData?.project === "baydoun-watches/baydoun-watches" && cloudData.token) {
      return cloudData.token;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function imageUrl(base: string, brand: string, sku: string, slot: number, version: number) {
  return `${base}/storage/v1/object/public/products/${brand}/${sku}/${slot}.webp?v=${version}`;
}

function ImageSlot({ src, slot, title, busy, onSelect }: { src: string; slot: number; title: string; busy: boolean; onSelect: (file: File) => void }) {
  const [missing, setMissing] = useState(false);
  return (
    <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-[#e8d49a]/20 bg-[#0d0d0d] transition hover:border-[#e8d49a]">
      {!missing ? <img alt={`${title} image ${slot}`} className="h-full w-full object-contain p-2" onError={() => setMissing(true)} src={src} /> : <><span className="mb-2 grid h-9 w-9 place-items-center rounded-full bg-[#e8d49a]/10 text-xl text-[#e8d49a]">+</span><span className="px-2 text-center text-[11px] font-medium text-[#e8d49a]">Upload image {slot}</span><span className="mt-1 text-[10px] text-white/40">WebP only</span></>}
      <span className="absolute left-2 top-2 rounded-md bg-[#131313]/90 px-2 py-1 text-[10px] font-semibold text-[#e8d49a]">{slot}.webp</span>
      <span className="absolute inset-x-0 bottom-0 translate-y-full bg-[#131313]/90 px-2 py-2 text-center text-[10px] text-white transition group-hover:translate-y-0">Replace image {slot}</span>
      {busy && <span className="absolute inset-0 grid place-items-center bg-[#131313]/90 text-xs text-[#e8d49a]">Saving…</span>}
      <input accept="image/webp,.webp" className="absolute inset-0 cursor-pointer opacity-0" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) onSelect(file); event.currentTarget.value = ""; }} type="file" />
    </label>
  );
}

export default function ProductImageAdmin({ products, githubLogin, supabaseUrl }: Props) {
  const router = useRouter();
  const [productData, setProductData] = useState(products);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [imageVersion, setImageVersion] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<{ brand: string; sku: string; slot: number } | null>(null);
  const [dialog, setDialog] = useState<{ title: string; body: string; kind: "success" | "error" } | null>(null);
  const brands = useMemo(() => [...new Set(productData.map((product) => product.brand))].sort(), [productData]);
  const filtered = useMemo(() => { const normalized = query.trim().toLowerCase(); return productData.filter((product) => (brand === "all" || product.brand === brand) && (!normalized || product.slug.toLowerCase().includes(normalized) || product.title.toLowerCase().includes(normalized))); }, [brand, productData, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const visibleKey = visibleProducts.map((product) => `${product.brand}/${product.slug}`).join("|");
  useEffect(() => {
    const syncVisibleProducts = async () => {
      const latest = await Promise.all(visibleProducts.map(async (product) => {
        const token = browserKeystaticToken();
        const response = await fetch(`/api/admin/products?brand=${encodeURIComponent(product.brand)}&sku=${encodeURIComponent(product.slug)}`, { headers: token ? { "x-keystatic-access-token": token } : undefined, credentials: "include", cache: "no-store" });
        return response.ok ? (await response.json() as Product) : null;
      }));
      const updates = new Map(latest.filter((product): product is Product => product !== null).map((product) => [`${product.brand}/${product.slug}`, product]));
      if (updates.size) setProductData((current) => current.map((product) => updates.get(`${product.brand}/${product.slug}`) ?? product));
    };
    void syncVisibleProducts();
    const interval = window.setInterval(() => void syncVisibleProducts(), 10000);
    window.addEventListener("focus", syncVisibleProducts);
    document.addEventListener("visibilitychange", syncVisibleProducts);
    return () => { window.clearInterval(interval); window.removeEventListener("focus", syncVisibleProducts); document.removeEventListener("visibilitychange", syncVisibleProducts); };
  // visibleKey intentionally controls the sync target without restarting on each object refresh.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKey]);
  useEffect(() => { const unlockScroll = () => { document.body.style.overflow = ""; document.documentElement.style.overflow = ""; }; unlockScroll(); window.addEventListener("pageshow", unlockScroll); return () => { window.removeEventListener("pageshow", unlockScroll); unlockScroll(); }; }, []);

  function requestHeaders() {
    const token = browserKeystaticToken();
    return token ? { "x-keystatic-access-token": token } : undefined;
  }

  async function upload(brandName: string, sku: string, slot: number, file: File) {
    const key = `${brandName}/${sku}/${slot}`; setBusy(key); setMessage(""); const formData = new FormData(); formData.set("file", file);
    try { const response = await fetch(`/api/admin/product-images?brand=${encodeURIComponent(brandName)}&sku=${encodeURIComponent(sku)}&slot=${slot}`, { method: "POST", body: formData, credentials: "include", headers: requestHeaders() }); const data = await response.json(); if (!response.ok) { if (response.status === 401) throw new Error("Your Keystatic session was not received. Sign in again in Keystatic, then return here."); throw new Error(data.error ?? "Upload failed"); } setImageVersion((value) => value + 1); setDialog({ title: "Image saved", body: `${slot}.webp was replaced successfully. The numbered filename stayed unchanged.`, kind: "success" }); router.refresh(); } catch (error) { setDialog({ title: "Upload failed", body: error instanceof Error ? error.message : "Upload failed", kind: "error" }); } finally { setBusy(null); }
  }

  async function remove(brandName: string, sku: string, slot: number) {
    if (slot <= 1) { setDialog({ title: "Image 1 cannot be deleted", body: "Keep at least one image slot. Replace image 1 instead.", kind: "error" }); return; }
    setConfirmDelete({ brand: brandName, sku, slot });
  }

  async function confirmRemove() {
    if (!confirmDelete) return;
    const { brand: brandName, sku, slot } = confirmDelete;
    setConfirmDelete(null);
    const key = `${brandName}/${sku}/${slot}`; setBusy(key); setMessage("");
    try { const response = await fetch(`/api/admin/product-images?brand=${encodeURIComponent(brandName)}&sku=${encodeURIComponent(sku)}&slot=${slot}`, { method: "DELETE", credentials: "include", headers: requestHeaders() }); const data = await response.json(); if (!response.ok) { if (response.status === 401) throw new Error("Your Keystatic session was not received. Sign in again in Keystatic, then return here."); throw new Error(data.error ?? "Delete failed"); } setImageVersion((value) => value + 1); setDialog({ title: "Image deleted", body: `${slot}.webp was deleted and Image Count was updated.`, kind: "success" }); router.refresh(); } catch (error) { setDialog({ title: "Delete failed", body: error instanceof Error ? error.message : "Delete failed", kind: "error" }); } finally { setBusy(null); }
  }

  return (
    <main className="h-screen overflow-y-auto overscroll-contain bg-[#131313] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-7 rounded-2xl border border-[#e8d49a]/20 bg-[#1a1a1a] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5"><div><div className="mb-3 flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#e8d49a] shadow-[0_0_12px_#e8d49a]" /><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e8d49a]">Baydoun Watches · Studio</p></div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Product image library</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Replace numbered product images without renaming them. Missing images appear as upload-ready slots, and the library refreshes after Keystatic edits.</p></div><Link className="rounded-xl border border-[#e8d49a]/40 px-4 py-2.5 text-sm font-medium text-[#e8d49a] transition hover:bg-[#e8d49a] hover:text-[#131313]" href="/keystatic/">Open Keystatic ↗</Link></div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-xs text-white/45"><span>Session: <strong className="font-medium text-white/75">{githubLogin}</strong></span><span>{products.length} products</span><span>Auto-refresh: 10 seconds</span></div>
        </header>
        <section className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] p-3"><input className="min-w-64 flex-1 rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#e8d49a]" onChange={(event) => setQuery(event.target.value)} placeholder="Search by SKU or product name…" value={query} /><select className="rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e8d49a]" onChange={(event) => setBrand(event.target.value)} value={brand}><option value="all">All brands</option>{brands.map((name) => <option key={name} value={name}>{name}</option>)}</select><span className="px-2 text-xs text-white/45">Showing {visibleProducts.length} of {filtered.length}</span></section>
        {message && <div className="mb-5 rounded-xl border border-[#e8d49a]/30 bg-[#e8d49a]/10 px-4 py-3 text-sm text-[#e8d49a]">{message}</div>}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product) => <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] transition hover:border-[#e8d49a]/40" key={`${product.brand}/${product.slug}`}><div className="relative aspect-[1.15] bg-[#f8f7f2] p-4"><img alt={product.title} className="h-full w-full object-contain" src={`${product.image}?v=${imageVersion}`} /><span className="absolute left-3 top-3 rounded-md bg-[#131313]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#e8d49a]">{product.brand}</span></div><div className="p-4"><h2 className="truncate font-medium">{product.title}</h2><p className="mt-1 text-xs text-white/45">{product.slug} · {product.imageCount} image{product.imageCount === 1 ? "" : "s"}</p><div className="mt-4 grid grid-cols-2 gap-2">{Array.from({ length: product.imageCount }, (_, index) => { const slot = index + 1; const key = `${product.brand}/${product.slug}/${slot}`; return <ImageSlot busy={busy === key} key={`${slot}-${imageVersion}`} onSelect={(file) => void upload(product.brand, product.slug, slot, file)} slot={slot} src={imageUrl(supabaseUrl, product.brand, product.slug, slot, imageVersion)} title={product.title} />; })}</div><div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs"><button className="text-white/45 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40" disabled={product.imageCount <= 1 || busy !== null} onClick={() => void remove(product.brand, product.slug, product.imageCount)} type="button">Delete last</button><Link className="font-medium text-[#e8d49a] transition hover:text-white" href={`/keystatic/branch/main/collection/${product.brand}/item/${product.slug}`}>Edit details →</Link></div></div></article>)}</div>
        <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Product pagination"><button className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:border-[#e8d49a] hover:text-[#e8d49a] disabled:opacity-30" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} type="button">← Previous</button><span className="text-sm text-white/50">Page <strong className="text-white">{currentPage}</strong> of {totalPages}</span><button className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:border-[#e8d49a] hover:text-[#e8d49a] disabled:opacity-30" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} type="button">Next →</button></nav>
      </div>
      {confirmDelete && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-2xl border border-[#e8d49a]/30 bg-[#1a1a1a] p-6 shadow-2xl"><div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-red-400/10 text-xl text-red-300">!</div><h2 className="text-xl font-semibold">Delete image?</h2><p className="mt-2 text-sm leading-6 text-white/55">This permanently deletes <strong className="text-white">{confirmDelete.slot}.webp</strong> for <strong className="text-white">{confirmDelete.sku}</strong> and reduces its Image Count. This cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/65 hover:border-white/30" onClick={() => setConfirmDelete(null)} type="button">Cancel</button><button className="rounded-lg bg-red-400 px-4 py-2 text-sm font-semibold text-[#131313] hover:bg-red-300" onClick={() => void confirmRemove()} type="button">Delete image</button></div></div></div>}
      {dialog && <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-2xl border border-[#e8d49a]/30 bg-[#1a1a1a] p-6 shadow-2xl"><div className={`mb-4 grid h-11 w-11 place-items-center rounded-full ${dialog.kind === "success" ? "bg-[#e8d49a]/10 text-[#e8d49a]" : "bg-red-400/10 text-red-300"}`}>{dialog.kind === "success" ? "✓" : "!"}</div><h2 className="text-xl font-semibold">{dialog.title}</h2><p className="mt-2 text-sm leading-6 text-white/55">{dialog.body}</p><div className="mt-6 flex justify-end"><button className="rounded-lg bg-[#e8d49a] px-4 py-2 text-sm font-semibold text-[#131313] hover:bg-[#f2e3ad]" onClick={() => setDialog(null)} type="button">Done</button></div></div></div>}
    </main>
  );
}
