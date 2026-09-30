import { useRef, useState } from "react";
import type { ReactNode } from "react";

type StickerProps = {
  children: ReactNode;
  /** starting position as a percentage of the viewport, 0-100 */
  startX: number;
  startY: number;
  /** resting tilt in degrees, so they don't all sit bolt upright */
  tilt?: number;
  label?: string;
};

/** keep at least this many px of the sticker on screen */
const EDGE_MARGIN = 24;

/**
 * a draggable thing. deliberately content-agnostic — it positions and drags
 * whatever you put inside it, so kaomoji today and an <img> later both work
 * without touching this file.
 */
export default function Sticker({
  children,
  startX,
  startY,
  tilt = 0,
  label,
}: StickerProps) {
  const [pos, setPos] = useState(() => ({
    x: (window.innerWidth * startX) / 100,
    y: (window.innerHeight * startY) / 100,
  }));
  const [dragging, setDragging] = useState(false);
  // where inside the sticker the pointer grabbed it, so it doesn't snap its
  // corner to the cursor on the first move
  const grabOffset = useRef({ x: 0, y: 0 });

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // capture means we keep getting move/up events even if the pointer
    // outruns the element, which it will
    e.currentTarget.setPointerCapture(e.pointerId);
    grabOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - grabOffset.current.x;
    const y = e.clientY - grabOffset.current.y;
    // clamp so a sticker can never be flung fully off screen and lost
    setPos({
      x: Math.min(
        Math.max(x, EDGE_MARGIN - box.width),
        window.innerWidth - EDGE_MARGIN,
      ),
      y: Math.min(
        Math.max(y, EDGE_MARGIN - box.height),
        window.innerHeight - EDGE_MARGIN,
      ),
    });
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  return (
    <div
      role="img"
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`pointer-events-auto fixed select-none touch-none text-ink ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        left: pos.x,
        top: pos.y,
        // straightens up and grows a little while held, which reads as
        // "picked up" without needing a physics library
        transform: `rotate(${dragging ? tilt * 0.3 : tilt}deg) scale(${
          dragging ? 1.18 : 1
        })`,
        // no transition mid-drag or the sticker lags behind the cursor
        transition: dragging ? "none" : "transform 160ms ease-out",
      }}
    >
      {children}
    </div>
  );
}
