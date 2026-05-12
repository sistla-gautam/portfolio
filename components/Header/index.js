import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import data from "../../data/portfolio.json";

const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef();

  useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    if (!mounted) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const toTheme = resolvedTheme === "dark" ? "light" : "dark";

    document.documentElement.style.setProperty("--wipe-x", `${x}px`);
    document.documentElement.style.setProperty("--wipe-y", `${y}px`);

    if (!document.startViewTransition) {
      setTheme(toTheme);
      return;
    }

    document.startViewTransition(() => setTheme(toTheme));
  };

  if (!mounted || !data.darkMode) return null;

  return (
    <div ref={btnRef} className="fixed top-4 right-4 z-[9999]">
      <Button onClick={handleToggle}>
        <img
          className="h-6"
          src={`/images/${resolvedTheme === "dark" ? "moon.svg" : "sun.svg"}`}
        />
      </Button>
    </div>
  );
};

export default Header;
