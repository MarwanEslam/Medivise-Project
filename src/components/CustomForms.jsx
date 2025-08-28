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

import { useTheme } from "../ThemeContext";
import useCustomFormStore from "../store/useCustomFormStore";
export default function CustomForms() {
  const { classes } = useTheme();
  const customForms = useCustomFormStore((s) => s.customForms);
  const formData = useCustomFormStore((s) => s.formData);
  const setFormData = useCustomFormStore((s) => s.setFormData);
  const selectedDay = useCustomFormStore((s) => s.selectedDay);
  const selectedForm = useCustomFormStore((s) => s.selectedForm);
  const setShowFormModal = useCustomFormStore((s) => s.setShowFormModal);
  const showFormModal = useCustomFormStore((s) => s.showFormModal);
  const savedData = useCustomFormStore((s) => s.savedData);
    const setSavedData = useCustomFormStore((s) => s.setSavedData);
    


  const renderFormField = (field) => {
    const inputClasses = `w-full p-3 border rounded-lg ${classes.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

    switch (field.fieldType) {
      case "select":
        return (
          <CustomSelect>
            <select
              key={field.label}
              className={inputClasses}
              value={formData[field.label] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.label]: e.target.value,
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
            key={field.label}
            className={`${inputClasses} h-24 resize-none`}
            placeholder={field.label}
            value={formData[field.label] || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.label]: e.target.value }))
            }
            required
          />
        );
      case "number":
        return (
          <input
            key={field.label}
            type="number"
            className={inputClasses}
            placeholder={field.label}
            value={formData[field.label] || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.label]: e.target.value }))
            }
            required
          />
        );
      case "time":
        return (
          <input
            key={field.label}
            type="time"
            className={inputClasses}
            value={formData[field.label] || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.label]: e.target.value }))
            }
            required
          />
        );
      default:
        return (
          <input
            key={field.label}
            type="text"
            className={inputClasses}
            placeholder={field.label}
            value={formData[field.label] || ""}
                onChange={(e) => {
                    setFormData((prev) => ({ ...prev, [field.label]: e.target.value }))
            }
            }
            required
          />
        );
    }
  };

  const handleFormSubmit = (e) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`${classes.cardBg} rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${classes.textPrimary}`}>
              {customForms.find((f) => f.id === selectedForm)?.title} -{" "}
              {selectedDay?.toLocaleDateString("ar-EG")}
            </h3>
            <button
              onClick={() => setShowFormModal(false)}
              className={`${classes.buttonSecondary} p-2 rounded-lg transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {customForms
              .find((f) => f.id === selectedForm)
              ?.fields.map((field) => (
                <div key={field.label}>
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
              onClick={handleFormSubmit}
            >
              <Save className="w-5 h-5" />
              حفظ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
