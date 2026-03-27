import { FiSun, FiMoon } from "react-icons/fi";

import { useThemeStore } from "../../store/useThemeStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 size-full bg-transparent hover:bg-[rgba(40,40,40,0.1)] border border-gray-300 transition rounded-md"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <FiMoon size={10} className="text-gray-300" />
      ) : (
        <FiSun size={10} className="text-gray-300" />
      )}
    </button>
  );
}
