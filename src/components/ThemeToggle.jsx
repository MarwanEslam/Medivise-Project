import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";

export const ThemeToggle = ({ className = "" }) => {
  const { darkMode, toggleDarkMode, classes } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-lg transition-colors duration-200 ${classes.buttonSecondary} ${className}`}
      title={darkMode ? "التبديل للوضع الفاتح" : "التبديل للوضع المظلم"}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};
