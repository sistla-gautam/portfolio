import { useEffect, useRef } from "react";

const COLS = 24;
const ROWS = 14;
const COUNT = COLS * ROWS;

function lerpAngle(a, b, t) {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return a + diff * t;
}

export default function MagneticFilings({ sectionRef }) {
  const containerRef = useRef();
  const anglesRef = useRef(new Float32Array(COUNT));
  const mouseRef = useRef({ x: null, y: null });
  const cellsRef = useRef([]);
  const rafRef = useRef();

  useEffect(() => {
    const section = sectionRef?.current;
    if (!section) return;

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    section.addEventListener("mousemove", onMove);

    const tick = () => {
      const container = containerRef.current;
      const { x: mx, y: my } = mouseRef.current;

      if (container && mx !== null) {
        const rect = container.getBoundingClientRect();
        const cellW = rect.width / COLS;
        const cellH = rect.height / ROWS;

        for (let i = 0; i < COUNT; i++) {
          const col = i % COLS;
          const row = (i / COLS) | 0;
          const cx = rect.left + (col + 0.5) * cellW;
          const cy = rect.top + (row + 0.5) * cellH;
          const target = Math.atan2(my - cy, mx - cx) * (180 / Math.PI);
          anglesRef.current[i] = lerpAngle(anglesRef.current[i], target, 0.18);
          const el = cellsRef.current[i];
          if (el) el.style.transform = `rotate(${anglesRef.current[i]}deg)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            ref={el => { cellsRef.current[i] = el; }}
            style={{
              width: "55%",
              height: "1.5px",
              background: "currentColor",
              opacity: 0.35,
              borderRadius: "1px",
              transformOrigin: "center 50%",
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </div>
  );
}
