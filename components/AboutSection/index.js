import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1];

const LINES = [
  [
    { text: "A ", dim: true },
    {
      text: "full-stack engineer",
      card: {
        title: "Stack",
        desc: "3 years building across the full stack — from pixel-perfect UIs to backend APIs and desktop apps. Comfortable owning a feature end to end.",
        tags: ["React", "Next.js", "SvelteKit", "Node.js", "Electron.js", "Spring Boot", "PostgreSQL"],
      },
    },
    { text: " building", dim: true },
  ],
  [
    { text: "scalable ", dim: true },
    {
      text: "web apps",
      card: {
        title: "Frontend & Backend",
        desc: "Built and shipped production web apps for enterprise clients, including BI dashboards and internal platforms for Yokogawa.",
        tags: ["Next.js", "SvelteKit", "TailwindCSS", "Three.js", "Node.js", "REST APIs"],
      },
    },
    { text: ", ", dim: true },
    {
      text: "internal tools",
      card: {
        title: "Tools Built",
        desc: "Extended and customised open-source platforms to fit org-specific workflows — including deep modifications to Appsmith and Apache Guacamole.",
        tags: ["Appsmith", "Apache Guacamole", "BI Dashboards", "Yokogawa Platforms"],
      },
    },
    { text: ",", dim: true },
  ],
  [
    { text: "and ", dim: true },
    {
      text: "AI-driven systems",
      card: {
        title: "AI Stack",
        desc: "Developed Agentic AI features for ReCre8 — a climate regulation platform — using retrieval-augmented generation and multi-agent orchestration.",
        tags: ["LangGraph", "RAG Workflows", "Multi-agent Systems", "Agentic AI"],
      },
    },
    { text: ".", dim: true },
  ],
];

function FloatingCard({ card, rect, isDark }) {
  const above = rect.top > window.innerHeight * 0.55;
  const left = Math.min(rect.left, window.innerWidth - 300);
  const top = above ? rect.top - 12 : rect.bottom + 12;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={card.title}
        style={{
          position: "fixed",
          left,
          top,
          zIndex: 9999,
          minWidth: 200,
          maxWidth: 300,
          pointerEvents: "none",
          ...(above ? { translateY: "-100%" } : {}),
        }}
        initial={{ opacity: 0, y: above ? -8 : 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: above ? -8 : 8, scale: 0.96 }}
        transition={{ duration: 0.18, ease: EASE }}
        className={`rounded-xl p-4 shadow-2xl border ${
          isDark
            ? "bg-neutral-900 border-neutral-700/60 text-white"
            : "bg-white border-neutral-300 text-black"
        }`}
      >
        <p className="text-xs uppercase tracking-widest opacity-40 mb-2 font-mono">
          {card.title}
        </p>
        <p className={`text-sm leading-relaxed mb-3 ${isDark ? "opacity-70" : "opacity-60"}`}>
          {card.desc}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {card.tags.map((tag, i) => (
            <span
              key={i}
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isDark ? "bg-neutral-800 text-white/80" : "bg-neutral-100 text-black/70"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default function AboutSection({ isVisible, isDark }) {
  const [active, setActive] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleEnter = useCallback((e, card) => {
    setActive({ card, rect: e.currentTarget.getBoundingClientRect() });
  }, []);

  const handleLeave = useCallback(() => setActive(null), []);

  return (
    <div className="container mx-auto p-2 laptop:p-0">
      {LINES.map((segments, lineIdx) => (
        <motion.div
          key={lineIdx}
          className="font-black uppercase tracking-tight leading-none"
          style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: lineIdx * 0.12, ease: EASE }}
        >
          {segments.map((seg, segIdx) =>
            seg.dim ? (
              <span key={segIdx} style={{ opacity: isDark ? 0.2 : 0.4 }}>
                {seg.text}
              </span>
            ) : (
              <motion.span
                key={segIdx}
                className="cursor-default relative inline-block"
                onMouseEnter={(e) => handleEnter(e, seg.card)}
                onMouseLeave={handleLeave}
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.15 }}
              >
                {seg.text}
              </motion.span>
            )
          )}
        </motion.div>
      ))}

      {mounted && active && (
        <FloatingCard card={active.card} rect={active.rect} isDark={isDark} />
      )}
    </div>
  );
}
