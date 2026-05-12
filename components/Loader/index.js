import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const EASING = [0.76, 0, 0.24, 1];

function CodeSymbol({ color }) {
  return (
    <svg viewBox="0 0 220 90" width="220" height="90" style={{ display: "block" }}>
      <text
        x="50%"
        y="72"
        textAnchor="middle"
        fontFamily="League Spartan, sans-serif"
        fontWeight="900"
        fontSize="72"
        fill={color}
      >
        {"</>"}
      </text>
    </svg>
  );
}

export default function Loader({ onDone }) {
  const { resolvedTheme } = useTheme();
  const [leaving, setLeaving] = useState(false);

  // Determine color scheme: check stored pref or fall back to system
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") setIsDark(true);
    else if (stored === "light") setIsDark(false);
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // Also sync when resolvedTheme becomes available
  useEffect(() => {
    if (resolvedTheme) setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const bg = isDark ? "#000" : "#fff";
  const ghostColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const fillColor = isDark ? "#fff" : "#000";

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ pointerEvents: leaving ? "none" : "all" }}
    >
      {/* Top panel */}
      <motion.div
        className="absolute top-0 left-0 w-full"
        style={{ height: "50%", backgroundColor: bg }}
        initial={{ y: 0 }}
        animate={{ y: leaving ? "-100%" : 0 }}
        transition={{ duration: 0.9, ease: EASING }}
        onAnimationComplete={() => leaving && onDone?.()}
      />

      {/* Bottom panel */}
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "50%", backgroundColor: bg }}
        initial={{ y: 0 }}
        animate={{ y: leaving ? "100%" : 0 }}
        transition={{ duration: 0.9, ease: EASING }}
      />

      {/* Center symbol */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center"
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ position: "relative", width: 220, height: 90 }}>
          <CodeSymbol color={ghostColor} />
          <motion.div
            style={{ position: "absolute", inset: 0 }}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.7, ease: "easeInOut" }}
          >
            <CodeSymbol color={fillColor} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
