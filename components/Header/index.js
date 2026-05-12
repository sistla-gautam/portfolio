import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import Button from "../Button";
import data from "../../data/portfolio.json";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data.darkMode) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <img
          className="h-6"
          src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
        />
      </Button>
    </div>
  );
};

export default Header;
