import React, { useState, useContext, createContext } from "react";
import {
  Users,
  FileText,
  BarChart3,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  MapPin,
  Activity,
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "../ThemeContext";

const DoctorDashboard = () => {
  const { classes, darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      age: 35,
      type: "مريض",
      gender: "ذكر",
      governorate: "القاهرة",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "فاطمة علي",
      age: 28,
      type: "رياضي",
      gender: "أنثى",
      governorate: "الإسكندرية",
      joinDate: "2024-02-01",
    },
    {
      id: 3,
      name: "محمود حسن",
      age: 42,
      type: "مريض",
      gender: "ذكر",
      governorate: "الجيزة",
      joinDate: "2024-01-20",
    },
    {
      id: 4,
      name: "نور السيد",
      age: 25,
      type: "رياضي",
      gender: "أنثى",
      governorate: "القاهرة",
      joinDate: "2024-02-10",
    },
  ]);

  const [forms, setForms] = useState([
    {
      id: 1,
      title: "تقييم النظام الغذائي اليومي",
      description: "تقييم الوجبات والعادات الغذائية اليومية",
      fields: [
        { id: 1, type: "text", label: "وجبة الإفطار", required: true },
        { id: 2, type: "text", label: "وجبة الغداء", required: true },
        { id: 3, type: "text", label: "وجبة العشاء", required: true },
        { id: 4, type: "number", label: "عدد أكواب الماء", required: true },
        {
          id: 5,
          type: "select",
          label: "مستوى النشاط البدني",
          options: ["قليل", "متوسط", "عالي"],
          required: true,
        },
      ],
      createdDate: "2024-01-10",
    },
    {
      id: 2,
      title: "متابعة الوزن والقياسات",
      description: "تسجيل الوزن والقياسات الجسمية",
      fields: [
        { id: 1, type: "number", label: "الوزن (كيلو)", required: true },
        { id: 2, type: "number", label: "محيط الخصر (سم)", required: false },
        { id: 3, type: "number", label: "محيط الصدر (سم)", required: false },
        { id: 4, type: "textarea", label: "ملاحظات إضافية", required: false },
      ],
      createdDate: "2024-01-15",
    },
  ]);

  const [responses, setResponses] = useState([
    {
      id: 1,
      userId: 1,
      userName: "أحمد محمد",
      formId: 1,
      formTitle: "تقييم النظام الغذائي اليومي",
      responses: {
        "وجبة الإفطار": "فول وطحينة وخبز",
        "وجبة الغداء": "أرز وفراخ وسلطة",
        "وجبة العشاء": "زبادي وفاكهة",
        "عدد أكواب الماء": "6",
        "مستوى النشاط البدني": "متوسط",
      },
      submittedDate: "2024-02-15",
    },
    {
      id: 2,
      userId: 2,
      userName: "فاطمة علي",
      formId: 1,
      formTitle: "تقييم النظام الغذائي اليومي",
      responses: {
        "وجبة الإفطار": "شوفان وفواكه",
        "وجبة الغداء": "سلطة دجاج وخضار",
        "وجبة العشاء": "سمك مشوي وخضار",
        "عدد أكواب الماء": "8",
        "مستوى النشاط البدني": "عالي",
      },
      submittedDate: "2024-02-14",
    },
  ]);

  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form Builder State
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState([]);

  const resetFormBuilder = () => {
    setFormTitle("");
    setFormDescription("");
    setFormFields([]);
    setCurrentForm(null);
  };

  const addField = () => {
    const newField = {
      id: Date.now(),
      type: "text",
      label: "",
      required: false,
      options: [],
    };
    setFormFields([...formFields, newField]);
  };

  const updateField = (fieldId, updates) => {
    setFormFields(
      formFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (fieldId) => {
    setFormFields(formFields.filter((field) => field.id !== fieldId));
  };

  const saveForm = () => {
    if (!formTitle.trim() || formFields.length === 0) {
      alert("يرجى إدخال عنوان النموذج وإضافة حقل واحد على الأقل");
      return;
    }

    const newForm = {
      id: currentForm ? currentForm.id : Date.now(),
      title: formTitle,
      description: formDescription,
      fields: formFields,
      createdDate: currentForm
        ? currentForm.createdDate
        : new Date().toISOString().split("T")[0],
    };

    if (currentForm) {
      setForms(
        forms.map((form) => (form.id === currentForm.id ? newForm : form))
      );
    } else {
      setForms([...forms, newForm]);
    }

    setShowFormBuilder(false);
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
    if (window.confirm("هل أنت متأكد من حذف هذا النموذج؟")) {
      setForms(forms.filter((form) => form.id !== formId));
      setResponses(responses.filter((response) => response.formId !== formId));
    }
  };

  // Statistics
  const totalUsers = users.length;
  const patientsCount = users.filter((u) => u.type === "مريض").length;
  const athletesCount = users.filter((u) => u.type === "رياضي").length;
  const totalForms = forms.length;
  const totalResponses = responses.length;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${classes.background} ${classes.textPrimary}`}
      dir="rtl"
    >
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className={`rounded-xl shadow-lg p-6 border transition-colors duration-300 ${classes.cardBg} ${classes.cardBorder}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${classes.textSecondary}`}>
                  إجمالي المستخدمين
                </p>
                <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div
            className={`rounded-xl shadow-lg p-6 border transition-colors duration-300 ${classes.cardBg} ${classes.cardBorder}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${classes.textSecondary}`}>
                  المرضى
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {patientsCount}
                </p>
              </div>
              <User className="h-10 w-10 text-red-500" />
            </div>
          </div>

          <div
            className={`rounded-xl shadow-lg p-6 border transition-colors duration-300 ${classes.cardBg} ${classes.cardBorder}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${classes.textSecondary}`}>
                  الرياضيين
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {athletesCount}
                </p>
              </div>
              <Activity className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div
            className={`rounded-xl shadow-lg p-6 border transition-colors duration-300 ${classes.cardBg} ${classes.cardBorder}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${classes.textSecondary}`}>
                  النماذج
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {totalForms}
                </p>
              </div>
              <FileText className="h-10 w-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`rounded-xl shadow-lg mb-6 transition-colors duration-300 ${classes.cardBg}`}
        >
          <div
            className={`border-b transition-colors duration-300 ${classes.cardBorder}`}
          >
            <nav className="flex">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : `border-transparent ${classes.tabs}`
                }`}
              >
                <Users className="inline-block ml-2 h-5 w-5" />
                المستخدمين
              </button>
              <button
                onClick={() => setActiveTab("forms")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === "forms"
                    ? "border-blue-500 text-blue-600"
                    : `border-transparent ${classes.tabs}`
                }`}
              >
                <FileText className="inline-block ml-2 h-5 w-5" />
                النماذج
              </button>
              <button
                onClick={() => setActiveTab("responses")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === "responses"
                    ? "border-blue-500 text-blue-600"
                    : `border-transparent ${classes.tabs}`
                }`}
              >
                <BarChart3 className="inline-block ml-2 h-5 w-5" />
                الاستجابات
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "users" && (
          <div
            className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              قائمة المستخدمين
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <tr>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      الاسم
                    </th>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      السن
                    </th>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      النوع
                    </th>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      الجنس
                    </th>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      المحافظة
                    </th>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      تاريخ الانضمام
                    </th>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-800 divide-gray-700"
                      : "bg-white divide-gray-200"
                  }`}
                >
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className={`transition-colors duration-200 ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }`}
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user.name}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {user.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.type === "مريض"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.type}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {user.gender}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        <MapPin className="inline-block ml-1 h-4 w-4" />
                        {user.governorate}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className={`ml-3 transition-colors duration-200 ${
                            darkMode
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-900"
                          }`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "forms" && (
          <div className="space-y-6">
            {!showFormBuilder && (
              <div
                className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    النماذج المتاحة
                  </h2>
                  <button
                    onClick={() => setShowFormBuilder(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  >
                    <PlusCircle className="ml-2 h-5 w-5" />
                    إنشاء نموذج جديد
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className={`border rounded-lg p-6 hover:shadow-md transition-all duration-300 ${
                        darkMode
                          ? "border-gray-700 bg-gray-750 hover:bg-gray-700"
                          : "border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3
                            className={`text-lg font-semibold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {form.title}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {form.description}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editForm(form)}
                            className={`p-1 transition-colors duration-200 ${
                              darkMode
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteForm(form.id)}
                            className={`p-1 transition-colors duration-200 ${
                              darkMode
                                ? "text-red-400 hover:text-red-300"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div
                        className={`text-sm mb-4 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Calendar className="inline-block ml-1 h-4 w-4" />
                        تم الإنشاء في: {form.createdDate}
                      </div>
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        عدد الحقول: {form.fields.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Builder */}
            {showFormBuilder && (
              <div
                className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentForm ? "تعديل النموذج" : "إنشاء نموذج جديد"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowFormBuilder(false);
                      resetFormBuilder();
                    }}
                    className={`transition-colors duration-200 ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    إلغاء
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      عنوان النموذج
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="أدخل عنوان النموذج"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      وصف النموذج
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      rows="3"
                      placeholder="أدخل وصف النموذج"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        حقول النموذج
                      </label>
                      <button
                        onClick={addField}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      >
                        إضافة حقل
                      </button>
                    </div>

                    {formFields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`border rounded-lg p-4 mb-4 transition-colors duration-300 ${
                          darkMode
                            ? "border-gray-700 bg-gray-700"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4
                            className={`text-sm font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            حقل {index + 1}
                          </h4>
                          <button
                            onClick={() => removeField(field.id)}
                            className={`transition-colors duration-200 ${
                              darkMode
                                ? "text-red-400 hover:text-red-300"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label
                              className={`block text-xs mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              نص الحقل
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) =>
                                updateField(field.id, { label: e.target.value })
                              }
                              className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                              placeholder="نص الحقل"
                            />
                          </div>

                          <div>
                            <label
                              className={`block text-xs mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              نوع الحقل
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) =>
                                updateField(field.id, { type: e.target.value })
                              }
                              className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                            >
                              <option value="text">نص</option>
                              <option value="number">رقم</option>
                              <option value="textarea">نص طويل</option>
                              <option value="select">قائمة اختيار</option>
                              <option value="checkbox">مربع اختيار</option>
                            </select>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) =>
                                updateField(field.id, {
                                  required: e.target.checked,
                                })
                              }
                              className="ml-2"
                            />
                            <label
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              مطلوب
                            </label>
                          </div>
                        </div>

                        {field.type === "select" && (
                          <div className="mt-3">
                            <label
                              className={`block text-xs mb-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              الخيارات (مفصولة بفاصلة)
                            </label>
                            <input
                              type="text"
                              value={field.options?.join(", ") || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  options: e.target.value
                                    .split(",")
                                    .map((opt) => opt.trim())
                                    .filter((opt) => opt),
                                })
                              }
                              className={`w-full px-2 py-1 text-sm border rounded transition-colors duration-200 ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                              placeholder="خيار 1, خيار 2, خيار 3"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={saveForm}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                      حفظ النموذج
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "responses" && (
          <div
            className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              استجابات المستخدمين
            </h2>

            {responses.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                لا توجد استجابات متاحة حالياً
              </div>
            ) : (
              <div className="space-y-6">
                {responses.map((response) => (
                  <div
                    key={response.id}
                    className={`border rounded-lg p-6 transition-colors duration-300 ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {response.formTitle}
                        </h3>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          المستخدم: {response.userName}
                        </p>
                      </div>
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Calendar className="inline-block ml-1 h-4 w-4" />
                        {response.submittedDate}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(response.responses).map(
                        ([question, answer]) => (
                          <div
                            key={question}
                            className={`p-3 rounded transition-colors duration-300 ${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            }`}
                          >
                            <p
                              className={`text-sm font-medium mb-1 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {question}
                            </p>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {answer}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className={`rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                تفاصيل المستخدم
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className={`transition-colors duration-200 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  الاسم:
                </span>
                <span
                  className={`${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {selectedUser.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  السن:
                </span>
                <span
                  className={`${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {selectedUser.age} سنة
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  النوع:
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.type === "مريض"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedUser.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  الجنس:
                </span>
                <span
                  className={`${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {selectedUser.gender}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  المحافظة:
                </span>
                <span
                  className={`${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {selectedUser.governorate}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  تاريخ الانضمام:
                </span>
                <span
                  className={`${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {selectedUser.joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
