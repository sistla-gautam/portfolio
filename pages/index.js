import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
import FloatingTarget from "../components/FloatingTarget";
import WorkList from "../components/WorkList";
import AboutSection from "../components/AboutSection";

import data from "../data/portfolio.json";

const TOTAL = 4;
const EASE = [0.76, 0, 0.24, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const LABELS = ["home", "work", "about", "contact"];

export default function Home() {
  const heroRef = useRef();
  const [current, setCurrent] = useState(0);
  const [seen, setSeen] = useState(new Set([0]));
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const goNext = useCallback(() => setCurrent(p => Math.min(TOTAL - 1, p + 1)), []);
  const goPrev = useCallback(() => setCurrent(p => Math.max(0, p - 1)), []);
  const goTo   = useCallback((i) => setCurrent(Math.max(0, Math.min(TOTAL - 1, i))), []);

  useEffect(() => {
    setSeen(prev => new Set([...prev, current]));
  }, [current]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const hasPrev = current > 0;
  const hasNext = current < TOTAL - 1;

  return (
    <div className={`relative h-screen overflow-hidden ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

      <Header />

      {/* ── Sliding sections ─────────────────────────────────── */}
      <motion.div
        animate={{ y: `${-current * 100}vh` }}
        transition={{ duration: 0.8, ease: EASE }}
      >

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative h-screen flex flex-col overflow-hidden"
        >
          <motion.h1
            className="absolute inset-0 flex items-center justify-center font-black uppercase tracking-tighter pointer-events-none select-none"
            style={{ fontSize: "clamp(4rem, 12vw, 11rem)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            {data.name}
          </motion.h1>

          <FloatingTarget sectionRef={heroRef} />
        </section>

        {/* ── Work ─────────────────────────────────────────────── */}
        <section className="h-screen overflow-hidden flex flex-col justify-center">
          <div className="container mx-auto p-2 laptop:p-0">
            <motion.h2
              className="text-2xl font-bold mb-6 laptop:mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={seen.has(1) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Work.
            </motion.h2>
            <WorkList organizations={data.organizations ?? []} isVisible={seen.has(1)} />
          </div>
        </section>

        {/* ── About ────────────────────────────────────────────── */}
        <section className="h-screen overflow-hidden flex items-center">
          <AboutSection isVisible={seen.has(2)} isDark={isDark} />
        </section>

        {/* ── Contact ──────────────────────────────────────────── */}
        <motion.section
          className="h-screen overflow-hidden flex items-center"
          initial="hidden"
          animate={seen.has(3) ? "visible" : "hidden"}
        >
          <div className="container mx-auto p-2 laptop:p-0">
            <motion.div variants={fadeUp}>
              <Footer />
            </motion.div>
          </div>
        </motion.section>
      </motion.div>

      {/* ── Section nav ──────────────────────────────────────── */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full border shadow-md ${isDark ? "bg-white border-neutral-200 text-black" : "bg-neutral-900 border-neutral-700 text-white"}`}>
        <motion.button
          onClick={goPrev}
          animate={{ opacity: hasPrev ? 0.5 : 0.2 }}
          whileHover={{ opacity: hasPrev ? 1 : 0.2 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: hasPrev ? "auto" : "none" }}
          aria-label="Previous section"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>

        {LABELS.map((label, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="opacity-20 text-sm select-none">|</span>}
            <motion.button
              onClick={() => goTo(i)}
              animate={{ opacity: current === i ? 1 : 0.55 }}
              whileHover={{ opacity: current === i ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-sm uppercase tracking-widest px-1"
            >
              {label}
            </motion.button>
          </React.Fragment>
        ))}

        <motion.button
          onClick={goNext}
          animate={{ opacity: hasNext ? 0.5 : 0.2 }}
          whileHover={{ opacity: hasNext ? 1 : 0.2 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: hasNext ? "auto" : "none" }}
          aria-label="Next section"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-5 right-16 z-50">
          <Link href="/edit">
            <Button type="primary">Edit Data</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
