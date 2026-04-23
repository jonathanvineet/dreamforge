import { useEffect, useState } from "react";

export function CursorDot() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[60] h-8 w-8 rounded-full border border-foreground/15 bg-foreground/[0.02] backdrop-blur-[2px] transition-[transform,opacity] duration-500 ease-out-soft"
      style={{
        transform: `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0)`,
      }}
    />
  );
}
