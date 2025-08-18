import React, { useState, useEffect, useCallback } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  Save,
  Eye,
  Copy,
  Download,
  Upload,
  Settings,
  ChevronDown,
  ChevronUp,
  Move,
  AlertCircle,
  Check,
  Palette,
  Type,
  Image,
  MapPin,
  Star,
  PenTool,
  BarChart3,
  Calculator,
  Layers,
  Code,
  Undo,
  Redo,
  Search,
  Filter,
  Grid,
  List,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { useTheme } from "../ThemeContext";

const advancedFieldTypes = [
  { value: "text", label: "نص قصير", icon: "📝", category: "basic" },
  { value: "textarea", label: "نص طويل", icon: "📄", category: "basic" },
  { value: "number", label: "رقم", icon: "🔢", category: "basic" },
  { value: "email", label: "بريد إلكتروني", icon: "📧", category: "basic" },
  { value: "phone", label: "رقم هاتف", icon: "📱", category: "basic" },
  { value: "date", label: "تاريخ", icon: "📅", category: "basic" },
  { value: "time", label: "وقت", icon: "⏰", category: "basic" },
  { value: "datetime", label: "تاريخ ووقت", icon: "🗓️", category: "basic" },
  { value: "select", label: "قائمة اختيار", icon: "📋", category: "choice" },
  { value: "radio", label: "اختيار واحد", icon: "⚪", category: "choice" },
  {
    value: "checkbox",
    label: "اختيارات متعددة",
    icon: "☑️",
    category: "choice",
  },
  { value: "file", label: "رفع ملف", icon: "📎", category: "media" },
  { value: "image", label: "رفع صورة", icon: "🖼️", category: "media" },
  {
    value: "rating",
    label: "تقييم بالنجوم",
    icon: "⭐",
    category: "interactive",
  },
  {
    value: "slider",
    label: "شريط انزلاق",
    icon: "🎛️",
    category: "interactive",
  },
  {
    value: "signature",
    label: "التوقيع الرقمي",
    icon: "✍️",
    category: "advanced",
  },
  {
    value: "location",
    label: "الموقع الجغرافي",
    icon: "📍",
    category: "advanced",
  },
  { value: "color", label: "اختيار لون", icon: "🎨", category: "advanced" },
  { value: "matrix", label: "جدول تقييم", icon: "📊", category: "advanced" },
  { value: "calculated", label: "حقل محسوب", icon: "🧮", category: "advanced" },
  { value: "section", label: "فاصل قسم", icon: "📑", category: "layout" },
  { value: "html", label: "محتوى HTML", icon: "🔧", category: "layout" },
];

const formTemplates = [
  {
    id: "patient-info",
    name: "معلومات المريض",
    description: "نموذج لجمع المعلومات الأساسية للمريض",
    fields: [
      { type: "text", label: "الاسم الكامل", required: true },
      { type: "date", label: "تاريخ الميلاد", required: true },
      {
        type: "radio",
        label: "الجنس",
        options: ["ذكر", "أنثى"],
        required: true,
      },
      { type: "phone", label: "رقم الهاتف", required: true },
      { type: "email", label: "البريد الإلكتروني" },
      { type: "textarea", label: "العنوان", rows: 3 },
    ],
  },
  {
    id: "medical-history",
    name: "التاريخ الطبي",
    description: "نموذج لتسجيل التاريخ الطبي للمريض",
    fields: [
      {
        type: "checkbox",
        label: "الأمراض المزمنة",
        options: ["السكري", "ضغط الدم", "أمراض القلب", "الربو"],
      },
      { type: "textarea", label: "الأدوية الحالية" },
      { type: "textarea", label: "الحساسية" },
      { type: "radio", label: "التدخين", options: ["نعم", "لا", "سابقاً"] },
    ],
  },
  {
    id: "appointment",
    name: "حجز موعد",
    description: "نموذج لحجز المواعيد الطبية",
    fields: [
      { type: "text", label: "اسم المريض", required: true },
      { type: "date", label: "التاريخ المطلوب", required: true },
      {
        type: "select",
        label: "الوقت المفضل",
        options: ["صباحاً", "بعد الظهر", "مساءً"],
        required: true,
      },
      {
        type: "select",
        label: "نوع الاستشارة",
        options: ["استشارة عامة", "متابعة", "طارئ"],
      },
      { type: "textarea", label: "سبب الزيارة" },
    ],
  },
];

const AdvancedFieldTypeSelector = ({ value, onChange, classes }) => {
  const [selectedCategory, setSelectedCategory] = useState("basic");
  const [isOpen, setIsOpen] = useState(false);

  const categories = {
    basic: "أساسي",
    choice: "اختيارات",
    media: "وسائط",
    interactive: "تفاعلي",
    advanced: "متقدم",
    layout: "تخطيط",
  };

  const filteredFields = advancedFieldTypes.filter(
    (field) => field.category === selectedCategory
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${classes.input} flex items-center justify-between`}
      >
        <span>
          {advancedFieldTypes.find((f) => f.value === value)?.icon}{" "}
          {advancedFieldTypes.find((f) => f.value === value)?.label ||
            "اختر نوع الحقل"}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-1 border rounded-lg shadow-lg ${classes.cardBg} ${classes.cardBorder}`}
        >
          {/* تبويبات الفئات */}
          <div className="flex border-b overflow-x-auto">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-2 text-xs whitespace-nowrap ${
                  selectedCategory === key
                    ? classes.buttonPrimary
                    : classes.buttonSecondary
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* خيارات الحقول */}
          <div className="max-h-60 overflow-y-auto">
            {filteredFields.map((field) => (
              <button
                key={field.value}
                onClick={() => {
                  onChange(field.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 ${
                  value === field.value ? "bg-blue-50 dark:bg-blue-900" : ""
                }`}
              >
                <span>{field.icon}</span>
                <span className="text-sm">{field.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// مكون معاينة الحقل المتقدم
const EnhancedFieldPreview = ({ field, classes, formTheme }) => {
  console.log(field);
  const renderAdvancedField = () => {
    switch (field.type) {
      case "signature":
        return (
          <div
            className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center ${classes.cardBorder}`}
          >
            <div className="text-center">
              <PenTool className="mx-auto h-8 w-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">منطقة التوقيع</p>
            </div>
          </div>
        );

      case "location":
        return (
          <div
            className={`w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center ${classes.cardBorder}`}
          >
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">خريطة الموقع</p>
            </div>
          </div>
        );

      case "color":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              className="w-12 h-8 border rounded cursor-pointer"
              disabled
            />
            <span className="text-sm text-gray-500">اختيار اللون</span>
          </div>
        );

      case "image":
        return (
          <div
            className={`w-full p-6 border-2 border-dashed rounded-lg text-center ${classes.cardBorder}`}
          >
            <Image className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">رفع الصور</p>
          </div>
        );

      case "matrix":
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50"></th>
                  {["ممتاز", "جيد", "مقبول", "ضعيف"].map((option) => (
                    <th
                      key={option}
                      className="border border-gray-300 p-2 bg-gray-50 text-sm"
                    >
                      {option}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["جودة الخدمة", "سرعة الاستجابة", "الاحترافية"].map(
                  (criterion) => (
                    <tr key={criterion}>
                      <td className="border border-gray-300 p-2 font-medium text-sm">
                        {criterion}
                      </td>
                      {[1, 2, 3, 4].map((value) => (
                        <td
                          key={value}
                          className="border border-gray-300 p-2 text-center"
                        >
                          <input type="radio" name={criterion} disabled />
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        );

      case "calculated":
        return (
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value="محسوب تلقائياً"
              className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 ${classes.input}`}
              disabled
            />
          </div>
        );

      case "section":
        return (
          <div className="space-y-4">
            <div className="border-t-2 border-blue-500 pt-4">
              <h3 className="text-lg font-semibold text-blue-600">
                {field.label || "عنوان القسم"}
              </h3>
              {field.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {field.description}
                </p>
              )}
            </div>
          </div>
        );

      case "html":
        return (
          <div className={`p-4 border rounded-lg ${classes.cardBorder}`}>
            <Code className="h-5 w-5 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">محتوى HTML مخصص</p>
          </div>
        );

      case "datetime":
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className={`px-3 py-2 border rounded-lg ${classes.input}`}
              disabled
            />
            <input
              type="time"
              className={`px-3 py-2 border rounded-lg ${classes.input}`}
              disabled
            />
          </div>
        );

      default:
        // العودة للحقول الأساسية
        return renderBasicField();
    }
  };

  const renderBasicField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <input
            type={field.type}
            placeholder={field.placeholder || `أدخل ${field.label}`}
            className={`w-full px-3 py-2 border rounded-lg ${classes.input}`}
            disabled
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder || `أدخل ${field.label}`}
            className={`w-full px-3 py-2 border rounded-lg ${classes.input}`}
            rows={field.rows || 3}
            disabled
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder || "0"}
            min={field.min}
            max={field.max}
            className={`w-full px-3 py-2 border rounded-lg ${classes.input}`}
            disabled
          />
        );

      case "date":
      case "time":
        return (
          <input
            type={field.type}
            className={`w-full px-3 py-2 border rounded-lg ${classes.input}`}
            disabled
          />
        );

      case "select":
        return (
          <select
            className={`w-full px-3 py-2 border rounded-lg ${classes.input}`}
            disabled
          >
            <option>اختر {field.label}</option>
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
              <label key={idx} className="flex items-center">
                <input type="radio" name={field.id} className="ml-2" disabled />
                <span className={classes.textSecondary}>{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center">
                <input type="checkbox" className="ml-2" disabled />
                <span className={classes.textSecondary}>{option}</span>
              </label>
            ))}
          </div>
        );

      case "file":
        return (
          <div
            className={`w-full px-3 py-8 border-2 border-dashed rounded-lg text-center ${classes.cardBorder} ${classes.textMuted}`}
          >
            <Upload className="mx-auto h-8 w-8 mb-2" />
            <p>اسحب الملفات هنا أو انقر للتحديد</p>
            {field.acceptedTypes && (
              <p className="text-xs mt-1">
                الأنواع المسموحة: {field.acceptedTypes}
              </p>
            )}
          </div>
        );

      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-6 w-6 text-yellow-400 fill-current cursor-pointer"
              />
            ))}
          </div>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              className="w-full"
              disabled
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{field.min || 0}</span>
              <span>{field.max || 100}</span>
            </div>
          </div>
        );

      default:
        return renderAdvancedField();
    }
  };

  if (field.type === "section") {
    return renderAdvancedField();
  }

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${classes.textSecondary}`}>
        {field.label}
        {field.required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {field.description && (
        <p className={`text-xs ${classes.textMuted}`}>{field.description}</p>
      )}
      {renderAdvancedField()}
    </div>
  );
};

// مكون محرر النماذج المتقدم
const SuperAdvancedFormBuilder = () => {
  // الحالات الأساسية
  const [forms, setForms] = useState([]);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const { classes, darkMode } = useTheme();
  // حالات منشئ النماذج
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [notification, setNotification] = useState(null);

  // حالات متقدمة
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggedField, setDraggedField] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editingField, setEditingField] = useState(null); // null = مش فاتح تعديل

  // إعدادات التصميم
  const [formSettings, setFormSettings] = useState({
    theme: "default",
    primaryColor: "#3B82F6",
    font: "Tajawal",
    showLogo: false,
    logoUrl: "",
    customCSS: "",
  });

  // تحميل البيانات عند البداية
  useEffect(() => {
    loadForms();
  }, []);

  // حفظ التاريخ للتراجع/الإعادة
  const saveToHistory = useCallback(() => {
    const state = {
      formTitle,
      formDescription,
      formFields: [...formFields],
      formSettings: { ...formSettings },
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [
    formTitle,
    formDescription,
    formFields,
    formSettings,
    history,
    historyIndex,
  ]);

  const moveFieldUp = (index) => {
    if (index === 0) return; // أول عنصر مينفعش يطلع
    const newFields = [...formFields];
    const temp = newFields[index];
    newFields[index] = newFields[index - 1];
    newFields[index - 1] = temp;
    setFormFields(newFields);
  };

  const moveFieldDown = (index) => {
    if (index === formFields.length - 1) return; // آخر عنصر مينفعش ينزل
    const newFields = [...formFields];
    const temp = newFields[index];
    newFields[index] = newFields[index + 1];
    newFields[index + 1] = temp;
    setFormFields(newFields);
  };

  // وظائف إدارة التخزين
  const loadForms = () => {
    try {
      const savedForms = JSON.parse(
        sessionStorage.getItem("advancedMedicalForms") || "[]"
      );
      setForms(savedForms);
    } catch (error) {
      console.error("Error loading forms:", error);
      showNotification("خطأ في تحميل النماذج", "error");
    }
  };

  const saveForms = (updatedForms) => {
    try {
      sessionStorage.setItem(
        "advancedMedicalForms",
        JSON.stringify(updatedForms)
      );
      setForms(updatedForms);
    } catch (error) {
      console.error("Error saving forms:", error);
      showNotification("خطأ في حفظ النماذج", "error");
    }
  };

  // وظائف الإشعارات
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // وظائف إدارة الحقول
  const generateFieldId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = (fieldType = "text") => {
    const newField = {
      id: generateFieldId(),
      type: fieldType,
      label: `حقل جديد ${formFields.length + 1}`,
      placeholder: "",
      description: "",
      required: false,
      options: [],
      validation: {},
      conditionalLogic: null,
      order: formFields.length,
    };

    setFormFields([...formFields, newField]);
    saveToHistory();
    showNotification("تم إضافة حقل جديد", "success");
  };

  const addFieldFromTemplate = (template) => {
    const templateFields = template.fields.map((field, index) => ({
      ...field,
      id: generateFieldId(),
      order: formFields.length + index,
    }));

    setFormFields([...formFields, ...templateFields]);
    saveToHistory();
    showNotification(`تم إضافة قالب: ${template.name}`, "success");
    setShowTemplates(false);
  };

  const updateField = (fieldId, updates) => {
    setFormFields(
      formFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
    saveToHistory();
  };

  const removeField = (fieldId) => {
    setFormFields(formFields.filter((field) => field.id !== fieldId));
    saveToHistory();
    showNotification("تم حذف الحقل", "success");
  };

  const duplicateField = (fieldId) => {
    const field = formFields.find((f) => f.id === fieldId);
    if (field) {
      const duplicatedField = {
        ...field,
        id: generateFieldId(),
        label: field.label + " (نسخة)",
        order: formFields.length,
      };
      setFormFields([...formFields, duplicatedField]);
      saveToHistory();
      showNotification("تم نسخ الحقل", "success");
    }
  };

  // تصدير واستيراد النماذج
  const exportForms = () => {
    const dataStr = JSON.stringify(forms, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `medical_forms_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    showNotification("تم تصدير النماذج", "success");
  };

  const importForms = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedForms = JSON.parse(e.target.result);
          if (Array.isArray(importedForms)) {
            saveForms([...forms, ...importedForms]);
            showNotification("تم استيراد النماذج بنجاح", "success");
          } else {
            showNotification("صيغة الملف غير صحيحة", "error");
          }
        } catch (error) {
          showNotification("خطأ في قراءة الملف", "error");
        }
      };
      reader.readAsText(file);
    }
    event.target.value = "";
  };

  // وظائف السحب والإفلات
  const handleDragStart = (e, fieldId) => {
    setDraggedField(fieldId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetFieldId) => {
    e.preventDefault();
    if (!draggedField || draggedField === targetFieldId) return;

    const draggedIndex = formFields.findIndex((f) => f.id === draggedField);
    const targetIndex = formFields.findIndex((f) => f.id === targetFieldId);

    const newFields = [...formFields];
    const [removed] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, removed);

    setFormFields(newFields);
    setDraggedField(null);
    saveToHistory();
  };

  // وظائف التراجع والإعادة
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setFormTitle(prevState.formTitle);
      setFormDescription(prevState.formDescription);
      setFormFields(prevState.formFields);
      setFormSettings(prevState.formSettings);
      setHistoryIndex(historyIndex - 1);
      showNotification("تم التراجع", "success");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setFormTitle(nextState.formTitle);
      setFormDescription(nextState.formDescription);
      setFormFields(nextState.formFields);
      setFormSettings(nextState.formSettings);
      setHistoryIndex(historyIndex + 1);
      showNotification("تم الإعادة", "success");
    }
  };

  // وظائف إدارة النماذج
  const saveForm = () => {
    if (!formTitle.trim()) {
      showNotification("يرجى إدخال عنوان النموذج", "error");
      return;
    }

    if (formFields.length === 0) {
      showNotification("يرجى إضافة حقل واحد على الأقل", "error");
      return;
    }

    const formData = {
      id: currentForm?.id || `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields: formFields,
      settings: formSettings,
      createdDate:
        currentForm?.createdDate || new Date().toLocaleDateString("ar-SA"),
      modifiedDate: new Date().toLocaleDateString("ar-SA"),
      version: (currentForm?.version || 0) + 1,
    };

    const updatedForms = currentForm
      ? forms.map((form) => (form.id === currentForm.id ? formData : form))
      : [...forms, formData];

    saveForms(updatedForms);
    showNotification(
      currentForm ? "تم تحديث النموذج بنجاح" : "تم حفظ النموذج بنجاح",
      "success"
    );
    resetFormBuilder();
  };

  const resetFormBuilder = () => {
    setCurrentForm(null);
    setFormTitle("");
    setFormDescription("");
    setFormFields([]);
    setShowFormBuilder(false);
    setShowPreview(false);
    setHistory([]);
    setHistoryIndex(-1);
    setFormSettings({
      theme: "default",
      primaryColor: "#007bff",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* الإشعارات */}
      {notification && (
        <div
          className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg border flex items-center space-x-2 ${
            notification.type === "success"
              ? classes.success
              : notification.type === "error"
              ? classes.error
              : classes.warning
          }`}
        >
          <div className="flex-1 flex items-center space-x-2">
            {notification.type === "success" && <Check className="h-5 w-5" />}
            {notification.type === "error" && (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* رأس الصفحة */}
      <div className={`rounded-xl shadow-lg p-6 mb-6 ${classes.cardBg}`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${classes.textPrimary}`}>
              إدارة النماذج الطبية
            </h1>
            <p className={`mt-2 ${classes.textSecondary}`}>
              أنشئ وخصص النماذج الطبية بسهولة تامة
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".json"
                onChange={importForms}
                className="hidden"
                id="import-forms"
              />
              <label
                htmlFor="import-forms"
                className={`cursor-pointer px-4 py-2 rounded-lg transition-colors duration-200 ${classes.buttonSecondary} flex items-center space-x-2`}
              >
                <Upload className="h-4 w-4" />
                <span>استيراد</span>
              </label>

              <button
                onClick={exportForms}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${classes.buttonSecondary} flex items-center space-x-2`}
                disabled={forms.length === 0}
              >
                <Download className="h-4 w-4" />
                <span>تصدير</span>
              </button>
            </div>

            <button
              onClick={() => setShowFormBuilder(true)}
              className={`px-6 py-2 rounded-lg transition-colors duration-200 ${classes.buttonPrimary} flex items-center space-x-2`}
            >
              <PlusCircle className="h-5 w-5" />
              <span>نموذج جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* قائمة النماذج */}
      {!showFormBuilder && (
        <div className={`rounded-xl shadow-lg p-6 ${classes.cardBg}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className={`border rounded-lg p-6 hover:shadow-md transition-all duration-300 ${classes.cardBorder} ${classes.tableRow}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${classes.textPrimary}`}
                    >
                      {form.title}
                    </h3>
                    {form.description && (
                      <p className={`text-sm mt-1 ${classes.textSecondary}`}>
                        {form.description}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => editForm(form)}
                      className={`p-2 transition-colors duration-200 ${classes.textSecondary} hover:${classes.textPrimary}`}
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => duplicateForm(form)}
                      className={`p-2 transition-colors duration-200 ${classes.textSecondary} hover:${classes.textPrimary}`}
                      title="نسخ"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className={`space-y-2 text-sm ${classes.textMuted}`}>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>تم الإنشاء: {form.createdDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 ml-2" />
                    <span>عدد الحقول: {form.fields?.length || 0}</span>
                  </div>
                  {form.version && (
                    <div className="flex items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        الإصدار {form.version}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {forms.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className={`text-6xl mb-4 ${classes.textMuted}`}>📋</div>
                <h3
                  className={`text-xl font-medium mb-2 ${classes.textSecondary}`}
                >
                  لا توجد نماذج بعد
                </h3>
                <p className={classes.textMuted}>أنشئ أول نموذج طبي لك الآن</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* منشئ النماذج */}
      {showFormBuilder && (
        <div className={`rounded-xl shadow-lg p-6 ${classes.cardBg}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${classes.textPrimary}`}>
              {currentForm ? "تعديل النموذج" : "إنشاء نموذج جديد"}
            </h2>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${classes.buttonSecondary} flex items-center space-x-2`}
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? "إخفاء المعاينة" : "معاينة"}</span>
              </button>

              <button
                onClick={resetFormBuilder}
                className={`transition-colors duration-200 ${classes.textSecondary} hover:${classes.textPrimary}`}
              >
                إلغاء
              </button>
            </div>
          </div>

          <div
            className={
              showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : ""
            }
          >
            {/* محرر النموذج */}
            <div className="space-y-6">
              {/* معلومات النموذج الأساسية */}
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}
                  >
                    عنوان النموذج *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${classes.input}`}
                    placeholder="أدخل عنوان النموذج"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}
                  >
                    وصف النموذج
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${classes.input}`}
                    rows="3"
                    placeholder="أدخل وصف النموذج (اختياري)"
                  />
                </div>
              </div>

              {/* إدارة الحقول */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label
                    className={`block text-sm font-medium ${classes.textSecondary}`}
                  >
                    حقول النموذج ({formFields.length})
                  </label>
                  <button
                    onClick={addField}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center space-x-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>إضافة حقل</span>
                  </button>
                </div>


             
      
                {formFields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, field.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, field.id)}
                    className={`border rounded-lg p-4 mb-4 transition-colors duration-300
      ${classes.cardBorder}
      ${darkMode ? "bg-gray-750" : "bg-gray-50"}
      ${draggedField === field.id ? "opacity-50 border-dashed" : ""}
    `}
                  >
                    {/* العنوان + الأزرار */}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">
                        {field.label || "حقل بدون عنوان"}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moveFieldUp(index)}
                          disabled={index === 0}
                          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFieldDown(index)}
                          disabled={index === formFields.length - 1}
                          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                          ↓
                        </button>
                      </div>
                    </div>

                    {/* مثال على المحتوى */}
                    {field.type === "text" && (
                      <input
                        type="text"
                        placeholder="نص تجريبي"
                        className="w-full p-2 border rounded"
                        disabled
                      />
                    )}
                  </div>
                ))}
                {formFields.length === 0 && (
                  <div
                    className={`text-center py-8 border-2 border-dashed rounded-lg ${classes.cardBorder}`}
                  >
                    <div className={`text-4xl mb-2 ${classes.textMuted}`}>
                      📝
                    </div>
                    <p className={classes.textMuted}>
                      لم يتم إضافة أي حقول بعد
                    </p>
                    <button
                      onClick={addField}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      إضافة أول حقل
                    </button>
                  </div>
                )}
              </div>

              {/* أزرار الحفظ */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={saveForm}
                  disabled={!formTitle.trim() || formFields.length === 0}
                  className={`px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                    !formTitle.trim() || formFields.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : classes.buttonPrimary
                  }`}
                >
                  <Save className="h-4 w-4" />
                  <span>حفظ النموذج</span>
                </button>
              </div>
            </div>

            {/* معاينة النموذج */}
            {showPreview && (
              <div className="space-y-6">
                <div
                  className={`border rounded-lg p-6 ${classes.cardBorder} ${classes.cardBg}`}
                >
                  <div className="mb-6">
                    <h3
                      className={`text-xl font-bold ${classes.textPrimary} mb-2`}
                    >
                      معاينة النموذج
                    </h3>
                    <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500 mb-4"></div>
                  </div>

                  {formTitle && (
                    <div className="mb-6">
                      <h4
                        className={`text-lg font-semibold ${classes.textPrimary}`}
                      >
                        {formTitle}
                      </h4>
                      {formDescription && (
                        <p className={`mt-2 ${classes.textSecondary}`}>
                          {formDescription}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-6">
                    {formFields.map((field, index) => (
                      <div key={field.id}>
                        <EnhancedFieldPreview field={field} classes={classes} />
                        {index < formFields.length - 1 && (
                          <div
                            className={`my-4 border-t ${classes.cardBorder}`}
                          ></div>
                        )}
                      </div>
                    ))}

                    {formFields.length === 0 && (
                      <div className="text-center py-8">
                        <div className={`text-4xl mb-2 ${classes.textMuted}`}>
                          👀
                        </div>
                        <p className={classes.textMuted}>
                          أضف بعض الحقول لرؤية المعاينة
                        </p>
                      </div>
                    )}

                    {formFields.length > 0 && (
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                          className={`w-full py-3 rounded-lg ${classes.buttonPrimary} font-medium`}
                        >
                          إرسال النموذج
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdvancedFormBuilder;
