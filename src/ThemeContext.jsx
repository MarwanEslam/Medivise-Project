import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
  
    // const saved = localStorage.getItem('darkMode');
    // return saved ? JSON.parse(saved) : false;
    return false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
  
    // localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  // كلاسات CSS شائعة يمكن إعادة استخدامها
  const themeClasses = {
    // backgrounds
    background: darkMode
      ? "bg-gradient-to-br from-gray-900 to-gray-800"
      : "bg-gradient-to-br from-blue-50 to-indigo-100",

    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    cardBorder: darkMode ? "border-gray-700" : "border-gray-200",

    // texts
    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textMuted: darkMode ? "text-gray-400" : "text-gray-500",

    // buttons
    buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
    buttonSecondary: darkMode
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
      : "bg-gray-100 hover:bg-gray-200 text-gray-700",

    // inputs
    input: darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900",

    // tables
    tableHeader: darkMode ? "bg-gray-700" : "bg-gray-50",
    tableRow: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    tableDivider: darkMode ? "divide-gray-700" : "divide-gray-200",

    // states
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",

    // tabs
    tabs: darkMode
      ? "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    ,
  };

  const value = {
    darkMode,
    toggleDarkMode,
    classes: themeClasses,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`min-h-screen transition-colors duration-300 ${themeClasses.background} ${themeClasses.textPrimary}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

