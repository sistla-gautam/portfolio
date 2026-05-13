import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const EASE = [0.76, 0, 0.24, 1];

export default function WorkList({ organizations, isVisible }) {
  const [expanded, setExpanded] = useState(null);
  const reversed = [...organizations].reverse();

  return (
    <div>
      {reversed.map((org, i) => {
        const isOpen = expanded === org.id;
        return (
          <motion.div
            key={org.id ?? i}
            className="border-t border-neutral-200/30 dark:border-neutral-800/30 group"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
            onHoverStart={() => setExpanded(org.id)}
            onHoverEnd={() => setExpanded(null)}
          >
            {/* Row */}
            <motion.div
              className="flex items-center gap-6 laptop:gap-10 py-5 laptop:py-7 px-3 laptop:px-6 cursor-default rounded-lg transition-colors duration-200 hover:bg-neutral-900/5 dark:hover:bg-white/[0.03]"
              whileHover={{ x: 6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {/* Index */}
              <span className="text-xs w-6 flex-shrink-0 font-mono opacity-40 dark:opacity-20 group-hover:opacity-60 transition-opacity duration-300">
                {String(reversed.length - i).padStart(2, "0")}
              </span>

              {/* Company + Role */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl laptop:text-3xl font-black uppercase tracking-tight leading-none opacity-40 dark:opacity-25 group-hover:opacity-100 transition-opacity duration-300">
                  {org.name}
                </h3>
                <p className="text-sm mt-1 opacity-35 dark:opacity-15 group-hover:opacity-50 transition-opacity duration-300">
                  {org.role}
                </p>
              </div>

              {/* Period */}
              <p className="text-xs w-28 flex-shrink-0 text-right font-mono opacity-35 dark:opacity-15 group-hover:opacity-40 transition-opacity duration-300 hidden tablet:block">
                {org.period}
              </p>

              {/* Description */}
              <p className="text-sm leading-relaxed flex-1 hidden laptop:block opacity-35 dark:opacity-15 group-hover:opacity-55 transition-opacity duration-300">
                {org.description}
              </p>

              {/* Chevron */}
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 opacity-40 dark:opacity-30 group-hover:opacity-80 transition-opacity duration-300"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
            </motion.div>

            {/* Expanded bullets */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <ul className="pb-6 laptop:pb-8 px-3 laptop:px-6 ml-12 laptop:ml-16 space-y-2.5">
                    {(org.bullets ?? []).map((bullet, bi) => (
                      <motion.li
                        key={bi}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: bi * 0.06, duration: 0.3, ease: EASE }}
                        className="text-sm leading-relaxed opacity-60 flex gap-3"
                      >
                        <span className="opacity-40 flex-shrink-0 font-mono text-xs pt-0.5">—</span>
                        <span>{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      <div className="border-t border-neutral-200/30 dark:border-neutral-800/30" />
    </div>
  );
}
