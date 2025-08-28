import React, { useState, useCallback } from "react";
import { useTheme } from "../ThemeContext";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Moon,
  Sun,
  User,
  Menu,
  X,
  Combine,
  CalendarDays,
  Brain,
  MessagesSquare,
  BookOpenCheck,
} from "lucide-react";

const NAVIGATION_ITEMS = [
  
  { path: "/", label: "الرئيسية", icon: Combine },
  { path: "/data/collect", label: "جمع البيانات", icon: CalendarDays },
  { path: "/doctor/dashboard", label: "لوحة تحكم الطبيب", icon: Activity },
  { path: "/ai", label: "الذكاء الاصطناعي", icon: Brain },
  { path: "/community", label: "المجتمع", icon: MessagesSquare },
  { path: "/info", label: "المعلومات", icon: BookOpenCheck },
];

const Header = ({ isLoading = false }) => {
  const { darkMode, toggleDarkMode, classes } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // لودينج ستايل
  const loadingClass = isLoading ? "opacity-50 pointer-events-none" : "";

  return (
    <header
      dir="rtl"
      className={`shadow-lg border-b transition-all duration-300 ${classes.cardBg} ${classes.cardBorder} fixed top-0 left-0 w-full z-40 ${loadingClass}`}
      role="banner"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 gap-4">
          {/* Logo */}
          <div className="flex items-center" role="banner">
            <Activity
              className="h-8 w-8 text-blue-600 ml-3"
              aria-hidden="true"
            />
            <h1
              className={`text-2xl font-bold ${classes.textPrimary} whitespace-nowrap`}
            >
              نظام التغذية الذكي
            </h1>
          </div>

          {/* Nav Items  */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2"
            role="navigation"
            aria-label="التنقل الرئيسي"
          >
            {NAVIGATION_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`
    flex items-center px-2 xl:px-3 py-1 md:py-2 rounded-lg text-sm xl:text-base 
    transition-all duration-200 
    ${path === location.pathname ? "text-blue-600" : classes.textPrimary} 
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
              >
                <Icon
                  className="w-4 h-4 xl:h-5 xl:w-5 ml-1 xl:ml-2"
                  aria-hidden="true"
                />
                <span className="font-medium whitespace-nowrap">{label}</span>
              </Link>
            ))}
          </nav>

          {/* أزرار التحكم */}
          <div className="flex items-center gap-2">
            {/* تبديل الثيم */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${classes.buttonSecondary} transition-colors ring-2  focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={
                darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع المظلم"
              }
              title={darkMode ? "الوضع الفاتح" : "الوضع المظلم"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            {/* زر البروفايل */}
            <Link
              to="/profile"
              className={`flex items-center p-2 rounded-lg ${classes.buttonSecondary} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <User className="w-5 h-5 ml-2" aria-hidden="true" />
              <span className="hidden md:block whitespace-nowrap">
                الملف الشخصي
              </span>
            </Link>

            {/* زر الموبايل */}
            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 rounded-lg ${classes.buttonSecondary} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* قائمة الموبايل */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            className={`lg:hidden border-t ${classes.cardBorder} py-4 animate-slide-down`}
            role="navigation"
            aria-label="قائمة التنقل للهاتف المحمول"
          >
            <div className="space-y-2">
              {NAVIGATION_ITEMS.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${classes.textSecondary} hover:${classes.textPrimary} ${classes.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Icon className="h-5 w-5 ml-3" aria-hidden="true" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
