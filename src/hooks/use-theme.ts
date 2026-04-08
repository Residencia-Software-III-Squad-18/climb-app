import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("climb-theme");
    return stored ? stored === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("climb-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, setIsDark };
}
