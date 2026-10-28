import { useEffect, useState } from "react";

/**
 * Product photos are shot on solid white. To sit a watch on top of gold light,
 * rings or the 3D stage without tinting it (what `mix-blend-multiply` did), we
 * flood-fill the white background from the photo's edges and make it
 * transparent. Only white connected to the border is removed, so white dials
 * and straps inside the watch keep their colour.
 *
 * Results are cached per URL as object URLs. `null` means it could not be done
 * (CORS, decode error), and callers fall back to the original photo.
 */

const MAX_SIDE = 900;
/** A pixel is background when every channel is at least this bright... */
const WHITE_MIN = 236;
/** ...and it is close to neutral (not a pale coloured part of the watch). */
const MAX_CHROMA = 14;

const cache = new Map<string, Promise<string | null>>();
let queue: Promise<unknown> = Promise.resolve();

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function cut(src: string): Promise<string | null> {
  const img = await loadImage(src);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);
  const image = ctx.getImageData(0, 0, w, h);
  const px = image.data;

  const isBackground = (i: number) => {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    const lo = Math.min(r, g, b);
    return lo >= WHITE_MIN && Math.max(r, g, b) - lo <= MAX_CHROMA;
  };

  // Flood fill (4-connected) from every border pixel.
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let top = 0;
  const push = (p: number) => {
    if (!seen[p] && isBackground(p * 4)) {
      seen[p] = 1;
      stack[top++] = p;
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (top) {
    const p = stack[--top];
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < w * (h - 1)) push(p + w);
  }

  // Fade the removed pixels by how white they are, so edges stay soft.
  for (let p = 0; p < w * h; p++) {
    if (!seen[p]) continue;
    const i = p * 4;
    const lo = Math.min(px[i], px[i + 1], px[i + 2]);
    px[i + 3] = Math.round(((255 - lo) / (255 - WHITE_MIN)) * 255);
  }
  ctx.putImageData(image, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.92));
  return blob ? URL.createObjectURL(blob) : null;
}

/** Starts (or reuses) the cutout for a photo. One photo is processed at a time. */
export function prepareCutout(src: string): Promise<string | null> {
  let job = cache.get(src);
  if (!job) {
    job = queue.then(() => cut(src)).catch(() => null);
    queue = job;
    cache.set(src, job);
  }
  return job;
}

/** `undefined` while working, then the transparent image URL, or `null` on failure. */
export function useCutout(src: string | null | undefined, enabled = true) {
  const [state, setState] = useState<{ src: string; url: string | null } | null>(null);

  useEffect(() => {
    if (!src || !enabled) return;
    let alive = true;
    prepareCutout(src).then((url) => {
      if (alive) setState({ src, url });
    });
    return () => {
      alive = false;
    };
  }, [src, enabled]);

  return state && state.src === src ? state.url : undefined;
}
