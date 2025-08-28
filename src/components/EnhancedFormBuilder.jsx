import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useReducer,
  createContext,
  useContext,
  useEffect,
} from "react";
import {
  Save,
  Download,
  Upload,
  Eye,
  Settings,
  History,
  Palette,
  Layers,
  Grid,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Trash2,
  Plus,
  Edit,
  ChevronDown,
  GripVertical,
  AlertCircle,
  Check,
  X,
  Undo,
  Redo,
  FileText,
  Calculator,
  Calendar,
  Clock,
  Image,
  Video,
  MapPin,
  Star,
  BarChart,
  PieChart,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";

import { useTheme } from "../ThemeContext";

import useCustomFormStore from "../store/useCustomFormStore";

const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  return { notification, showNotification };
};

// Notification Component
const NotificationToast = ({ notification, onClose }) => {
  if (!notification) return null;

  const { message, type } = notification;
  const bgColor =
    type === "error"
      ? "bg-red-600"
      : type === "success"
      ? "bg-green-600"
      : "bg-blue-600";
  const Icon = type === "error" ? AlertCircle : Check;

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transform transition-all duration-300`}
    >
      <Icon size={16} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75">
        <X size={16} />
      </button>
    </div>
  );
};

// Enhanced Form Builder with Advanced Features
export default function EnhancedFormBuilder() {
  const { darkMode, toggleDarkMode, classes } = useTheme();
  const { notification, showNotification } = useNotification();
  const showFormBuilder = useCustomFormStore;
  (s) => s.showFormBuilder;
  const setShowFormBuilder = useCustomFormStore((s) => s.setShowFormBuilder);
  const customForms = useCustomFormStore((s) => s.customForms);
  const setCustomForms = useCustomFormStore((s) => s.setCustomForms);
  const currentForm = useCustomFormStore((s) => s.currentForm);
  const setCurrentForm = useCustomFormStore((s) => s.setCurrentForm);

  // State Management with useReducer
  const initialState = {
    forms: customForms || [],
    currentForm: Object.keys(currentForm).length ? currentForm : {
      id: null,
      title: "نموذج جديد",
      description: "",
      fields: [],
      theme: "default",
      createdDate: null,
      settings: {
        rtl: true,
        validation: true,
        progressBar: false,
        multiStep: false,
      },
    },
    history: {
      past: [],
      present: null,
      future: [],
    },
    ui: {
      activePanel: "fields",
      previewMode: "desktop",
      showGrid: true,
      sidebarCollapsed: false,
      selectedField: null,
    },
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case "ADD_FIELD":
        return {
          ...state,
          currentForm: {
            ...state.currentForm,
            fields: [...state.currentForm.fields, action.payload],
          },
        };

      case "UPDATE_FIELD":
        return {
          ...state,
          currentForm: {
            ...state.currentForm,
            fields: state.currentForm.fields.map((field, index) =>
              index === action.index ? { ...field, ...action.payload } : field
            ),
          },
        };

      case "DELETE_FIELD":
        return {
          ...state,
          currentForm: {
            ...state.currentForm,
            fields: state.currentForm.fields.filter(
              (_, index) => index !== action.index
            ),
          },
        };

      case "REORDER_FIELDS":
        const newFields = [...state.currentForm.fields];
        const [removed] = newFields.splice(action.fromIndex, 1);
        newFields.splice(action.toIndex, 0, removed);
        return {
          ...state,
          currentForm: {
            ...state.currentForm,
            fields: newFields,
          },
        };

      case "SET_UI":
        return {
          ...state,
          ui: { ...state.ui, ...action.payload },
        };

      case "SET_FORM":
        return {
          ...state,
          currentForm: { ...state.currentForm, ...action.payload },
        };

      case "SELECT_FIELD":
        return {
          ...state,
          ui: { ...state.ui, selectedField: action.payload },
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  // Advanced Field Types
  const fieldTypes = [
    {
      category: "نص",
      fields: [
        { id: "text", name: "نص قصير", icon: "📝", component: "input" },
        { id: "textarea", name: "نص طويل", icon: "📄", component: "textarea" },
        { id: "email", name: "بريد إلكتروني", icon: "📧", component: "input" },
        { id: "phone", name: "هاتف", icon: "📱", component: "input" },
        { id: "url", name: "رابط", icon: "🔗", component: "input" },
      ],
    },
    {
      category: "اختيار",
      fields: [
        { id: "select", name: "قائمة منسدلة", icon: "📋", component: "select" },
        { id: "radio", name: "اختيار واحد", icon: "⚪", component: "radio" },
        {
          id: "checkbox",
          name: "اختيارات متعددة",
          icon: "☑️",
          component: "checkbox",
        },
        { id: "toggle", name: "مفتاح تبديل", icon: "🎚️", component: "toggle" },
      ],
    },
    {
      category: "أرقام وتواريخ",
      fields: [
        { id: "number", name: "رقم", icon: "🔢", component: "input" },
        { id: "range", name: "مدى رقمي", icon: "📊", component: "range" },
        { id: "date", name: "تاريخ", icon: "📅", component: "date" },
        { id: "time", name: "وقت", icon: "⏰", component: "time" },
        {
          id: "datetime",
          name: "تاريخ ووقت",
          icon: "🗓️",
          component: "datetime",
        },
      ],
    },
    {
      category: "ملفات ووسائط",
      fields: [
        { id: "file", name: "رفع ملف", icon: "📎", component: "file" },
        { id: "image", name: "صورة", icon: "🖼️", component: "image" },
        { id: "signature", name: "توقيع", icon: "✍️", component: "signature" },
      ],
    },
    {
      category: "متقدم",
      fields: [
        { id: "rating", name: "تقييم", icon: "⭐", component: "rating" },
        { id: "matrix", name: "جدول خيارات", icon: "⊞", component: "matrix" },
        { id: "location", name: "موقع", icon: "📍", component: "location" },
        {
          id: "calculator",
          name: "حاسبة",
          icon: "🧮",
          component: "calculator",
        },
      ],
    },
  ];

  // Templates
  const templates = [
    {
      id: "patient-intake",
      name: "استمارة المريض",
      description: "نموذج شامل لمعلومات المريض الأساسية",
      icon: "🏥",
      fields: [
        {
          id: "name",
          type: "text",
          label: "الاسم الكامل",
          required: true,
          placeholder: "أدخل الاسم الكامل",
        },
        {
          id: "birthdate",
          type: "date",
          label: "تاريخ الميلاد",
          required: true,
        },
        {
          id: "gender",
          type: "select",
          label: "الجنس",
          options: ["ذكر", "أنثى"],
          required: true,
        },
        {
          id: "phone",
          type: "phone",
          label: "رقم الهاتف",
          required: true,
          placeholder: "أدخل رقم الهاتف",
        },
        {
          id: "symptoms",
          type: "textarea",
          label: "الأعراض الحالية",
          required: false,
          placeholder: "اذكر الأعراض التي تعاني منها",
        },
      ],
    },
    {
      id: "medical-history",
      name: "التاريخ المرضي",
      description: "نموذج للتاريخ المرضي والعائلي",
      icon: "📋",
      fields: [
        {
          id: "chronic-diseases",
          type: "checkbox",
          label: "الأمراض المزمنة",
          options: ["السكري", "الضغط", "القلب"],
        },
        {
          id: "medications",
          type: "textarea",
          label: "الأدوية الحالية",
          placeholder: "اذكر الأدوية التي تتناولها",
        },
        {
          id: "smoking",
          type: "radio",
          label: "التدخين",
          options: ["نعم", "لا", "سابقاً"],
        },
      ],
    },
  ];

  // Helper Functions
  const addField = useCallback((fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType.id,
      label: `حقل ${fieldType.name}`,
      placeholder: `أدخل ${fieldType.name}`,
      required: false,
      options: ["select", "radio", "checkbox"].includes(fieldType.id)
        ? ["خيار 1", "خيار 2"]
        : undefined,
      validation: {},
      settings: {},
    };

    dispatch({ type: "ADD_FIELD", payload: newField });
  }, []);

  const deleteField = useCallback((index) => {
    dispatch({ type: "DELETE_FIELD", index });
  }, []);

  const updateField = useCallback((index, updates) => {
    dispatch({ type: "UPDATE_FIELD", index, payload: updates });
  }, []);

  const selectField = useCallback((index) => {
    dispatch({ type: "SELECT_FIELD", payload: index });
  }, []);

  const applyTemplate = useCallback((template) => {
    dispatch({
      type: "SET_FORM",
      payload: {
        title: template.name,
        description: template.description,
        fields: template.fields.map((field, index) => ({
          ...field,
          id: `field_${Date.now()}_${index}`,
        })),
      },
    });
  }, []);

  const getCanvasWidth = () => {
    switch (state.ui.previewMode) {
      case "mobile":
        return "max-w-sm";
      case "tablet":
        return "max-w-2xl";
      case "desktop":
        return "max-w-4xl";
      default:
        return "max-w-4xl";
    }
  };

  // UI Components
  const Sidebar = () => (
    <div
      className={`
        
      h-full z-50 transform transition-transform duration-300
        ${
          state.ui.sidebarCollapsed
            ? "w-16 -translate-x-full"
            : "w-80  translate-x-0"
        } ${classes.cardBg} border-r ${
        classes.cardBorder
      } h-full overflow-y-auto 
      
        `}
    >
      {/* Header */}
      <div
        className={`p-4 border-b ${classes.cardBorder} flex items-center justify-between`}
      >
        {!state.ui.sidebarCollapsed && (
          <h2 className={`text-lg font-semibold ${classes.textPrimary}`}>
            أدوات التصميم
          </h2>
        )}
        <button
          onClick={() =>
            dispatch({
              type: "SET_UI",
              payload: { sidebarCollapsed: !state.ui.sidebarCollapsed },
            })
          }
          className={`p-2 rounded-lg ${classes.buttonSecondary} transition-colors`}
        >
          <ChevronRight
            size={16}
            className={`transform transition-transform ${
              state.ui.sidebarCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {!state.ui.sidebarCollapsed && (
        <>
          {/* Tabs */}
          <div
            className={`flex border-b ${classes.cardBorder} overflow-x-auto `}
          >
            {[
              { id: "fields", name: "حقول", icon: Grid },
              { id: "templates", name: "قوالب", icon: Layers },
              { id: "settings", name: "إعدادات", icon: Settings },
              { id: "theme", name: "تصميم", icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  dispatch({ type: "SET_UI", payload: { activePanel: tab.id } })
                }
                className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-4 transition-colors ${
                  state.ui.activePanel === tab.id
                    ? `bg-blue-50 text-blue-600 border-b-2 border-blue-600 ${
                        darkMode ? "bg-blue-900/20 text-blue-400" : ""
                      }`
                    : `${classes.textSecondary} hover:${classes.textPrimary}`
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="p-4">
            {state.ui.activePanel === "fields" && <FieldsPanel />}
            {state.ui.activePanel === "templates" && <TemplatesPanel />}
            {state.ui.activePanel === "settings" && <SettingsPanel />}
            {state.ui.activePanel === "theme" && <ThemePanel />}
          </div>
        </>
      )}
    </div>
  );

  const FieldsPanel = () => (
    <div className="space-y-6">
      {fieldTypes.map((category) => (
        <div key={category.category}>
          <h3
            className={`${classes.textPrimary} ${classes.buttonSecondary}  mb-3 px-5 py-2 rounded-lg text-sm md:text-base`}
          >
            {category.category}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {category.fields.map((field) => (
              <button
                key={field.id}
                onClick={() => addField(field)}
                className={`flex justify-start items-center p-1 gap-5 text-left ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 border-gray-600"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                } rounded-lg border transition-all hover:shadow-sm group`}
              >
                <div className="text-lg mb-1">{field.icon}</div>
                <div
                  className={`text-xs font-medium ${classes.textPrimary} group-hover:text-blue-600`}
                >
                  {field.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const TemplatesPanel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${classes.textPrimary}`}>
          القوالب الجاهزة
        </h3>
        <button className="text-xs text-blue-600 hover:text-blue-800">
          إنشاء قالب
        </button>
      </div>
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => applyTemplate(template)}
          className={`p-4 ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-gray-50 border-gray-200"
          } rounded-lg border hover:shadow-sm transition-all cursor-pointer group`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">{template.icon}</span>
            <div>
              <h4
                className={`text-sm font-medium ${classes.textPrimary} group-hover:text-blue-600`}
              >
                {template.name}
              </h4>
              <p className={`text-xs ${classes.textSecondary}`}>
                {template.description}
              </p>
            </div>
          </div>
          <div className={`text-xs ${classes.textMuted}`}>
            {template.fields.length} حقل
          </div>
        </div>
      ))}
    </div>
  );

  const SettingsPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-sm font-semibold ${classes.textPrimary} mb-4`}>
          تصدير
        </h3>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FileText size={14} />
            تصدير PDF
          </button>
          <button className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download size={14} />
            تصدير HTML
          </button>
          <button className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <BarChart size={14} />
            تصدير Excel
          </button>
        </div>
      </div>
    </div>
  );

  const ThemePanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-sm font-semibold ${classes.textPrimary} mb-4`}>
          ألوان النموذج
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            "blue",
            "green",
            "purple",
            "red",
            "orange",
            "teal",
            "indigo",
            "pink",
          ].map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-lg bg-${color}-500 hover:ring-2 hover:ring-${color}-300 transition-all`}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-sm font-semibold ${classes.textPrimary} mb-4`}>
          تخطيط النموذج
        </h3>
        <div className="space-y-2">
          <button
            className={`w-full p-3 border ${classes.cardBorder} rounded-lg text-sm hover:${classes.cardBg} text-right`}
          >
            📄 تخطيط كلاسيكي
          </button>
          <button
            className={`w-full p-3 border ${classes.cardBorder} rounded-lg text-sm hover:${classes.cardBg} text-right`}
          >
            🎴 تخطيط بطاقات
          </button>
          <button
            className={`w-full p-3 border ${classes.cardBorder} rounded-lg text-sm hover:${classes.cardBg} text-right`}
          >
            📊 تخطيط شبكي
          </button>
        </div>
      </div>
    </div>
  );

  const MainCanvas = () => (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div
        className={`flex items-center justify-between p-4 ${classes.cardBg} border-b ${classes.cardBorder}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={state.currentForm.title}
              onChange={(e) =>
                dispatch({
                  type: "SET_FORM",
                  payload: { title: e.target.value },
                })
              }
              placeholder="عنوان النموذج"
              className={`text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${classes.textPrimary}`}
            />
          </div>

          {/* <div className="flex items-center gap-2">
            <button
              className={`p-2 ${classes.textSecondary} hover:${classes.textPrimary} rounded-lg hover:bg-gray-100 transition-colors`}
              title="تراجع"
            >
              <Undo size={16} />
            </button>
            <button
              className={`p-2 ${classes.textSecondary} hover:${classes.textPrimary} rounded-lg hover:bg-gray-100 transition-colors`}
              title="إعادة"
            >
              <Redo size={16} />
            </button>
            <button
              className={`p-2 ${classes.textSecondary} hover:${classes.textPrimary} rounded-lg hover:bg-gray-100 transition-colors`}
              title="السجل"
            >
              <History size={16} />
            </button>
          </div> */}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* <button
              className={`px-3 py-2 text-sm ${classes.buttonSecondary} rounded-lg flex items-center gap-2`}
            >
              <Eye size={14} />
              معاينة
            </button> */}
            <button
              className={`px-3 py-2 text-sm ${classes.buttonPrimary} rounded-lg flex items-center gap-2`}
              onClick={handleSaveAll}
            >
              {state.currentForm.id ? (
                <>
                  <Save size={14} />
                  تعديل
                </>
              ) : (
                <>
                  <Save size={14} />
                  حفظ
                </>
              )}
            </button>
            <button
              className={`px-3 py-2 text-sm ${classes.buttonSecondary} rounded-lg flex items-center gap-2`}
              onClick={() => {
                setShowFormBuilder(false);
                setCurrentForm({});
              }}
            >
              <X size={14} />
              إغلاق
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        className={`flex-1 p-6 ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        } overflow-y-auto`}
      >
        <div
          className={`mx-auto ${classes.cardBg} rounded-lg shadow-sm border ${
            classes.cardBorder
          } ${getCanvasWidth()}`}
        >
          <div className="p-6">
            {state.currentForm.title && (
              <div className="">
                {state.currentForm.description && (
                  <p className={`${classes.textSecondary} mt-2`}>
                    {state.currentForm.description}
                  </p>
                )}
              </div>
            )}

            {state.currentForm?.fields.length === 0 ? (
              <div
                className={`text-center py-16 border-2 border-dashed ${classes.cardBorder} rounded-lg`}
              >
                <div className="text-6xl mb-4">📝</div>
                <h3
                  className={`text-xl font-medium ${classes.textPrimary} mb-2`}
                >
                  ابدأ ببناء نموذجك
                </h3>
                {/* <p className={`${classes.textSecondary} mb-6`}>
                    اسحب الحقول من الشريط الجانبي أو اختر قالب جاهز
                  </p> */}
                {/* <button
                  onClick={() =>
                    dispatch({
                      type: "SET_UI",
                      payload: { activePanel: "fields" },
                    })
                  }
                  className={`px-4 py-2 ${classes.buttonPrimary} rounded-lg transition-colors`}
                >
                  إضافة أول حقل
                </button> */}
              </div>
            ) : (
              <div className="space-y-4">
                {state.currentForm.fields.map((field, index) => (
                  <FieldRenderer
                    key={field.id || index}
                    field={field}
                    index={index}
                    onSelect={() => selectField(index)}
                    onDelete={() => deleteField(index)}
                    onUpdate={(updates) => updateField(index, updates)}
                    isSelected={state.ui.selectedField === index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const FieldRenderer = ({
    field,
    index,
    onSelect,
    onDelete,
    onUpdate,
    isSelected,
  }) => {
    const { classes } = useTheme();

    return (
      <div
        className={`group relative p-4 rounded-lg hover:${
          classes.cardBorder
        } transition-all cursor-pointer ${
          isSelected
            ? `border-2 border-blue-400 ${classes.cardBg}`
            : `border ${classes.cardBorder}`
        }`}
        onClick={onSelect}
      >
        {/* Field Controls */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className={`flex items-center gap-1 ${classes.cardBg} border ${classes.cardBorder} rounded-lg p-1 shadow-sm`}
          >
            <button
              className={`p-1 ${classes.textMuted} hover:text-blue-600 transition-colors`}
              title="تعديل"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              <Edit size={12} />
            </button>
            <button
              className={`p-1 ${classes.textMuted} hover:text-green-600 transition-colors`}
              title="نسخ"
              onClick={(e) => e.stopPropagation()}
            >
              <Copy size={12} />
            </button>
            <button
              className={`p-1 ${classes.textMuted} hover:text-red-600 transition-colors`}
              title="حذف"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 size={12} />
            </button>
            <div className={`w-px h-4 ${classes.cardBorder} mx-1`}></div>
            <button
              className={`p-1 ${classes.textMuted} hover:${classes.textPrimary} cursor-move`}
              title="سحب"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={12} />
            </button>
          </div>
        </div>

        {/* Field Content */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${classes.textPrimary}`}>
            {field.label}
            {field.required && <span className="text-red-500 mr-1">*</span>}
          </label>
          <DynamicField field={field} />
          {field.description && (
            <p className={`text-xs ${classes.textMuted}`}>
              {field.description}
            </p>
          )}
        </div>
      </div>
    );
  };

  const DynamicField = ({ field }) => {
    const { classes, darkMode } = useTheme();
    const baseClasses = `w-full px-3 py-2 border ${classes.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`;

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
        return (
          <input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder}
            className={baseClasses}
            disabled
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            className={baseClasses}
            rows={4}
            disabled
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            className={baseClasses}
            min={field.validation?.min}
            max={field.validation?.max}
            disabled
          />
        );

      case "select":
        return (
          <select className={baseClasses} disabled>
            <option value="">اختر {field.label}</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`field-${field.id}`}
                  value={option}
                  className="text-blue-600 focus:ring-blue-500"
                  disabled
                />
                <span className={`text-sm ${classes.textPrimary}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={option}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                  disabled
                />
                <span className={`text-sm ${classes.textPrimary}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case "date":
      case "time":
      case "datetime":
        return (
          <input
            type={field.type === "datetime" ? "datetime-local" : field.type}
            className={baseClasses}
            disabled
          />
        );

      case "range":
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              className={`w-full h-2 ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } rounded-lg appearance-none cursor-pointer`}
              disabled
            />
            <div
              className={`flex justify-between text-xs ${classes.textMuted}`}
            >
              <span>{field.validation?.min || 0}</span>
              <span>{field.validation?.max || 100}</span>
            </div>
          </div>
        );

      case "file":
        return (
          <div
            className={`border-2 border-dashed ${classes.cardBorder} rounded-lg p-6 text-center`}
          >
            <Upload className={`mx-auto h-8 w-8 ${classes.textMuted} mb-2`} />
            <p className={`text-sm ${classes.textSecondary}`}>
              اسحب الملفات هنا أو انقر للتحديد
            </p>
          </div>
        );

      case "image":
        return (
          <div
            className={`border-2 border-dashed ${classes.cardBorder} rounded-lg p-6 text-center`}
          >
            <Image className={`mx-auto h-8 w-8 ${classes.textMuted} mb-2`} />
            <p className={`text-sm ${classes.textSecondary}`}>
              اسحب الصور هنا أو انقر للتحديد
            </p>
          </div>
        );

      case "rating":
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                disabled
              >
                ⭐
              </button>
            ))}
          </div>
        );

      case "signature":
        return (
          <div
            className={`border ${
              classes.cardBorder
            } rounded-lg p-8 text-center ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <div className={`text-4xl ${classes.textMuted} mb-2`}>✍️</div>
            <p className={`text-sm ${classes.textSecondary}`}>منطقة التوقيع</p>
          </div>
        );

      case "location":
        return (
          <div
            className={`border ${
              classes.cardBorder
            } rounded-lg p-8 text-center ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <MapPin className={`mx-auto h-8 w-8 ${classes.textMuted} mb-2`} />
            <p className={`text-sm ${classes.textSecondary}`}>
              حدد الموقع على الخريطة
            </p>
          </div>
        );

      case "matrix":
        return (
          <div className="overflow-x-auto">
            <table className={`w-full border ${classes.cardBorder}`}>
              <thead>
                <tr className={classes.tableHeader}>
                  <th
                    className={`border ${classes.cardBorder} px-3 py-2 text-right text-sm font-medium ${classes.textPrimary}`}
                  >
                    الخيارات
                  </th>
                  {field.columns?.map((col, idx) => (
                    <th
                      key={idx}
                      className={`border ${classes.cardBorder} px-3 py-2 text-center text-sm font-medium ${classes.textPrimary}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {field.rows?.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td
                      className={`border ${classes.cardBorder} px-3 py-2 text-sm ${classes.textPrimary}`}
                    >
                      {row}
                    </td>
                    {field.columns?.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`border ${classes.cardBorder} px-3 py-2 text-center`}
                      >
                        <input
                          type="radio"
                          name={`matrix-${rowIdx}`}
                          className="text-blue-600"
                          disabled
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "calculator":
        return (
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-gray-50"} border ${
              classes.cardBorder
            } rounded-lg p-4`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calculator size={16} className="text-blue-600" />
              <span className={`text-sm font-medium ${classes.textPrimary}`}>
                حاسبة تفاعلية
              </span>
            </div>
            <input
              type="text"
              placeholder="النتيجة ستظهر هنا..."
              className={`w-full px-3 py-2 border ${classes.cardBorder} rounded ${classes.input}`}
              disabled
            />
          </div>
        );

      case "toggle":
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <input type="checkbox" className="sr-only" disabled />
              <div
                className={`w-10 h-6 ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}
              ></div>
            </div>
            <span className={`text-sm ${classes.textPrimary}`}>
              {field.toggleLabel || "تفعيل/إيقاف"}
            </span>
          </div>
        );

      default:
        return (
          <div
            className={`p-4 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } border ${classes.cardBorder} rounded-lg text-center`}
          >
            <span className={`text-sm ${classes.textMuted}`}>
              معاينة غير متوفرة لهذا النوع
            </span>
          </div>
        );
    }
  };

  const handleSaveAll = () => {
    if (!state.currentForm.title.trim()) {
      showNotification("يرجى إدخال عنوان النموذج", "error");
      return;
    }

    if (!state.currentForm.id) {
      setCustomForms([
        ...state.forms,
        {
          ...state.currentForm,
          id: `form_${Date.now()}`,
          createdDate:
            currentForm?.createdDate || new Date().toLocaleDateString("ar-SA"),
        },
      ]);
    } else {
      const data = state.forms.map((form) =>
        form.id === state.currentForm.id ? state.currentForm : form
      );
      setCustomForms(data);
    }

    showNotification("تم حفظ النموذج بنجاح", "success");
    // setTimeout(() => onClose(), 1000);
    setShowFormBuilder(false);
    setCurrentForm({});
  };

  // Property Panel Component
  const PropertyPanel = () => {
    const { classes } = useTheme();
    const selectedField =
      state.ui.selectedField !== null
        ? state.currentForm.fields[state.ui.selectedField]
        : null;

    if (!selectedField) {
      return (
        <div
          className={`w-80 ${classes.cardBg} border-l ${classes.cardBorder}`}
        >
          <div className="p-4">
            <h3 className={`text-lg font-semibold ${classes.textPrimary} mb-4`}>
              خصائص الحقل
            </h3>
            <div className={`text-center py-8 ${classes.textSecondary}`}>
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <p>اختر حقل لعرض خصائصه</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`w-80 ${classes.cardBg} border-l ${classes.cardBorder}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${classes.textPrimary}`}>
              خصائص الحقل
            </h3>
            <button
              onClick={() => dispatch({ type: "SELECT_FIELD", payload: null })}
              className={`p-1 ${classes.textMuted} hover:${classes.textPrimary}`}
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium ${classes.textSecondary} mb-2`}
              >
                اسم الحقل
              </label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) =>
                  updateField(state.ui.selectedField, { label: e.target.value })
                }
                className={`w-full px-3 py-2 border ${classes.cardBorder} rounded-lg focus:ring-2 focus:ring-blue-500 ${classes.input}`}
                placeholder="أدخل اسم الحقل"
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${classes.textSecondary} mb-2`}
              >
                النص التوضيحي
              </label>
              <input
                type="text"
                value={selectedField.placeholder || ""}
                onChange={(e) =>
                  updateField(state.ui.selectedField, {
                    placeholder: e.target.value,
                  })
                }
                className={`w-full px-3 py-2 border ${classes.cardBorder} rounded-lg focus:ring-2 focus:ring-blue-500 ${classes.input}`}
                placeholder="نص توضيحي للمستخدم"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={selectedField.required}
                onChange={(e) =>
                  updateField(state.ui.selectedField, {
                    required: e.target.checked,
                  })
                }
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="required"
                className={`text-sm font-medium ${classes.textSecondary}`}
              >
                حقل مطلوب
              </label>
            </div>

            {(selectedField.type === "select" ||
              selectedField.type === "radio" ||
              selectedField.type === "checkbox") && (
              <div>
                <label
                  className={`block text-sm font-medium ${classes.textSecondary} mb-2`}
                >
                  الخيارات
                </label>
                <div className="space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...selectedField.options];
                          newOptions[index] = e.target.value;
                          updateField(state.ui.selectedField, {
                            options: newOptions,
                          });
                        }}
                        className={`flex-1 px-2 py-1 border ${classes.cardBorder} rounded text-sm ${classes.input}`}
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedField.options.filter(
                            (_, i) => i !== index
                          );
                          updateField(state.ui.selectedField, {
                            options: newOptions,
                          });
                        }}
                        className={`p-1 ${classes.textMuted} hover:text-red-600`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [
                        ...(selectedField.options || []),
                        `خيار ${(selectedField.options?.length || 0) + 1}`,
                      ];
                      updateField(state.ui.selectedField, {
                        options: newOptions,
                      });
                    }}
                    className={`w-full px-2 py-1 border-2 border-dashed ${classes.cardBorder} rounded text-sm ${classes.textSecondary} hover:${classes.textPrimary} flex items-center justify-center gap-1`}
                  >
                    <Plus size={14} />
                    إضافة خيار
                  </button>
                </div>
              </div>
            )}

            {(selectedField.type === "number" ||
              selectedField.type === "range") && (
              <div className="space-y-2">
                <div>
                  <label
                    className={`block text-sm font-medium ${classes.textSecondary} mb-1`}
                  >
                    الحد الأدنى
                  </label>
                  <input
                    type="number"
                    value={selectedField.validation?.min || ""}
                    onChange={(e) =>
                      updateField(state.ui.selectedField, {
                        validation: {
                          ...selectedField.validation,
                          min: e.target.value,
                        },
                      })
                    }
                    className={`w-full px-3 py-2 border ${classes.cardBorder} rounded-lg focus:ring-2 focus:ring-blue-500 ${classes.input}`}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${classes.textSecondary} mb-1`}
                  >
                    الحد الأقصى
                  </label>
                  <input
                    type="number"
                    value={selectedField.validation?.max || ""}
                    onChange={(e) =>
                      updateField(state.ui.selectedField, {
                        validation: {
                          ...selectedField.validation,
                          max: e.target.value,
                        },
                      })
                    }
                    className={`w-full px-3 py-2 border ${classes.cardBorder} rounded-lg focus:ring-2 focus:ring-blue-500 ${classes.input}`}
                    placeholder="100"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <NotificationToast
        notification={notification}
        onClose={() => showNotification(null)}
      />
      <Sidebar />
      <MainCanvas />
      {/* <PropertyPanel /> */}
    </div>
  );
}
