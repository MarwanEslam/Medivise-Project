import React, { useState, useMemo, createContext, useContext } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Save,
  X,
  Moon,
  Sun,
} from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import { useTheme } from "../ThemeContext";

const CollectData = () => {
  const { classes, darkMode, toggleDarkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("data"); // 'data', 'day', 'date', 'month'
  const [viewMode, setViewMode] = useState("month"); // 'month', 'year', 'week'
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedForm, setSelectedForm] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [formData, setFormData] = useState({});
  const [savedData, setSavedData] = useState({});
  const [customForms, setCustomForms] = useState([
    {
      id: "daily_tasks",
      name: "المهام اليومية",
      fields: [
        { name: "task", label: "المهمة", type: "text" },
        {
          name: "priority",
          label: "الأولوية",
          type: "select",
          options: ["عالية", "متوسطة", "منخفضة"],
        },
        {
          name: "status",
          label: "الحالة",
          type: "select",
          options: ["مكتملة", "قيد التنفيذ", "مؤجلة"],
        },
      ],
    },
    {
      id: "appointments",
      name: "المواعيد",
      fields: [
        { name: "title", label: "العنوان", type: "text" },
        { name: "time", label: "الوقت", type: "time" },
        { name: "location", label: "المكان", type: "text" },
        { name: "notes", label: "ملاحظات", type: "textarea" },
      ],
    },
    {
      id: "expenses",
      name: "المصروفات",
      fields: [
        { name: "amount", label: "المبلغ", type: "number" },
        {
          name: "category",
          label: "الفئة",
          type: "select",
          options: ["طعام", "مواصلات", "تسوق", "أخرى"],
        },
        { name: "description", label: "الوصف", type: "text" },
      ],
    },
  ]);
  const [showFormCreator, setShowFormCreator] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [newFormFields, setNewFormFields] = useState([
    { name: "", label: "", type: "text" },
  ]);

  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const weekDays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  // البحث المتقدم
  const performAdvancedSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    let results = [];
    const searchValue = searchTerm.toLowerCase().trim();

    if (searchType === "day") {
      // البحث في أسماء الأيام
      const dayIndex = weekDays.findIndex((day) =>
        day.toLowerCase().includes(searchValue)
      );

      if (dayIndex !== -1) {
        // جلب جميع الأيام التي تطابق هذا اليوم في السنة الحالية
        const year = currentDate.getFullYear();
        for (let month = 0; month < 12; month++) {
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            if (date.getDay() === dayIndex) {
              results.push({
                date: date,
                type: "day",
                reason: `يوم ${weekDays[dayIndex]}`,
              });
            }
          }
        }
      }
    } else if (searchType === "date") {
      // البحث في أرقام الأيام
      const dayNumber = parseInt(searchValue);
      if (dayNumber >= 1 && dayNumber <= 31) {
        const year = currentDate.getFullYear();
        for (let month = 0; month < 12; month++) {
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          if (dayNumber <= daysInMonth) {
            const date = new Date(year, month, dayNumber);
            results.push({
              date: date,
              type: "date",
              reason: `اليوم ${dayNumber} من الشهر`,
            });
          }
        }
      }
    } else if (searchType === "month") {
      // البحث في أسماء الشهور
      const monthIndex = monthNames.findIndex((month) =>
        month.toLowerCase().includes(searchValue)
      );

      if (monthIndex !== -1) {
        const year = currentDate.getFullYear();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, monthIndex, day);
          results.push({
            date: date,
            type: "month",
            reason: `شهر ${monthNames[monthIndex]}`,
          });
        }
      }
    } else {
      // البحث في البيانات المحفوظة
      Object.entries(savedData).forEach(([dateKey, dayData]) => {
        const hasMatch = Object.values(dayData).some((formData) =>
          Object.values(formData).some((entry) =>
            Object.values(entry).some((value) =>
              value.toString().toLowerCase().includes(searchValue)
            )
          )
        );

        if (hasMatch) {
          results.push({
            date: new Date(dateKey),
            type: "data",
            reason: "يحتوي على بيانات مطابقة",
            data: dayData,
          });
        }
      });
    }

    setSearchResults(results);
    setShowSearchResults(true);
  };

  // الحصول على أيام العرض حسب النمط
  const getDisplayDays = () => {
    if (showSearchResults) {
      return searchResults.map((result) => ({
        date: result.date,
        isCurrentMonth: true,
        searchResult: result,
      }));
    }

    switch (viewMode) {
      case "year":
        return getYearDays();
      case "week":
        return getWeekDays();
      default:
        return getDaysInMonth(currentDate);
    }
  };

  const getYearDays = () => {
    const year = currentDate.getFullYear();
    const days = [];

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        days.push({
          date: date,
          isCurrentMonth: true,
          monthName: monthNames[month],
        });
      }
    }
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({ date: date, isCurrentMonth: true });
    }
    return days;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // أيام الشهر السابق
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // أيام الشهر الحالي
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // أيام الشهر التالي
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const filteredDays = useMemo(() => {
    return getDisplayDays();
  }, [
    currentDate,
    savedData,
    searchTerm,
    viewMode,
    searchResults,
    showSearchResults,
  ]);

  const navigateTime = (direction) => {
    const newDate = new Date(currentDate);

    switch (viewMode) {
      case "week":
        newDate.setDate(currentDate.getDate() + direction * 7);
        break;
      case "year":
        newDate.setFullYear(currentDate.getFullYear() + direction);
        break;
      default: // month
        newDate.setMonth(currentDate.getMonth() + direction);
        break;
    }

    setCurrentDate(newDate);
    setShowSearchResults(false);
  };

  const handleDayClick = (day) => {
    if (!selectedForm) {
      alert("يرجى اختيار نوع النموذج أولاً");
      return;
    }
    setSelectedDay(day);
    setShowFormModal(true);
    setFormData({});
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const dateKey = selectedDay.toDateString();
    const currentForm = customForms.find((form) => form.id === selectedForm);

    setSavedData((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [selectedForm]: {
          ...prev[dateKey]?.[selectedForm],
          [`entry_${Date.now()}`]: {
            formName: currentForm.name,
            ...formData,
            timestamp: new Date().toLocaleString("ar-EG"),
          },
        },
      },
    }));

    setShowFormModal(false);
    setFormData({});
  };

  const renderFormField = (field) => {
    const inputClasses = `w-full p-3 border rounded-lg ${classes.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

    switch (field.type) {
      case "select":
        return (
          <CustomSelect>
            <select
              key={field.name}
              className={inputClasses}
              value={formData[field.name] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              required
            >
              <option value="">اختر {field.label}</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </CustomSelect>
        );
      case "textarea":
        return (
          <textarea
            key={field.name}
            className={`${inputClasses} h-24 resize-none`}
            placeholder={field.label}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
            }
            required
          />
        );
      case "number":
        return (
          <input
            key={field.name}
            type="number"
            className={inputClasses}
            placeholder={field.label}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
            }
            required
          />
        );
      case "time":
        return (
          <input
            key={field.name}
            type="time"
            className={inputClasses}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
            }
            required
          />
        );
      default:
        return (
          <input
            key={field.name}
            type="text"
            className={inputClasses}
            placeholder={field.label}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
            }
            required
          />
        );
    }
  };

  const addNewFormField = () => {
    setNewFormFields([...newFormFields, { name: "", label: "", type: "text" }]);
  };

  const removeFormField = (index) => {
    if (newFormFields.length > 1) {
      setNewFormFields(newFormFields.filter((_, i) => i !== index));
    }
  };

  const createNewForm = () => {
    if (
      !newFormName.trim() ||
      newFormFields.some((field) => !field.name || !field.label)
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const newForm = {
      id: `custom_${Date.now()}`,
      name: newFormName,
      fields: newFormFields.filter((field) => field.name && field.label),
    };

    setCustomForms([...customForms, newForm]);
    setShowFormCreator(false);
    setNewFormName("");
    setNewFormFields([{ name: "", label: "", type: "text" }]);
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case "week":
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.getDate()} - ${weekEnd.getDate()} ${
          monthNames[currentDate.getMonth()]
        } ${currentDate.getFullYear()}`;
      case "year":
        return `${currentDate.getFullYear()}`;
      default:
        return `${
          monthNames[currentDate.getMonth()]
        } ${currentDate.getFullYear()}`;
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const hasDataForDay = (date) => {
    const dateKey = date.toDateString();
    return savedData[dateKey] && Object.keys(savedData[dateKey]).length > 0;
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div
        className={`${classes.cardBg} ${classes.cardBorder} border rounded-xl shadow-lg p-6 mb-6`}
      >
        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className={`text-3xl font-bold ${classes.textPrimary}`}>
            التقويم التفاعلي
          </h1>
        </div> */}

        {/* Controls */}
        <div className=" grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: "data", label: "البيانات" },
                { value: "day", label: "اليوم" },
                { value: "date", label: "التاريخ" },
                { value: "month", label: "الشهر" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSearchType(type.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    searchType === type.value
                      ? classes.buttonPrimary
                      : classes.buttonSecondary
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                
                <input
                  type="text"
                  placeholder={
                    searchType === "day"
                      ? "مثال: الأحد"
                      : searchType === "date"
                      ? "مثال: 17"
                      : searchType === "month"
                      ? "مثال: يناير"
                      : "البحث في البيانات..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && performAdvancedSearch()
                  }
                  className={`${classes.input} w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <button
                onClick={performAdvancedSearch}
                className={`${classes.buttonPrimary} px-4 py-3 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap`}
              >
                <Search className="w-5 h-5" />
                بحث
              </button>

              {showSearchResults && (
                <button
                  onClick={clearSearch}
                  className={`${classes.buttonSecondary} px-4 py-3 rounded-lg flex items-center gap-2 transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Form Selection & View Mode */}
          <div className="space-y-4">
            {/* View Mode Selection */}
            <div
              className={`grid grid-cols-3 gap-1 p-1 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } rounded-lg`}
            >
              {[
                { value: "month", label: "شهر" },
                { value: "year", label: "سنة" },
                { value: "week", label: "أسبوع" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => {
                    setViewMode(mode.value);
                    setShowSearchResults(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    viewMode === mode.value
                      ? classes.buttonPrimary
                      : classes.buttonSecondary
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            {/* Form Selection */}
            <CustomSelect>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className={`${classes.input} appearance-none w-full p-3 border rounded-lg `}
              >
                <option value="">اختر نوع النموذج</option>
                {customForms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </select>
            </CustomSelect>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div
        className={`${classes.cardBg} ${classes.cardBorder} border rounded-xl shadow-lg p-6 mb-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateTime(-1)}
            className={`${classes.buttonSecondary} p-2 rounded-lg transition-colors`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h2 className={`text-2xl font-bold ${classes.textPrimary}`}>
              {showSearchResults
                ? `نتائج البحث: "${searchTerm}"`
                : getViewTitle()}
            </h2>
            {showSearchResults && (
              <p className={`text-sm mt-1 ${classes.textSecondary}`}>
                {searchResults.length} نتيجة -{" "}
                {searchType === "day"
                  ? "بحث في الأيام"
                  : searchType === "date"
                  ? "بحث في التواريخ"
                  : searchType === "month"
                  ? "بحث في الشهور"
                  : "بحث في البيانات"}
              </p>
            )}
          </div>

          <button
            onClick={() => navigateTime(1)}
            className={`${classes.buttonSecondary} p-2 rounded-lg transition-colors`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Week Days Header - only for month view */}
        {(viewMode === "month" || viewMode === "week") &&
          !showSearchResults && (
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className={`${classes.tableHeader} p-3 text-center font-medium rounded-lg`}
                >
                  {day}
                </div>
              ))}
            </div>
          )}

        {/* Calendar Days */}
        <div
          className={`grid gap-2 ${
            viewMode === "year" || showSearchResults
              ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
              : viewMode === "week"
              ? "grid-cols-7"
              : "grid-cols-7"
          }`}
        >
          {filteredDays.map((dayObj, index) => {
            const { date, isCurrentMonth, monthName, searchResult } = dayObj;
            const isToday = date.toDateString() === new Date().toDateString();
            const hasData = hasDataForDay(date);

            return (
              <button
                key={index}
                onClick={() => handleDayClick(date)}
                className={`
                  p-3 rounded-lg transition-all duration-200 relative group min-h-[60px]
                  ${isCurrentMonth ? classes.cardBg : classes.buttonSecondary}
                  ${isCurrentMonth ? classes.textPrimary : classes.textMuted}
                  ${isToday ? "ring-2 ring-blue-500" : ""}
                  ${
                    hasData
                      ? "border-2 border-green-500"
                      : classes.cardBorder + " border"
                  }
                  ${searchResult ? "border-2 border-orange-500" : ""}
                  ${classes.tableRow}
                `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold">{date.getDate()}</span>

                  {viewMode === "year" && (
                    <span className={`text-xs mt-1 ${classes.textMuted}`}>
                      {monthName}
                    </span>
                  )}

                  {viewMode === "week" && (
                    <span className={`text-xs mt-1 ${classes.textMuted}`}>
                      {weekDays[date.getDay()]}
                    </span>
                  )}

                  {searchResult && (
                    <span
                      className={`text-xs mt-1 text-orange-600 dark:text-orange-400`}
                    >
                      {searchResult.reason}
                    </span>
                  )}
                </div>

                {hasData && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}

                {searchResult && (
                  <div className="absolute top-1 left-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${classes.cardBg} rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${classes.textPrimary}`}>
                  {customForms.find((f) => f.id === selectedForm)?.name} -{" "}
                  {selectedDay?.toLocaleDateString("ar-EG")}
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className={`${classes.buttonSecondary} p-2 rounded-lg transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {customForms
                  .find((f) => f.id === selectedForm)
                  ?.fields.map((field) => (
                    <div key={field.name}>
                      <label
                        className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}
                      >
                        {field.label}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}

                <button
                  type="submit"
                  className={`${classes.buttonPrimary} w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors`}
                >
                  <Save className="w-5 h-5" />
                  حفظ
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Form Creator Modal */}
      {showFormCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${classes.cardBg} rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${classes.textPrimary}`}>
                  إنشاء نموذج جديد
                </h3>
                <button
                  onClick={() => setShowFormCreator(false)}
                  className={`${classes.buttonSecondary} p-2 rounded-lg transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}
                  >
                    اسم النموذج
                  </label>
                  <input
                    type="text"
                    value={newFormName}
                    onChange={(e) => setNewFormName(e.target.value)}
                    className={`${classes.input} w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500`}
                    placeholder="مثال: تتبع التمارين"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4
                      className={`text-lg font-medium ${classes.textPrimary}`}
                    >
                      حقول النموذج
                    </h4>
                    <button
                      type="button"
                      onClick={addNewFormField}
                      className={`${classes.buttonPrimary} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
                    >
                      <Plus className="w-4 h-4" />
                      إضافة حقل
                    </button>
                  </div>

                  {newFormFields.map((field, index) => (
                    <div
                      key={index}
                      className={`${classes.cardBg} ${classes.cardBorder} border rounded-lg p-4 mb-4`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}
                          >
                            اسم الحقل
                          </label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => {
                              const updated = [...newFormFields];
                              updated[index].name = e.target.value;
                              setNewFormFields(updated);
                            }}
                            className={`${classes.input} w-full p-2 border rounded-lg`}
                            placeholder="مثال: exercise_name"
                          />
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}
                          >
                            التسمية
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => {
                              const updated = [...newFormFields];
                              updated[index].label = e.target.value;
                              setNewFormFields(updated);
                            }}
                            className={`${classes.input} w-full p-2 border rounded-lg`}
                            placeholder="مثال: اسم التمرين"
                          />
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}
                          >
                            النوع
                          </label>
                          <div className="flex gap-2">
                            <CustomSelect>
                              <select
                                value={field.type}
                                onChange={(e) => {
                                  const updated = [...newFormFields];
                                  updated[index].type = e.target.value;
                                  setNewFormFields(updated);
                                }}
                                className={`${classes.input} flex-1 p-2 border rounded-lg`}
                              >
                                <option value="text">نص</option>
                                <option value="number">رقم</option>
                                <option value="time">وقت</option>
                                <option value="textarea">نص طويل</option>
                                <option value="select">قائمة</option>
                              </select>
                            </CustomSelect>

                            {newFormFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFormField(index)}
                                className="text-red-500 hover:text-red-700 p-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {field.type === "select" && (
                        <div className="mt-4">
                          <label
                            className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}
                          >
                            الخيارات (مفصولة بفاصلة)
                          </label>
                          <input
                            type="text"
                            placeholder="خيار 1, خيار 2, خيار 3"
                            onChange={(e) => {
                              const updated = [...newFormFields];
                              updated[index].options = e.target.value
                                .split(",")
                                .map((opt) => opt.trim())
                                .filter(Boolean);
                              setNewFormFields(updated);
                            }}
                            className={`${classes.input} w-full p-2 border rounded-lg`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={createNewForm}
                  className={`${classes.buttonPrimary} w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors`}
                >
                  <Save className="w-5 h-5" />
                  إنشاء النموذج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      {Object.keys(savedData).length > 0 && (
        <div
          className={`${classes.cardBg} ${classes.cardBorder} border rounded-xl shadow-lg p-6`}
        >
          <h3 className={`text-xl font-bold mb-4 ${classes.textPrimary}`}>
            البيانات المحفوظة
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(savedData).map(([dateKey, dayData]) => (
              <div
                key={dateKey}
                className={`${classes.tableHeader} rounded-lg p-4`}
              >
                <h4 className={`font-medium mb-2 ${classes.textPrimary}`}>
                  {new Date(dateKey).toLocaleDateString("ar-EG")}
                </h4>
                {Object.entries(dayData).map(([formId, formEntries]) => (
                  <div key={formId} className="space-y-2">
                    {Object.entries(formEntries).map(([entryId, entry]) => (
                      <div
                        key={entryId}
                        className={`${classes.cardBg} rounded p-3 text-sm`}
                      >
                        <div
                          className={`font-medium mb-1 ${classes.textPrimary}`}
                        >
                          {entry.formName}
                        </div>
                        <div
                          className={`${classes.textSecondary} text-xs mb-2`}
                        >
                          {entry.timestamp}
                        </div>
                        {Object.entries(entry).map(([key, value]) => {
                          if (key === "formName" || key === "timestamp")
                            return null;
                          return (
                            <div
                              key={key}
                              className={`${classes.textSecondary}`}
                            >
                              <span className="font-medium">{key}:</span>{" "}
                              {value}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectData;
