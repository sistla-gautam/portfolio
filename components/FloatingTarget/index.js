import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const COLS = 24;
const ROWS = 14;
const COUNT = COLS * ROWS;
const LERP = 0.18;
const LINE_LENGTH_RATIO = 0.45;

function lerpAngle(a, b, t) {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return a + diff * t;
}

export default function MagneticFilings({ sectionRef }) {
  const canvasRef = useRef();
  const anglesRef = useRef(new Float32Array(COUNT));
  const mouseRef = useRef({ x: null, y: null });
  const rafRef = useRef();
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const section = sectionRef?.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    section.addEventListener("mousemove", onMove);

    const resize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      const { x: mx, y: my } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      const isDark = themeRef.current !== "light";
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";

      const cellW = w / COLS;
      const cellH = h / ROWS;
      const halfLen = Math.min(cellW, cellH) * LINE_LENGTH_RATIO;

      for (let i = 0; i < COUNT; i++) {
        const col = i % COLS;
        const row = (i / COLS) | 0;
        const cx = (col + 0.5) * cellW;
        const cy = (row + 0.5) * cellH;

        if (mx !== null) {
          const target = Math.atan2(my - cy, mx - cx) * (180 / Math.PI);
          anglesRef.current[i] = lerpAngle(anglesRef.current[i], target, LERP);
        }

        const rad = anglesRef.current[i] * (Math.PI / 180);
        const dx = Math.cos(rad) * halfLen;
        const dy = Math.sin(rad) * halfLen;

        ctx.beginPath();
        ctx.moveTo(cx - dx, cy - dy);
        ctx.lineTo(cx + dx, cy + dy);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    />
  );
}
