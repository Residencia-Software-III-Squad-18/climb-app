import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle = ({ isDark, toggle }: ThemeToggleProps) => (
  <motion.button
    onClick={toggle}
    className="fixed top-6 right-6 z-50 w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    aria-label="Alternar tema"
  >
    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
  </motion.button>
);
