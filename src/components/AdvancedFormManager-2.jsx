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
import EnhancedFormBuilder from "./EnhancedFormBuilder";



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

export default function AdvancedFormManager() {
  const { classes, darkMode } = useTheme();
  // Main States
  const setShowFormBuilder = useCustomFormStore((s) => s.setShowFormBuilder);
  const showFormBuilder = useCustomFormStore((s) => s.showFormBuilder);
  const currentForm = useCustomFormStore((s) => s.currentForm);
  const setCurrentForm = useCustomFormStore((s) => s.setCurrentForm);
  const customForms = useCustomFormStore((s) => s.customForms);
  const setCustomForms = useCustomFormStore((s) => s.setCustomForms);
  const { notification, showNotification } = useNotification();

  useEffect(() => {
  setShowFormBuilder(false);
}, [])

  // Main Functions For Existing Forms
  const deleteForm = (formId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا النموذج؟")) {
      const updatedForms = customForms.filter((form) => form.id !== formId);
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
    const updatedForms = [...customForms, duplicatedForm];
    setCustomForms(updatedForms);
    showNotification("تم نسخ النموذج", "success");
  };
  
  const editForm = (form) => {
    setCurrentForm(form);
    setShowFormBuilder(true);
    console.log("Edited Form:", form);  
  };

  const saveForms = (updatedForm) => {
    try {
      setCustomForms([...customForms, updatedForm]);
    } catch (error) {
      console.error("Error saving forms:", error);
      showNotification("خطأ في حفظ النماذج", "error");
    }
  };

  // Some Features About Data
  const exportForms = () => {
    const dataStr = JSON.stringify(customForms, null, 2);
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
            saveForms([...customForms, ...importedForms]);
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
        <div className="flex flex-wrap gap-5 justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${classes.textPrimary}`}>
              إدارة النماذج الطبية
            </h1>
            {/* <p className={`mt-2 ${classes.textSecondary}`}>
              أنشئ وخصص النماذج الطبية بسهولة تامة
            </p> */}
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
                disabled={customForms.length === 0}
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

      {!showFormBuilder && (
        <div className={`rounded-xl shadow-lg p-6 ${classes.cardBg}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customForms?.map((form) => (
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

            {customForms.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className={`text-6xl mb-4 ${classes.textMuted}`}>📋</div>
                <h3
                  className={`text-xl font-medium mb-2 ${classes.textSecondary}`}
                >
                  لا توجد نماذج بعد
                </h3>
                {/* <p className={classes.textMuted}>أنشئ أول نموذج طبي لك الآن</p> */}
              </div>
            )}
          </div>
        </div>
      )}

      {showFormBuilder && <EnhancedFormBuilder />}
    </>
  );
}
