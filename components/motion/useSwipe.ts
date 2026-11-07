import { useEffect, useRef, useState, type PointerEvent, type MouseEvent, type DragEvent } from "react";

const MIN_DISTANCE = 45;

/** True while the page is pinch-zoomed in (phones, or a touch preview on a laptop). */
function useZoomedIn() {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => setZoomed(viewport.scale > 1.01);
    update();
    viewport.addEventListener("resize", update);
    return () => viewport.removeEventListener("resize", update);
  }, []);

  return zoomed;
}

/**
 * Horizontal swipe (touch) or drag (mouse) on an element. Swiping left calls
 * `onSwipe(1)` (next), swiping right calls `onSwipe(-1)` (previous). Vertical
 * movement is left to the page so it still scrolls, and the click that ends a
 * swipe is swallowed so links under the finger don't open.
 *
 * While the page is zoomed in, swiping is off and the browser gets every
 * gesture back, so one finger pans around the zoomed page. Pinch-zoom always
 * works, and a second finger cancels the swipe.
 */
export function useSwipe(onSwipe: (direction: 1 | -1) => void) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  const zoomed = useZoomedIn();

  return {
    onPointerDown: (e: PointerEvent) => {
      if (zoomed || (e.pointerType === "mouse" && e.button !== 0)) return;
      // A second finger (not the primary pointer) means a pinch, not a swipe.
      start.current = e.isPrimary ? { x: e.clientX, y: e.clientY, id: e.pointerId } : null;
      swiped.current = false;
    },
    onPointerUp: (e: PointerEvent) => {
      const from = start.current;
      start.current = null;
      if (!from || zoomed || from.id !== e.pointerId) return;
      const dx = e.clientX - from.x;
      const dy = e.clientY - from.y;
      if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      swiped.current = true;
      onSwipe(dx < 0 ? 1 : -1);
    },
    onPointerCancel: () => {
      start.current = null;
    },
    onClickCapture: (e: MouseEvent) => {
      if (!swiped.current) return;
      swiped.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
    // Stop the browser's own image/link dragging from stealing a mouse swipe.
    onDragStart: (e: DragEvent) => {
      if (!zoomed) e.preventDefault();
    },
    style: { touchAction: zoomed ? "auto" : "pan-y pinch-zoom" } as const,
  };
}
