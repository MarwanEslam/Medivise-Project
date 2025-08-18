import React, { useState, useEffect } from "react";
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
  Check
} from "lucide-react";

import {useTheme} from "../ThemeContext";

// مكونات إضافية للنموذج
const FieldTypeSelector = ({ value, onChange, classes }) => {
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
    { value: "slider", label: "شريط انزلاق", icon: "🎛️" }
  ];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none cursor-pointer ${classes.input} pr-10`}
      >
        {fieldTypes.map(type => (
          <option key={type.value} value={type.value}>
            {type.icon} {type.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className={`w-4 h-4 ${classes.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// مكون حقل النموذج العائم
const FloatingFieldEditor = ({ field, index, onUpdate, onRemove, onMoveUp, onMoveDown, onDuplicate, canMoveUp, canMoveDown, classes }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localField, setLocalField] = useState(field);
  
  // حفظ التغييرات عند تغيير القيم
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate(field.id, localField);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localField, field.id, onUpdate]);

  const updateLocalField = (updates) => {
    setLocalField(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className={`relative border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${classes.cardBorder} ${classes.cardBg} overflow-hidden`}>
      {/* شريط علوي ملون */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      
      {/* رأس الحقل */}
      <div className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1 rounded-full transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/20`}
            >
              {isExpanded ? 
                <ChevronUp className="h-4 w-4 text-blue-600" /> : 
                <ChevronDown className="h-4 w-4 text-blue-600" />
              }
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                {index + 1}
              </span>
              <h4 className={`font-medium ${classes.textPrimary}`}>
                {localField.label || `حقل ${index + 1}`}
              </h4>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                {localField.type}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* أزرار التحكم */}
            <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
              <button
                onClick={() => onMoveUp(field.id)}
                disabled={!canMoveUp}
                className={`p-1.5 rounded transition-colors duration-200 ${
                  !canMoveUp 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600'
                }`}
                title="تحريك لأعلى"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onMoveDown(field.id)}
                disabled={!canMoveDown}
                className={`p-1.5 rounded transition-colors duration-200 ${
                  !canMoveDown 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600'
                }`}
                title="تحريك لأسفل"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onDuplicate(field.id)}
                className="p-1.5 rounded transition-colors duration-200 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600"
                title="نسخ الحقل"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onRemove(field.id)}
                className="p-1.5 rounded transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                title="حذف الحقل"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الحقل القابل للطي */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 space-y-4">
          {/* الصف الأول: اسم الحقل ونوعه */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-2 ${classes.textMuted}`}>
                نص الحقل *
              </label>
              <input
                type="text"
                value={localField.label}
                onChange={(e) => updateLocalField({ label: e.target.value })}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${classes.input}`}
                placeholder="أدخل نص الحقل"
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 ${classes.textMuted}`}>
                نوع الحقل
              </label>
              <FieldTypeSelector
                value={localField.type}
                onChange={(type) => updateLocalField({ type })}
                classes={classes}
              />
            </div>
          </div>

          {/* الصف الثاني: النص المساعد والوصف */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-2 ${classes.textMuted}`}>
                النص المساعد
              </label>
              <input
                type="text"
                value={localField.placeholder || ''}
                onChange={(e) => updateLocalField({ placeholder: e.target.value })}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${classes.input}`}
                placeholder="نص يظهر داخل الحقل"
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 ${classes.textMuted}`}>
                الوصف التوضيحي
              </label>
              <input
                type="text"
                value={localField.description || ''}
                onChange={(e) => updateLocalField({ description: e.target.value })}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${classes.input}`}
                placeholder="وصف يساعد المستخدم"
              />
            </div>
          </div>

          {/* إعدادات إضافية */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localField.required}
                onChange={(e) => updateLocalField({ required: e.target.checked })}
                className="ml-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className={`text-sm font-medium ${classes.textSecondary}`}>
                حقل مطلوب
              </span>
            </label>

            {localField.required && (
              <div className="flex items-center text-xs text-red-600">
                <span className="mr-1">*</span>
                <span>سيظهر للمستخدم كحقل إجباري</span>
              </div>
            )}
          </div>

          {/* خيارات إضافية حسب نوع الحقل */}
          {(localField.type === 'select' || localField.type === 'radio' || localField.type === 'checkbox') && (
            <div>
              <label className={`block text-xs font-medium mb-2 ${classes.textMuted}`}>
                الخيارات المتاحة
              </label>
              <textarea
                value={localField.options?.join('\n') || ''}
                onChange={(e) => updateLocalField({
                  options: e.target.value
                    .split('\n')
                    .map(opt => opt.trim())
                    .filter(opt => opt)
                })}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${classes.input}`}
                rows="4"
                placeholder="أدخل كل خيار في سطر منفصل&#10;مثال:&#10;خيار أول&#10;خيار ثاني&#10;خيار ثالث"
              />
              <p className={`text-xs mt-1 ${classes.textMuted}`}>
                أدخل كل خيار في سطر منفصل
              </p>
            </div>
          )}

          {(localField.type === 'number' || localField.type === 'slider') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-2 ${classes.textMuted}`}>
                  الحد الأدنى
                </label>
                <input
                  type="number"
                  value={localField.min || ''}
                  onChange={(e) => updateLocalField({ min: e.target.value })}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${classes.input}`}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-2 ${classes.textMuted}`}>
                  الحد الأقصى
                </label>
                <input
                  type="number"
                  value={localField.max || ''}
                  onChange={(e) => updateLocalField({ max: e.target.value })}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${classes.input}`}
                  placeholder="100"
                />
              </div>
            </div>
          )}

          {localField.type === 'file' && (
            <div>
              <label className={`block text-xs font-medium mb-2 ${classes.textMuted}`}>
                أنواع الملفات المسموحة
              </label>
              <input
                type="text"
                value={localField.acceptedTypes || ''}
                onChange={(e) => updateLocalField({ acceptedTypes: e.target.value })}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${classes.input}`}
                placeholder=".pdf, .doc, .docx, .jpg, .png"
              />
              <p className={`text-xs mt-1 ${classes.textMuted}`}>
                مثال: .pdf, .doc, .jpg أو اتركه فارغاً للسماح بجميع الأنواع
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// معاينة الحقل
const FieldPreview = ({ field, classes }) => {
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <input
            type={field.type}
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
          <select className={`w-full px-3 py-2 border rounded-lg ${classes.input}`} disabled>
            <option>اختر {field.label}</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
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
          <div className={`w-full px-3 py-8 border-2 border-dashed rounded-lg text-center ${classes.cardBorder} ${classes.textMuted}`}>
            <Upload className="mx-auto h-8 w-8 mb-2" />
            <p>اسحب الملفات هنا أو انقر للتحديد</p>
          </div>
        );
      
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1,2,3,4,5].map(star => (
              <span key={star} className="text-2xl text-yellow-400 cursor-pointer">⭐</span>
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
        return <div className={`p-4 border rounded ${classes.cardBorder} ${classes.textMuted}`}>معاينة غير متوفرة</div>;
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

// المكون الرئيسي
const AdvancedFormManager = () => {
  const { classes, darkMode } = useTheme();
  
  // الحالات الأساسية
  const [forms, setForms] = useState([]);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [activeTab, setActiveTab] = useState("forms");
  
  // حالات منشئ النماذج
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState(null);

  // تحميل النماذج المحفوظة عند بدء التشغيل
  useEffect(() => {
    loadForms();
  }, []);

  // وظائف إدارة التخزين
  const loadForms = () => {
    try {
      const savedForms = JSON.parse(sessionStorage.getItem('medicalForms') || '[]');
      setForms(savedForms);
    } catch (error) {
      console.error('Error loading forms:', error);
      showNotification('خطأ في تحميل النماذج', 'error');
    }
  };

  const saveForms = (updatedForms) => {
    try {
      sessionStorage.setItem('medicalForms', JSON.stringify(updatedForms));
      setForms(updatedForms);
    } catch (error) {
      console.error('Error saving forms:', error);
      showNotification('خطأ في حفظ النماذج', 'error');
    }
  };

  // وظائف الإشعارات
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // وظائف إدارة الحقول
  const generateFieldId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = () => {
    const newField = {
      id: generateFieldId(),
      type: 'text',
      label: `حقل جديد ${formFields.length + 1}`,
      placeholder: '',
      description: '',
      required: false,
      options: [],
      validation: {},
      order: formFields.length
    };
    setFormFields([...formFields, newField]);
    showNotification('تم إضافة حقل جديد', 'success');
  };

  const updateField = (fieldId, updates) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const removeField = (fieldId) => {
    setFormFields(formFields.filter(field => field.id !== fieldId));
    showNotification('تم حذف الحقل', 'success');
  };

  const moveField = (fieldId, direction) => {
    const fieldIndex = formFields.findIndex(field => field.id === fieldId);
    if (
      (direction === 'up' && fieldIndex === 0) ||
      (direction === 'down' && fieldIndex === formFields.length - 1)
    ) return;

    const newFields = [...formFields];
    const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    [newFields[fieldIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[fieldIndex]];
    
    setFormFields(newFields);
  };

  const duplicateField = (fieldId) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field) {
      const duplicatedField = {
        ...field,
        id: generateFieldId(),
        label: field.label + ' (نسخة)',
        order: formFields.length
      };
      setFormFields([...formFields, duplicatedField]);
      showNotification('تم نسخ الحقل', 'success');
    }
  };

  // وظائف إدارة النماذج
  const saveForm = () => {
    if (!formTitle.trim()) {
      showNotification('يرجى إدخال عنوان النموذج', 'error');
      return;
    }

    if (formFields.length === 0) {
      showNotification('يرجى إضافة حقل واحد على الأقل', 'error');
      return;
    }

    const formData = {
      id: currentForm?.id || `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields: formFields,
      createdDate: currentForm?.createdDate || new Date().toLocaleDateString('ar-SA'),
      modifiedDate: new Date().toLocaleDateString('ar-SA'),
      version: (currentForm?.version || 0) + 1
    };

    const updatedForms = currentForm 
      ? forms.map(form => form.id === currentForm.id ? formData : form)
      : [...forms, formData];

    saveForms(updatedForms);
    showNotification(currentForm ? 'تم تحديث النموذج بنجاح' : 'تم حفظ النموذج بنجاح', 'success');
    resetFormBuilder();
  };

  const editForm = (form) => {
    setCurrentForm(form);
    setFormTitle(form.title);
    setFormDescription(form.description);
    setFormFields([...form.fields]);
    setShowFormBuilder(true);
  };

  const deleteForm = (formId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا النموذج؟')) {
      const updatedForms = forms.filter(form => form.id !== formId);
      saveForms(updatedForms);
      showNotification('تم حذف النموذج', 'success');
    }
  };

  const duplicateForm = (form) => {
    const duplicatedForm = {
      ...form,
      id: `form_${Date.now()}`,
      title: form.title + ' (نسخة)',
      createdDate: new Date().toLocaleDateString('ar-SA'),
      version: 1
    };
    
    const updatedForms = [...forms, duplicatedForm];
    saveForms(updatedForms);
    showNotification('تم نسخ النموذج', 'success');
  };

  const resetFormBuilder = () => {
    setCurrentForm(null);
    setFormTitle("");
    setFormDescription("");
    setFormFields([]);
    setShowFormBuilder(false);
    setShowPreview(false);
  };

  // تصدير واستيراد النماذج
  const exportForms = () => {
    const dataStr = JSON.stringify(forms, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `medical_forms_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('تم تصدير النماذج', 'success');
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
            showNotification('تم استيراد النماذج بنجاح', 'success');
          } else {
            showNotification('صيغة الملف غير صحيحة', 'error');
          }
        } catch (error) {
          showNotification('خطأ في قراءة الملف', 'error');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* الإشعارات */}
      {notification && (
        <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg border flex items-center space-x-2 ${
          notification.type === 'success' ? classes.success : 
          notification.type === 'error' ? classes.error : classes.warning
        }`}>
          <div className="flex-1 flex items-center space-x-2">
            {notification.type === 'success' && <Check className="h-5 w-5" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
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
                    <h3 className={`text-lg font-semibold ${classes.textPrimary}`}>
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
                <h3 className={`text-xl font-medium mb-2 ${classes.textSecondary}`}>
                  لا توجد نماذج بعد
                </h3>
                <p className={classes.textMuted}>
                  أنشئ أول نموذج طبي لك الآن
                </p>
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

          <div className={showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : ""}>
            {/* محرر النموذج */}
            <div className="space-y-6">
              {/* معلومات النموذج الأساسية */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}>
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
                  <label className={`block text-sm font-medium mb-2 ${classes.textSecondary}`}>
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
                  <label className={`block text-sm font-medium ${classes.textSecondary}`}>
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
                    className={`border rounded-lg p-4 mb-4 transition-colors duration-300 ${classes.cardBorder} ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-sm font-medium ${classes.textSecondary}`}>
                          حقل {index + 1}
                        </h4>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => moveField(field.id, 'up')}
                            disabled={index === 0}
                            className={`p-1 ${index === 0 ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'} rounded`}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => moveField(field.id, 'down')}
                            disabled={index === formFields.length - 1}
                            className={`p-1 ${index === formFields.length - 1 ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'} rounded`}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => duplicateField(field.id)}
                          className={`p-1 transition-colors duration-200 ${classes.textSecondary} hover:${classes.textPrimary}`}
                          title="نسخ الحقل"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeField(field.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="حذف الحقل"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-xs mb-1 ${classes.textMuted}`}>
                          نص الحقل *
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${classes.input}`}
                          placeholder="نص الحقل"
                        />
                      </div>

                      <div>
                        <label className={`block text-xs mb-1 ${classes.textMuted}`}>
                          نوع الحقل
                        </label>
                        <FieldTypeSelector
                          value={field.type}
                          onChange={(type) => updateField(field.id, { type })}
                          classes={classes}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-xs mb-1 ${classes.textMuted}`}>
                          نص المساعدة
                        </label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${classes.input}`}
                          placeholder="نص المساعدة للحقل"
                        />
                      </div>

                      <div>
                        <label className={`block text-xs mb-1 ${classes.textMuted}`}>
                          الوصف
                        </label>
                        <input
                          type="text"
                          value={field.description || ''}
                          onChange={(e) => updateField(field.id, { description: e.target.value })}
                          className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${classes.input}`}
                          placeholder="وصف الحقل"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="ml-2"
                        />
                        <span className={`text-xs ${classes.textMuted}`}>مطلوب</span>
                      </label>
                    </div>

                    {/* خيارات إضافية حسب نوع الحقل */}
                    {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                      <div className="mb-4">
                        <label className={`block text-xs mb-1 ${classes.textMuted}`}>
                          الخيارات (مفصولة بفاصلة)
                        </label>
                        <input
                          type="text"
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => updateField(field.id, {
                            options: e.target.value
                              .split(',')
                              .map(opt => opt.trim())
                              .filter(opt => opt)
                          })}
                          className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${classes.input}`}
                          placeholder="خيار 1, خيار 2, خيار 3"
                        />
                      </div>
                    )}

                    {(field.type === 'number' || field.type === 'slider') && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className={`block text-xs mb-1 ${classes.textMuted}`}>
                            الحد الأدنى
                          </label>
                          <input
                            type="number"
                            value={field.min || ''}
                            onChange={(e) => updateField(field.id, { min: e.target.value })}
                            className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${classes.input}`}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${classes.textMuted}`}>
                            الحد الأقصى
                          </label>
                          <input
                            type="number"
                            value={field.max || ''}
                            onChange={(e) => updateField(field.id, { max: e.target.value })}
                            className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${classes.input}`}
                            placeholder="100"
                          />
                        </div>
                      </div>
                    )}

                    {field.type === 'file' && (
                      <div className="mb-4">
                        <label className={`block text-xs mb-1 ${classes.textMuted}`}>
                          أنواع الملفات المسموحة
                        </label>
                        <input
                          type="text"
                          value={field.acceptedTypes || ''}
                          onChange={(e) => updateField(field.id, { acceptedTypes: e.target.value })}
                          className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${classes.input}`}
                          placeholder=".pdf,.doc,.jpg"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {formFields.length === 0 && (
                  <div className={`text-center py-8 border-2 border-dashed rounded-lg ${classes.cardBorder}`}>
                    <div className={`text-4xl mb-2 ${classes.textMuted}`}>📝</div>
                    <p className={classes.textMuted}>لم يتم إضافة أي حقول بعد</p>
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
                      ? 'bg-gray-400 cursor-not-allowed'
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
                <div className={`border rounded-lg p-6 ${classes.cardBorder} ${classes.cardBg}`}>
                  <div className="mb-6">
                    <h3 className={`text-xl font-bold ${classes.textPrimary} mb-2`}>
                      معاينة النموذج
                    </h3>
                    <div className="w-full h-px bg-gradient-to-r from-blue-500 to-purple-500 mb-4"></div>
                  </div>

                  {formTitle && (
                    <div className="mb-6">
                      <h4 className={`text-lg font-semibold ${classes.textPrimary}`}>
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
                        <FieldPreview field={field} classes={classes} />
                        {index < formFields.length - 1 && (
                          <div className={`my-4 border-t ${classes.cardBorder}`}></div>
                        )}
                      </div>
                    ))}

                    {formFields.length === 0 && (
                      <div className="text-center py-8">
                        <div className={`text-4xl mb-2 ${classes.textMuted}`}>👀</div>
                        <p className={classes.textMuted}>
                          أضف بعض الحقول لرؤية المعاينة
                        </p>
                      </div>
                    )}

                    {formFields.length > 0 && (
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button className={`w-full py-3 rounded-lg ${classes.buttonPrimary} font-medium`}>
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

export default AdvancedFormManager;
