import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  Save,
  Eye,
  Copy,
  X,
  Plus,
  Download,
  Upload,
  Settings,
  ChevronDown,
  ChevronUp,
  Move,
  AlertCircle,
  Check,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import useCustomFormStore from "../store/useCustomFormStore";
import { useTheme } from "../ThemeContext";

// Custom Hooks
const useFormValidation = () => {
  const validateField = useCallback((field) => {
    const errors = {};

    if (!field.label?.trim()) {
      errors.label = "اسم الحقل مطلوب";
    }

    if (
      ["select", "multi-select", "radio", "checkbox"].includes(field.fieldType)
    ) {
      if (!field.options || field.options.length === 0) {
        errors.options = "يجب إضافة خيار واحد على الأقل";
      }
    }

    return errors;
  }, []);

  return { validateField };
};

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

// Drag and Drop utility functions
const moveArrayItem = (array, fromIndex, toIndex) => {
  const newArray = [...array];
  const item = newArray.splice(fromIndex, 1)[0];
  newArray.splice(toIndex, 0, item);
  return newArray;
};

// Field Options Editor with Drag and Drop
const FieldOptionsEditor = ({ options = [], onChange }) => {
  const { classes } = useTheme();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  const handleOptionChange = useCallback(
    (index, value) => {
      const newOptions = [...options];
      newOptions[index] = value;
      onChange(newOptions);
    },
    [options, onChange]
  );

  const handleAddOption = useCallback(() => {
    onChange([...options, ""]);
  }, [options, onChange]);

  const handleDeleteOption = useCallback(
    (index) => {
      const newOptions = options.filter((_, i) => i !== index);
      onChange(newOptions);
    },
    [options, onChange]
  );

  const handleMoveOption = useCallback(
    (index, direction) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < options.length) {
        const newOptions = moveArrayItem(options, index, targetIndex);
        onChange(newOptions);
      }
    },
    [options, onChange]
  );

  const handleDragStart = useCallback((e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== dropIndex) {
        const newOptions = moveArrayItem(options, draggedIndex, dropIndex);
        onChange(newOptions);
      }
      setDraggedIndex(null);
      setDraggedOverIndex(null);
    },
    [draggedIndex, options, onChange]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  }, []);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <label className={`block text-sm font-medium ${classes.textPrimary}`}>
          خيارات الحقل *
        </label>
        <button
          onClick={handleAddOption}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-all"
        >
          <Plus size={14} />
          إضافة خيار
        </button>
      </div>

      {options.length === 0 ? (
        <div
          className={`p-6 border-2 border-dashed rounded-lg text-center ${classes.cardBorder}`}
        >
          <div className="text-2xl mb-2">📝</div>
          <p className={classes.textMuted}>لم يتم إضافة خيارات بعد</p>
          <button
            onClick={handleAddOption}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            إضافة أول خيار
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 cursor-move ${
                classes.cardBg
              } ${classes.cardBorder} ${
                draggedIndex === index
                  ? "opacity-50 scale-95"
                  : draggedOverIndex === index
                  ? "border-blue-500 shadow-md transform scale-102"
                  : ""
              }`}
            >
              <GripVertical
                size={16}
                className={`${classes.textMuted} hover:${classes.textSecondary} transition-colors`}
              />

              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`الخيار ${index + 1}`}
                className={`flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${classes.input}`}
              />

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveOption(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="تحريك للأعلى"
                >
                  <ArrowUp size={14} />
                </button>

                <button
                  onClick={() => handleMoveOption(index, "down")}
                  disabled={index === options.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="تحريك للأسفل"
                >
                  <ArrowDown size={14} />
                </button>

                <button
                  onClick={() => handleDeleteOption(index)}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="حذف الخيار"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Field List Item with Drag and Drop
const FieldListItem = ({
  field,
  index,
  onEdit,
  onDelete,
  onMove,
  onDuplicate,
  isDragging,
  draggedOverIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const { classes } = useTheme();

  const getFieldIcon = (type) => {
    const icons = {
      text: "📝",
      textarea: "📄",
      number: "🔢",
      email: "📧",
      phone: "📱",
      date: "📅",
      time: "⏰",
      select: "📋",
      radio: "⚪",
      checkbox: "☑️",
      file: "📎",
      rating: "⭐",
      slider: "🎛️",
    };
    return icons[type] || "📝";
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 cursor-move ${
        classes.cardBg
      } ${classes.cardBorder} ${
        isDragging
          ? "opacity-50 scale-95 rotate-1"
          : draggedOverIndex === index
          ? "border-purple-500 shadow-lg transform scale-102 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
          : "hover:shadow-md hover:border-gray-400"
      }`}
    >
      <GripVertical
        size={20}
        className={`${classes.textMuted} hover:${classes.textSecondary} transition-colors`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{getFieldIcon(field.fieldType)}</span>
          <h4 className={`font-medium truncate ${classes.textPrimary}`}>
            {field.label}
          </h4>
          {field.required && (
            <span className="text-red-500 text-sm font-bold">*</span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className={`px-2 py-1 rounded-full ${classes.buttonSecondary}`}>
            {field.fieldType === "text" && "نص قصير"}
            {field.fieldType === "textarea" && "نص طويل"}
            {field.fieldType === "number" && "رقم"}
            {field.fieldType === "email" && "بريد إلكتروني"}
            {field.fieldType === "phone" && "هاتف"}
            {field.fieldType === "date" && "تاريخ"}
            {field.fieldType === "time" && "وقت"}
            {field.fieldType === "select" && "قائمة اختيار"}
            {field.fieldType === "radio" && "اختيار واحد"}
            {field.fieldType === "checkbox" && "اختيارات متعددة"}
            {field.fieldType === "file" && "رفع ملف"}
            {field.fieldType === "rating" && "تقييم"}
            {field.fieldType === "slider" && "شريط انزلاق"}
          </span>

          {field.options && field.options.length > 0 && (
            <span className={classes.textMuted}>
              {field.options.length} خيارات
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove(index, "up");
          }}
          disabled={index === 0}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="تحريك للأعلى"
        >
          <ChevronUp size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove(index, "down");
          }}
          disabled={index === field.totalFields - 1}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="تحريك للأسفل"
        >
          <ChevronDown size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(index);
          }}
          className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
          title="تعديل"
        >
          <Edit size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(index);
          }}
          className="p-2 text-green-600 hover:text-green-700 transition-colors"
          title="نسخ"
        >
          <Copy size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
          className="p-2 text-red-600 hover:text-red-700 transition-colors"
          title="حذف"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// Validation Rules Component
const ValidationRules = ({ fieldType, validation, onChange }) => {
  const { classes } = useTheme();

  const handleValidationChange = useCallback(
    (key, value) => {
      onChange({
        ...validation,
        [key]: value,
      });
    },
    [validation, onChange]
  );

  if (fieldType === "text" || fieldType === "textarea") {
    return (
      <div className="mb-4">
        <label
          className={`block text-sm font-medium mb-2 ${classes.textPrimary}`}
        >
          قواعد التحقق من النص
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs mb-1 ${classes.textMuted}`}>
              أقل عدد أحرف
            </label>
            <input
              type="number"
              value={validation?.minLength || ""}
              onChange={(e) =>
                handleValidationChange("minLength", e.target.value)
              }
              placeholder="0"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${classes.input}`}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${classes.textMuted}`}>
              أكثر عدد أحرف
            </label>
            <input
              type="number"
              value={validation?.maxLength || ""}
              onChange={(e) =>
                handleValidationChange("maxLength", e.target.value)
              }
              placeholder="100"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${classes.input}`}
            />
          </div>
        </div>
      </div>
    );
  }

  if (fieldType === "number") {
    return (
      <div className="mb-4">
        <label
          className={`block text-sm font-medium mb-2 ${classes.textPrimary}`}
        >
          قواعد التحقق من الأرقام
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs mb-1 ${classes.textMuted}`}>
              أقل قيمة
            </label>
            <input
              type="number"
              value={validation?.min || ""}
              onChange={(e) => handleValidationChange("min", e.target.value)}
              placeholder="0"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${classes.input}`}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${classes.textMuted}`}>
              أكثر قيمة
            </label>
            <input
              type="number"
              value={validation?.max || ""}
              onChange={(e) => handleValidationChange("max", e.target.value)}
              placeholder="100"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${classes.input}`}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Field Type Selector Component
const FieldTypeSelector = ({ value, onChange }) => {
  const { classes } = useTheme();

  const fieldTypes = [
    { value: "text", label: "نص قصير", icon: "📝" },
    { value: "textarea", label: "نص طويل", icon: "📄" },
    { value: "number", label: "رقم", icon: "🔢" },
    { value: "email", label: "بريد إلكتروني", icon: "📧" },
    { value: "phone", label: "رقم هاتف", icon: "📱" },
    { value: "date", label: "تاريخ", icon: "📅" },
    { value: "time", label: "وقت", icon: "⏰" },
    { value: "select", label: "قائمة اختيار", icon: "📋" },
    { value: "radio", label: "اختيار واحد", icon: "⚪" },
    { value: "checkbox", label: "اختيارات متعددة", icon: "☑️" },
    { value: "file", label: "رفع ملف", icon: "📎" },
    { value: "rating", label: "تقييم", icon: "⭐" },
    { value: "slider", label: "شريط انزلاق", icon: "🎛️" },
  ];

  return (
    <div className="mb-4">
      <label
        className={`block text-sm font-medium mb-2 ${classes.textPrimary}`}
      >
        نوع الحقل
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer ${classes.input} pr-10`}
        >
          {fieldTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <ChevronDown className={`w-4 h-4 ${classes.textMuted}`} />
        </div>
      </div>
    </div>
  );
};

// Field Editor Modal Component
const FieldEditorModal = ({
  field,
  isEditing,
  onSave,
  onCancel,
  errors = {},
}) => {
  const { classes } = useTheme();
  const [localField, setLocalField] = useState(field);

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  const handleFieldChange = useCallback((key, value) => {
    setLocalField((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleValidationChange = useCallback((validation) => {
    setLocalField((prev) => ({ ...prev, validation }));
  }, []);

  const handleOptionsChange = useCallback((options) => {
    setLocalField((prev) => ({ ...prev, options }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(localField);
  }, [localField, onSave]);

  const needsOptions = ["select", "radio", "checkbox"].includes(
    localField.fieldType
  );

  return (
    <div className="fixed inset-0 flex items-start bg-black/50 justify-center z-50 p-4 overflow-y-auto">
      <div
        className={`rounded-xl p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto border shadow-2xl mt-4 ${classes.cardBg} ${classes.cardBorder}`}
      >
        <h4
          className={`text-xl font-semibold mb-6 flex items-center gap-3 ${classes.textPrimary}`}
        >
          {isEditing ? (
            <>
              <Edit className="text-blue-500" />
              تعديل الحقل
            </>
          ) : (
            <>
              <Plus className="text-green-500" />
              إضافة حقل جديد
            </>
          )}
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Field Configuration */}
          <div className="space-y-4">
            {/* Field Label */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${classes.textPrimary}`}
              >
                اسم الحقل *
              </label>
              <input
                type="text"
                value={localField.label || ""}
                onChange={(e) => handleFieldChange("label", e.target.value)}
                placeholder="مثال: الاسم الكامل، العمر، المهارات..."
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.label ? "border-red-500" : classes.input
                }`}
              />
              {errors.label && (
                <p className="text-red-400 text-xs mt-1">{errors.label}</p>
              )}
            </div>

            {/* Field Type */}
            <FieldTypeSelector
              value={localField.fieldType}
              onChange={(type) => handleFieldChange("fieldType", type)}
            />

            {/* Placeholder */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${classes.textPrimary}`}
              >
                النص التوضيحي
              </label>
              <input
                type="text"
                value={localField.placeholder || ""}
                onChange={(e) =>
                  handleFieldChange("placeholder", e.target.value)
                }
                placeholder="نص توضيحي يساعد المستخدم"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${classes.input}`}
              />
            </div>

            {/* Required Checkbox */}
            <div>
              <label
                className={`flex items-center gap-3 cursor-pointer group ${classes.textPrimary}`}
              >
                <input
                  type="checkbox"
                  checked={localField.required || false}
                  onChange={(e) =>
                    handleFieldChange("required", e.target.checked)
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="font-medium group-hover:text-blue-400 transition-colors">
                  حقل مطلوب
                </span>
              </label>
            </div>

            {/* Validation Rules */}
            <ValidationRules
              fieldType={localField.fieldType}
              validation={localField.validation || {}}
              onChange={handleValidationChange}
            />
          </div>

          {/* Right Column - Options or Preview */}
          <div>
            {needsOptions ? (
              <FieldOptionsEditor
                options={localField.options || []}
                onChange={handleOptionsChange}
              />
            ) : (
              <div
                className={`p-6 border-2 border-dashed rounded-lg ${classes.cardBorder}`}
              >
                <h5 className={`font-medium mb-4 ${classes.textPrimary}`}>
                  معاينة الحقل
                </h5>
                <FieldPreview field={localField} classes={classes} />
              </div>
            )}

            {errors.options && (
              <p className="text-red-400 text-xs mt-2">{errors.options}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-lg hover:shadow-blue-500/25"
          >
            {isEditing ? <Edit size={18} /> : <Plus size={18} />}
            {isEditing ? "تحديث الحقل" : "إضافة الحقل"}
          </button>
          <button
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg transition-colors ${classes.buttonSecondary}`}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

// Field Preview Component
const FieldPreview = ({ field, classes }) => {
  const renderField = () => {
    switch (field.fieldType) {
      case "text":
      case "email":
      case "phone":
        return (
          <input
            type={field.fieldType === "phone" ? "tel" : field.fieldType}
            placeholder={field.placeholder || `أدخل ${field.label}`}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${classes.input}`}
            disabled
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder || `أدخل ${field.label}`}
            className={`w-full px-3 py-2 border rounded-lg ${classes.input}`}
            rows="3"
            disabled
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder || "0"}
            min={field.validation?.min}
            max={field.validation?.max}
            className={`w-full px-3 py-2 border rounded-lg ${classes.input}`}
            disabled
          />
        );

      case "date":
      case "time":
        return (
          <input
            type={field.fieldType}
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
          </div>
        );

      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="text-2xl text-yellow-400 cursor-pointer"
              >
                ⭐
              </span>
            ))}
          </div>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              className="w-full"
              disabled
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{field.validation?.min || 0}</span>
              <span>{field.validation?.max || 100}</span>
            </div>
          </div>
        );

      default:
        return (
          <div
            className={`p-4 border rounded ${classes.cardBorder} ${classes.textMuted}`}
          >
            معاينة غير متوفرة
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${classes.textSecondary}`}>
        {field.label}
        {field.required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {field.description && (
        <p className={`text-xs ${classes.textMuted}`}>{field.description}</p>
      )}
      {renderField()}
    </div>
  );
};

// Custom Form Builder Component
const FormBuilder = ({ currentForm = [], onSave, onClose }) => {
  const { classes } = useTheme();
  const [formFields, setFormFields] = useState(currentForm);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  const { validateField } = useFormValidation();
  const { notification, showNotification } = useNotification();

  const initialField = useMemo(
    () => ({
      label: "",
      fieldType: "text",
      placeholder: "",
      required: false,
      options: [],
      order: 0,
      validation: {
        minLength: "",
        maxLength: "",
        min: "",
        max: "",
        pattern: "",
      },
    }),
    []
  );

  const [currentField, setCurrentField] = useState(initialField);

  const handleAddField = useCallback(() => {
    setCurrentField({ ...initialField, order: formFields.length });
    setEditingFieldIndex(null);
    setFieldErrors({});
    setShowFieldEditor(true);
  }, [formFields.length, initialField]);

  const handleEditField = useCallback(
    (index) => {
      setCurrentField({ ...formFields[index] });
      setEditingFieldIndex(index);
      setFieldErrors({});
      setShowFieldEditor(true);
    },
    [formFields]
  );

  const handleSaveField = useCallback(
    (field) => {
      const errors = validateField(field);

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      const processedField = {
        ...field,
        options: ["select", "radio", "checkbox"].includes(field.fieldType)
          ? (field.options || []).filter((opt) => opt.trim() !== "")
          : [],
      };
      if (editingFieldIndex !== null) {
        const updatedFields = [...formFields];
        updatedFields[editingFieldIndex] = processedField;
        setFormFields(updatedFields);
        showNotification("تم تحديث الحقل بنجاح", "success");
      } else {
        setFormFields((prev) => [...prev, processedField]);
        showNotification("تم إضافة الحقل بنجاح", "success");
      }

      setShowFieldEditor(false);
      setFieldErrors({});
    },
    [validateField, editingFieldIndex, formFields, showNotification]
  );

  const handleDeleteField = useCallback(
    (index) => {
      const newFields = formFields.filter((_, i) => i !== index);
      const reorderedFields = newFields.map((field, i) => ({
        ...field,
        order: i,
      }));
      setFormFields(reorderedFields);
      showNotification("تم حذف الحقل", "success");
    },
    [formFields, showNotification]
  );

  const handleMoveField = useCallback(
    (index, direction) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < formFields.length) {
        const newFields = [...formFields];
        [newFields[index], newFields[targetIndex]] = [
          newFields[targetIndex],
          newFields[index],
        ];
        const updatedFields = newFields.map((field, i) => ({
          ...field,
          order: i,
        }));
        setFormFields(updatedFields);
        showNotification("تم تغيير ترتيب الحقل", "success");
      }
    },
    [formFields, showNotification]
  );

  const handleDuplicateField = useCallback(
    (index) => {
      const fieldToDuplicate = { ...formFields[index] };
      fieldToDuplicate.label = `${fieldToDuplicate.label} - نسخة`;
      fieldToDuplicate.order = formFields.length;
      setFormFields((prev) => [...prev, fieldToDuplicate]);
      showNotification("تم نسخ الحقل", "success");
    },
    [formFields, showNotification]
  );

  // Drag and Drop handlers
  const handleDragStart = useCallback((e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== dropIndex) {
        const newFields = moveArrayItem(formFields, draggedIndex, dropIndex);
        const reorderedFields = newFields.map((field, i) => ({
          ...field,
          order: i,
        }));
        setFormFields(reorderedFields);
        showNotification("تم إعادة ترتيب الحقول", "success");
      }
      setDraggedIndex(null);
      setDraggedOverIndex(null);
    },
    [draggedIndex, formFields, showNotification]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  }, []);

  const handleSaveAll = useCallback(() => {
    if (!formTitle.trim()) {
      showNotification("يرجى إدخال عنوان النموذج", "error");
      return;
    }

    const newForm = {
      id: currentForm?.id || `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields: formFields,
      createdDate:
        currentForm?.createdDate || new Date().toLocaleDateString("ar-SA"),
      version: (currentForm?.version || 0) + 1,
    };

    onSave(newForm);
    showNotification("تم حفظ النموذج بنجاح", "success");
    setTimeout(() => onClose(), 1000);
  }, [
    formFields,
    formTitle,
    formDescription,
    currentForm,
    onSave,
    showNotification,
    onClose,
  ]);

  const handleCancelFieldEdit = useCallback(() => {
    setShowFieldEditor(false);
    setFieldErrors({});
    setCurrentField(initialField);
  }, [initialField]);

  // Initialize form data when editing existing form
  useEffect(() => {
    if (currentForm && currentForm.length > 0) {
      setFormFields(currentForm);
    } else if (currentForm && currentForm.fields) {
      setFormTitle(currentForm.title || "");
      setFormDescription(currentForm.description || "");
      setFormFields(currentForm.fields || []);
    }
  }, [currentForm]);

  return (
    <>
      <NotificationToast
        notification={notification}
        onClose={() => showNotification(null)}
      />

      <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 overflow-y-auto">
        <div
          className={`rounded-xl p-6 max-w-7xl w-full max-h-[95vh] overflow-y-auto ${classes.cardBg}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-2xl font-bold flex items-center gap-3 ${classes.textPrimary}`}
            >
              <Settings className="text-purple-500" />
              بناء النموذج المتقدم
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${classes.textMuted} hover:${classes.textSecondary}`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${classes.textPrimary}`}
              >
                عنوان النموذج *
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="مثال: استمارة المعلومات الطبية"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${classes.input}`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${classes.textPrimary}`}
              >
                وصف النموذج
              </label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="وصف مختصر لهدف النموذج..."
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${classes.input}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Form Fields Section */}
            <div className="xl:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h4 className={`text-lg font-semibold ${classes.textPrimary}`}>
                  حقول النموذج ({formFields.length})
                </h4>
                <button
                  onClick={handleAddField}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/25"
                >
                  <Plus size={16} />
                  إضافة حقل
                </button>
              </div>

              {formFields.length === 0 ? (
                <div
                  className={`text-center py-16 border-2 border-dashed rounded-xl ${classes.cardBorder}`}
                >
                  <div className="text-6xl mb-4">📝</div>
                  <h5
                    className={`text-xl font-medium mb-2 ${classes.textSecondary}`}
                  >
                    لم يتم إضافة حقول بعد
                  </h5>
                  <p className={`mb-6 ${classes.textMuted}`}>
                    ابدأ ببناء نموذجك المخصص بإضافة الحقول المناسبة
                  </p>
                  <button
                    onClick={handleAddField}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-all shadow-lg"
                  >
                    <Plus size={18} />
                    إضافة أول حقل
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {formFields.map((field, index) => (
                    <FieldListItem
                      key={`field-${index}-${field.label}`}
                      field={{ ...field, totalFields: formFields.length }}
                      index={index}
                      onEdit={handleEditField}
                      onDelete={handleDeleteField}
                      onMove={handleMoveField}
                      onDuplicate={handleDuplicateField}
                      isDragging={draggedIndex === index}
                      draggedOverIndex={draggedOverIndex}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Form Preview Section */}
            <div className="xl:col-span-1">
              <h4
                className={`text-lg font-semibold mb-4 ${classes.textPrimary}`}
              >
                معاينة النموذج
              </h4>
              <div
                className={`border rounded-xl p-6 max-h-96 overflow-y-auto ${classes.cardBorder} ${classes.cardBg}`}
              >
                {formTitle && (
                  <h5
                    className={`text-lg font-bold mb-2 ${classes.textPrimary}`}
                  >
                    {formTitle}
                  </h5>
                )}
                {formDescription && (
                  <p className={`text-sm mb-6 ${classes.textMuted}`}>
                    {formDescription}
                  </p>
                )}

                {formFields.length > 0 ? (
                  <div className="space-y-4">
                    {formFields.map((field, index) => (
                      <FieldPreview
                        key={index}
                        field={field}
                        classes={classes}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${classes.textMuted}`}>
                    <div className="text-3xl mb-2">👁️</div>
                    <p>ستظهر معاينة النموذج هنا</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save/Cancel Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
            <button
              onClick={handleSaveAll}
              disabled={!formTitle.trim() || formFields.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-lg hover:shadow-blue-500/25"
            >
              <Save size={18} />
              حفظ النموذج
            </button>
            <button
              onClick={handleSaveAll}
              disabled={!formTitle.trim() || formFields.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-lg hover:shadow-blue-500/25"
            >
              <Eye size={18} /> معاينة
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg transition-colors ${classes.buttonSecondary}`}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>

      {/* Field Editor Modal */}
      {showFieldEditor && (
        <FieldEditorModal
          field={currentField}
          isEditing={editingFieldIndex !== null}
          onSave={handleSaveField}
          onCancel={handleCancelFieldEdit}
          errors={fieldErrors}
        />
      )}
    </>
  );
};

export default function AdvancedFormManager() {
  const { classes, darkMode } = useTheme();
  // Main States
  const [forms, setForms] = useState([]);
    const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [currentForm, setCurrentForm] = useState([]);
  const customForms = useCustomFormStore((s) => s.customForms);
  const setCustomForms = useCustomFormStore((s) => s.setCustomForms);

  useEffect(() => {
    console.log("Custom Forms Updated:", customForms);
    setForms(customForms);
  }, [customForms]);


  // Main Functions For Existing Forms
  const deleteForm = (formId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا النموذج؟")) {
      const updatedForms = forms.filter((form) => form.id !== formId);
      setForms(updatedForms);
      setCustomForms(updatedForms);
      showNotification("تم حذف النموذج", "success");
    }
  };
  const duplicateForm = (form) => {
    const duplicatedForm = {
      ...form,
      id: `form_${Date.now()}`,
      title: form.title + " (نسخة)",
      createdDate: new Date().toLocaleDateString("ar-SA"),
      version: 1,
    };

    console.log("Duplicated Form:", duplicatedForm);
    const updatedForms = [...forms, duplicatedForm];
      setForms(updatedForms);
      setCustomForms(updatedForms);
      showNotification("تم نسخ النموذج", "success");
  };
  const editForm = (form) => {
    setCurrentForm(form);
    setFormTitle(form.title);
    setFormDescription(form.description);
    setFormFields([...form.fields]);
    setShowFormBuilder(true);
  };
  
  const saveForms = (updatedForm) => {
    try {
      setForms([...forms, updatedForm]);
      setCustomForms([...forms, updatedForm]);
    } catch (error) {
      console.error("Error saving forms:", error);
      showNotification("خطأ في حفظ النماذج", "error");
    }
  };

  // Some Features About Data
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

  return (
    <>
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

      <div className={`rounded-xl shadow-lg p-6 ${classes.cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms?.map((form) => (
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

      {showFormBuilder && (
        <FormBuilder
          currentForm={currentForm}
          onSave={saveForms}
          onClose={() => setShowFormBuilder(false)}
        />
      )}
    </>
  );
};

