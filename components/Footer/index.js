import React from "react";
import { motion } from "framer-motion";
import data from "../../data/portfolio.json";

const EASE = [0.76, 0, 0.24, 1];

const ICONS = {
  Github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
  LinkedIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

const Footer = () => {
  // Split socials: email is shown as the big CTA, others get icons
  const socialLinks = data.socials.filter((s) => !s.link.startsWith("mailto:"));
  const emailLink = data.socials.find((s) => s.link.startsWith("mailto:"));
  const email = emailLink?.link.replace("mailto:", "") ?? "sistlagautham@gmail.com";

  return (
    <div className="w-full">
      {/* Headline */}
      <h1
        className="font-black uppercase tracking-tight leading-none"
        style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
      >
        Let&apos;s work
        <br />
        <span className="opacity-40 dark:opacity-20">together.</span>
      </h1>

      {/* Email CTA */}
      <motion.a
        href={`mailto:${email}`}
        className="inline-flex items-center gap-3 mt-10 laptop:mt-14 group"
        whileHover={{ x: 6 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        <span className="text-base laptop:text-xl font-mono opacity-50 group-hover:opacity-100 transition-opacity duration-200 border-b border-current pb-0.5">
          {email}
        </span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="opacity-30 group-hover:opacity-80 transition-opacity duration-200"
        >
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </motion.a>

      {/* Social links */}
      <div className="flex items-center gap-6 mt-8">
        {socialLinks.map((social) => (
          <motion.a
            key={social.id}
            href={social.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 opacity-35 hover:opacity-100 transition-opacity duration-200"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {ICONS[social.title] ?? null}
            <span className="text-sm uppercase tracking-widest">{social.title}</span>
          </motion.a>
        ))}
      </div>

      {/* Attribution */}
      <p className="mt-16 laptop:mt-24 text-sm opacity-40">
        You scrolled this far. Might as well hire me.
      </p>
    </div>
  );
};

export default Footer;
