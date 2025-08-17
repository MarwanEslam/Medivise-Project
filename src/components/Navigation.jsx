import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { Activity, Users, FileText, BarChart3 } from "lucide-react";

const Navigation = () => {
  const { classes } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "لوحة تحكم الطبيب", icon: Activity },
    { path: "/u", label: "لوحة تحكم الطبيب", icon: Activity },
    { path: "/u", label: "لوحة تحكم الطبيب", icon: Activity },
  ];

  return (
    <nav
      dir="rtl"
      className={`shadow-lg border-b transition-colors duration-300 ${classes.cardBg} ${classes.cardBorder}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className={`text-2xl font-bold ${classes.textPrimary}`}>
                نظام التغذية
              </h1>
            </div>

            <div className="hidden md:flex space-x-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === path
                      ? "bg-blue-600 text-white"
                      : `${classes.textSecondary} hover:${classes.textPrimary}`
                  }`}
                >
                  <Icon className="h-5 w-5 ml-2" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className={`text-sm ${classes.textSecondary}`}>
              اليوم {new Date().toLocaleDateString("ar-EG")}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
