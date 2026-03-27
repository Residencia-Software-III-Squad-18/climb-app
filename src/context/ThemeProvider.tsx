import { type ReactNode } from "react";

import { useThemeStore } from "../store/useThemeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useThemeStore();

  return (
    <div
      className={theme === "dark" ? "dark" : "light"}
      style={{
        backgroundColor: theme === "dark" ? "#0E1822" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#0F1B2D",
      }}
    >
      {children}
    </div>
  );
}
