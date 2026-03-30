import { useEffect } from "react";

import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("@CLIMB:THEME", theme);
    document.documentElement.className = theme;
    document.documentElement.style.colorScheme = theme;
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("@CLIMB:THEME", newTheme);
      document.documentElement.className = newTheme;
      document.documentElement.style.colorScheme = newTheme;
      return { theme: newTheme };
    }),
  initTheme: () => {
    const savedTheme = localStorage.getItem("@CLIMB:THEME") as Theme | null;

    if (savedTheme) {
      set({ theme: savedTheme });
      document.documentElement.className = savedTheme;
      document.documentElement.style.colorScheme = savedTheme;
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
      .matches;
    const theme = prefersDark ? "dark" : "light";

    set({ theme });
    document.documentElement.className = theme;
    document.documentElement.style.colorScheme = theme;
  },
}));

export const useThemeInit = () => {
  useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);
};