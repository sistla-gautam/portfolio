import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const EASING = [0.76, 0, 0.24, 1];

function CodeSymbol({ filled }) {
  return (
    <svg viewBox="0 0 220 90" width="220" height="90" style={{ display: "block" }}>
      <text
        x="50%"
        y="72"
        textAnchor="middle"
        fontFamily="League Spartan, sans-serif"
        fontWeight="900"
        fontSize="72"
        fill={filled ? "white" : "rgba(255,255,255,0.07)"}
      >
        {"</>"}
      </text>
    </svg>
  );
}

export default function Loader({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ pointerEvents: leaving ? "none" : "all" }}
    >
      {/* Top panel */}
      <motion.div
        className="absolute top-0 left-0 w-full bg-black"
        style={{ height: "50%" }}
        initial={{ y: 0 }}
        animate={{ y: leaving ? "-100%" : 0 }}
        transition={{ duration: 0.9, ease: EASING }}
        onAnimationComplete={() => leaving && onDone?.()}
      />

      {/* Bottom panel */}
      <motion.div
        className="absolute bottom-0 left-0 w-full bg-black"
        style={{ height: "50%" }}
        initial={{ y: 0 }}
        animate={{ y: leaving ? "100%" : 0 }}
        transition={{ duration: 0.9, ease: EASING }}
      />

      {/* Center — sits above both panels */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center"
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ position: "relative", width: 220, height: 90 }}>
          {/* Ghost base — always visible */}
          <CodeSymbol filled={false} />

          {/* White fill — revealed bottom-to-top like liquid */}
          <motion.div
            style={{ position: "absolute", inset: 0 }}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.7, ease: "easeInOut" }}
          >
            <CodeSymbol filled />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
