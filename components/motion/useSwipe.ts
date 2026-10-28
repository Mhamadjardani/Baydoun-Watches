import { useRef, type PointerEvent, type MouseEvent, type DragEvent } from "react";

const MIN_DISTANCE = 45;

/**
 * Horizontal swipe (touch) or drag (mouse) on an element. Swiping left calls
 * `onSwipe(1)` (next), swiping right calls `onSwipe(-1)` (previous). Vertical
 * movement is left to the page so it still scrolls, and the click that ends a
 * swipe is swallowed so links under the finger don't open.
 */
export function useSwipe(onSwipe: (direction: 1 | -1) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      start.current = { x: e.clientX, y: e.clientY };
      swiped.current = false;
    },
    onPointerUp: (e: PointerEvent) => {
      const from = start.current;
      start.current = null;
      if (!from) return;
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
    onDragStart: (e: DragEvent) => e.preventDefault(),
    style: { touchAction: "pan-y" } as const,
  };
}
