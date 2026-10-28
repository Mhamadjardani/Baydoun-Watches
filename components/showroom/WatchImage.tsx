// Rendered inside client components only, so it can take callback props.
import { useCutout } from "@/lib/cutout";
import { useState, type CSSProperties } from "react";

const FALLBACK_IMAGE = "/baydoun-logo.webp";

/**
 * A catalogue photo with its white background removed, so the watch keeps its
 * real colours and sits on top of any light or ring behind it.
 *
 * `whileLoading`: "blend" shows the photo with multiply until the cutout is
 * ready (fine on a light tile); "hide" keeps it invisible instead (for the 3D
 * stage, where a white box would show). If the cutout fails, the plain photo
 * is shown.
 */
export default function WatchImage({
  src,
  alt,
  className = "",
  style,
  loading = "lazy",
  whileLoading = "blend",
  onMissing,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
  whileLoading?: "blend" | "hide";
  /** Called when the photo does not exist; the logo is shown in its place. */
  onMissing?: () => void;
}) {
  const [failed, setFailedState] = useState(false);
  const setFailed = (value: boolean) => {
    setFailedState(value);
    if (value) onMissing?.();
  };
  const [loaded, setLoaded] = useState(false);
  // Wait for the visible <img> to load (it is lazy) so off-screen photos are not processed.
  const cutout = useCutout(failed ? null : src, loaded);
  const ready = cutout !== undefined;

  const shown = failed ? FALLBACK_IMAGE : (cutout ?? src);
  const look = failed || cutout
    ? ""
    : whileLoading === "hide" && !ready
      ? "opacity-0"
      : "mix-blend-multiply";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={shown}
      alt={alt}
      loading={loading}
      crossOrigin={failed ? undefined : "anonymous"}
      onLoad={() => setLoaded(true)}
      onError={() => {
        // The cutout object URL never errors; only the original photo can.
        if (!ready || shown === src) setFailed(true);
      }}
      // Server-rendered images can fail or finish before React listens; check on mount.
      ref={(el) => {
        if (!el || !el.complete || failed) return;
        if (el.naturalWidth === 0) setFailed(true);
        else if (!loaded) setLoaded(true);
      }}
      style={style}
      className={`transition-opacity duration-500 ${look} ${className}`}
    />
  );
}
