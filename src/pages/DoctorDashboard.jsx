import React, { useState, useContext, createContext } from "react";
import {
  Users,
  Brain,
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

import EnhancedFormBuilder from "../components/x";

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
    {
      id: 5,
      name: "عبد الرحمن مزروع",
      age: 13,
      type: "رياضي",
      gender: "ذكر",
      governorate: "بورسعيد",
      joinDate: "2012-04-04",
    },
    {
      id: 6,
      name: "مروان اسلام",
      age: 16,
      type: "رياضي",
      gender: "ذكر",
      governorate: "بورسعيد",
      joinDate: "2009-01-05",
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

  const [selectedUser, setSelectedUser] = useState(null);

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
                onClick={() => setActiveTab("ai")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === "ai"
                    ? "border-blue-500 text-blue-600"
                    : `border-transparent ${classes.tabs}`
                }`}
              >
                <Brain className="inline-block ml-2 h-5 w-5" />
                الذكاء الاصطناعي
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "users" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                className={`rounded-xl shadow-lg p-6 border transition-colors duration-300 ${classes.cardBg} ${classes.cardBorder}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${classes.textSecondary}`}
                    >
                      إجمالي المستخدمين
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {totalUsers}
                    </p>
                  </div>
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div
                className={`rounded-xl shadow-lg p-6 border transition-colors duration-300 ${classes.cardBg} ${classes.cardBorder}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${classes.textSecondary}`}
                    >
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
                    <p
                      className={`text-sm font-medium ${classes.textSecondary}`}
                    >
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
                    <p
                      className={`text-sm font-medium ${classes.textSecondary}`}
                    >
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
                  <thead
                    className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                  >
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
          </>
        )}

        {/* {activeTab === "forms" && <AdvancedFormManager />} */}
        {activeTab === "forms" && <EnhancedFormBuilder />}
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

            <div className="space-y-3 mb-6">
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

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  // Handle go to chat functionality
                  console.log("Navigate to chat with", selectedUser.name);
                  setSelectedUser(null);
                }}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.013 9.013 0 01-5.038-1.5c-1.462.426-3.001.8-4.638 1.148a.5.5 0 01-.602-.624l.635-2.54A8.99 8.99 0 013 12c0-4.418 4.477-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>انتقال للدردشة مع المريض</span>
              </button>

              <button
                onClick={() => {
                  // Handle show data functionality
                  console.log("Show data for", selectedUser.name);
                  setSelectedUser(null);
                }}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>عرض وتقديم البيانات</span>
              </button>

              <button
                onClick={() => {
                  // Handle build plan functionality
                  console.log("Build plan for", selectedUser.name);
                  setSelectedUser(null);
                }}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse ${
                  darkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>انتقال لبناء خطة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
