import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import {
  Send,
  Settings,
  Copy,
  RotateCcw,
  Quote,
  Trash2,
  Upload,
  Image,
  FileText,
  Mic,
  Save,
  User,
  Bot,
  Plus,
  MessageSquare,
  Brain,
  Sparkles,
  Download,
  Share,
  Star,
  Moon,
  Sun,
} from "lucide-react";

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
  };

  // كلاسات CSS شائعة يمكن إعادة استخدامها
  const themeClasses = {
    // backgrounds
    background: darkMode
      ? "bg-gradient-to-br from-gray-900 to-gray-800"
      : "bg-gradient-to-br from-blue-50 to-indigo-100",

    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    cardBorder: darkMode ? "border-gray-700" : "border-gray-200",

    // texts
    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textMuted: darkMode ? "text-gray-400" : "text-gray-500",

    // buttons
    buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
    buttonSecondary: darkMode
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
      : "bg-gray-100 hover:bg-gray-200 text-gray-700",

    // inputs
    input: darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",

    // tables
    tableHeader: darkMode ? "bg-gray-700" : "bg-gray-50",
    tableRow: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    tableDivider: darkMode ? "divide-gray-700" : "divide-gray-200",

    // states
    success: darkMode
      ? "bg-green-900 text-green-300"
      : "bg-green-100 text-green-800",
    error: darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800",
    warning: darkMode
      ? "bg-yellow-900 text-yellow-300"
      : "bg-yellow-100 text-yellow-800",

    // tabs
    tabs: darkMode
      ? "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",

    // إضافات للشات
    chatCard: darkMode
      ? "bg-gray-800/90 backdrop-blur-lg border-gray-700"
      : "bg-white/90 backdrop-blur-lg border-gray-200",

    userMessage: darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white",

    aiMessage: darkMode
      ? "bg-gray-700 text-gray-100 border border-gray-600"
      : "bg-gray-100 text-gray-900 border border-gray-200",

    sidebarCard: darkMode
      ? "bg-gray-800/70 backdrop-blur-lg border-gray-700"
      : "bg-white/70 backdrop-blur-lg border-gray-200",

    glassCard: darkMode
      ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
      : "bg-white/50 backdrop-blur-xl border-white/30",
  };

  const value = {
    darkMode,
    toggleDarkMode,
    classes: themeClasses,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`min-h-screen transition-colors duration-300 ${themeClasses.background} ${themeClasses.textPrimary}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// المكون الرئيسي للشات
function AIChat() {
  const { classes, darkMode, toggleDarkMode } = useTheme();

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [userFacts, setUserFacts] = useState([]);
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2000,
    language: "arabic",
    personality: "friendly",
    responseStyle: "detailed",
  });
  const [factInput, setFactInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() && selectedFiles.length === 0) return;

    const newMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      files: selectedFiles,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setSelectedFiles([]);
    setIsTyping(true);

    // محاكاة رد الذكاء الاصطناعي
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input) => {
    const responses = [
      `شكراً لسؤالك "${input}". بناءً على الحقائق المحفوظة عنك وإعداداتك الحالية، إليك إجابتي المفصلة...`,
      `فهمت طلبك بخصوص "${input}". دعني أقدم لك أفضل إجابة ممكنة مع مراعاة تفضيلاتك...`,
      `هذا سؤال ممتاز حول "${input}". بناءً على شخصيتي المحددة والحقائق المحفوظة، إليك رأيي...`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const resendMessage = (messageContent) => {
    setInputMessage(messageContent);
  };

  const quoteMessage = (content) => {
    setInputMessage(`> ${content}\n\n`);
  };

  const deleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const saveFact = () => {
    if (!factInput.trim()) return;
    const newFact = {
      id: Date.now(),
      content: factInput,
      timestamp: new Date(),
    };
    setUserFacts((prev) => [...prev, newFact]);
    setFactInput("");
  };

  const removeFact = (factId) => {
    setUserFacts((prev) => prev.filter((fact) => fact.id !== factId));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const exportChat = () => {
    const chatData = JSON.stringify({ messages, userFacts, settings }, null, 2);
    const blob = new Blob([chatData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-chat-export.json";
    a.click();
  };

  return (
    <div className="container mx-auto px-4 py-6 h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* الشريط الجانبي - الحقائق المحفوظة */}
        <div
          className={`lg:col-span-1 ${classes.sidebarCard} rounded-3xl p-6 border shadow-xl`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-cyan-500" />
              <h3 className={`text-xl font-bold ${classes.textPrimary}`}>
                الحقائق المحفوظة
              </h3>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all ${classes.buttonSecondary}`}
              title={darkMode ? "التبديل للوضع المضيء" : "التبديل للوضع المظلم"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* إضافة حقيقة جديدة */}
          <div className="mb-6">
            <textarea
              value={factInput}
              onChange={(e) => setFactInput(e.target.value)}
              placeholder="أضف حقيقة عنك..."
              className={`w-full p-3 border rounded-xl resize-none h-20 transition-colors ${classes.input}`}
            />
            <button
              onClick={saveFact}
              className={`mt-2 w-full px-4 py-2 rounded-xl transition-all ${classes.buttonPrimary} flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              احفظ الحقيقة
            </button>
          </div>

          {/* عرض الحقائق */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userFacts.map((fact) => (
              <div
                key={fact.id}
                className={`${classes.cardBg} p-3 rounded-xl border ${classes.cardBorder} shadow-sm`}
              >
                <p className={`${classes.textPrimary} text-sm mb-2`}>
                  {fact.content}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`${classes.textMuted} text-xs`}>
                    {fact.timestamp.toLocaleDateString("ar-EG")}
                  </span>
                  <button
                    onClick={() => removeFact(fact.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* منطقة الشات الرئيسية */}
        <div
          className={`lg:col-span-2 ${classes.chatCard} rounded-3xl flex flex-col border shadow-xl`}
        >
          {/* شريط العنوان */}
          <div className={`p-6 border-b ${classes.cardBorder}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${classes.textPrimary}`}>
                    المساعد الذكي
                  </h2>
                  <p className={`${classes.textSecondary} text-sm`}>
                    متصل الآن
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportChat}
                  className={`p-2 rounded-xl transition-all ${classes.buttonSecondary}`}
                  title="تصدير المحادثة"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setMessages([messages[0]])}
                  className={`p-2 rounded-xl transition-all ${classes.buttonSecondary}`}
                  title="محادثة جديدة"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* منطقة الرسائل */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } group`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 relative shadow-lg ${
                    message.type === "user"
                      ? classes.userMessage
                      : classes.aiMessage
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === "user"
                          ? "bg-white/20"
                          : darkMode
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="mb-2">{message.content}</p>
                      {message.files && message.files.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          {message.files.map((file, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs ${classes.buttonSecondary}`}
                            >
                              {file.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className={`${classes.textMuted} text-xs`}>
                        {message.timestamp.toLocaleTimeString("ar-EG")}
                      </span>
                    </div>
                  </div>

                  {/* أزرار التفاعل */}
                  <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="p-1 bg-black/50 rounded-lg hover:bg-black/70 transition-all"
                      title="نسخ"
                    >
                      <Copy className="w-3 h-3 text-white" />
                    </button>
                    {message.type === "user" && (
                      <button
                        onClick={() => resendMessage(message.content)}
                        className="p-1 bg-black/50 rounded-lg hover:bg-black/70 transition-all"
                        title="إرسال مرة أخرى"
                      >
                        <RotateCcw className="w-3 h-3 text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => quoteMessage(message.content)}
                      className="p-1 bg-black/50 rounded-lg hover:bg-black/70 transition-all"
                      title="اقتباس"
                    >
                      <Quote className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-1 bg-red-500/70 rounded-lg hover:bg-red-500 transition-all"
                      title="حذف"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div
                  className={`${classes.aiMessage} rounded-2xl p-4 shadow-lg`}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* منطقة الإدخال */}
          <div className={`p-6 border-t ${classes.cardBorder}`}>
            {/* الملفات المحددة */}
            {selectedFiles.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl ${classes.buttonSecondary}`}
                  >
                    <FileText className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    (e.preventDefault(), sendMessage())
                  }
                  placeholder="اكتب رسالتك هنا..."
                  className={`w-full p-4 border rounded-2xl resize-none min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${classes.input}`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 rounded-xl transition-all ${classes.buttonSecondary}`}
                  title="رفع ملفات"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() && selectedFiles.length === 0}
                  className={`p-3 rounded-xl transition-all ${classes.buttonPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* لوحة الإعدادات */}
        <div
          className={`lg:col-span-1 ${classes.sidebarCard} rounded-3xl p-6 border shadow-xl`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-purple-500" />
            <h3 className={`text-xl font-bold ${classes.textPrimary}`}>
              إعدادات الذكاء الاصطناعي
            </h3>
          </div>

          <div className="space-y-6">
            {/* درجة الحرارة */}
            <div>
              <label className={`${classes.textPrimary} block mb-2`}>
                درجة الإبداع
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-blue-500"
              />
              <span className={`${classes.textSecondary} text-sm`}>
                {settings.temperature}
              </span>
            </div>

            {/* أقصى عدد من الكلمات */}
            <div>
              <label className={`${classes.textPrimary} block mb-2`}>
                طول الاستجابة
              </label>
              <select
                value={settings.maxTokens}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxTokens: parseInt(e.target.value),
                  })
                }
                className={`w-full p-2 border rounded-xl transition-colors ${classes.input}`}
              >
                <option value={500}>قصير (500 كلمة)</option>
                <option value={1000}>متوسط (1000 كلمة)</option>
                <option value={2000}>مفصل (2000 كلمة)</option>
              </select>
            </div>

            {/* اللغة */}
            <div>
              <label className={`${classes.textPrimary} block mb-2`}>
                اللغة
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
                className={`w-full p-2 border rounded-xl transition-colors ${classes.input}`}
              >
                <option value="arabic">العربية</option>
                <option value="english">الإنجليزية</option>
                <option value="mixed">مختلطة</option>
              </select>
            </div>

            {/* الشخصية */}
            <div>
              <label className={`${classes.textPrimary} block mb-2`}>
                نمط الشخصية
              </label>
              <select
                value={settings.personality}
                onChange={(e) =>
                  setSettings({ ...settings, personality: e.target.value })
                }
                className={`w-full p-2 border rounded-xl transition-colors ${classes.input}`}
              >
                <option value="friendly">ودود</option>
                <option value="professional">مهني</option>
                <option value="creative">إبداعي</option>
                <option value="analytical">تحليلي</option>
              </select>
            </div>

            {/* نمط الاستجابة */}
            <div>
              <label className={`${classes.textPrimary} block mb-2`}>
                نمط الاستجابة
              </label>
              <select
                value={settings.responseStyle}
                onChange={(e) =>
                  setSettings({ ...settings, responseStyle: e.target.value })
                }
                className={`w-full p-2 border rounded-xl transition-colors ${classes.input}`}
              >
                <option value="detailed">مفصل</option>
                <option value="concise">مختصر</option>
                <option value="bullet">نقاط</option>
              </select>
            </div>

            {/* إحصائيات سريعة */}
            <div
              className={`mt-8 p-4 ${classes.glassCard} rounded-xl border shadow-sm`}
            >
              <h4 className={`${classes.textPrimary} font-semibold mb-3`}>
                إحصائيات سريعة
              </h4>
              <div className={`space-y-2 text-sm ${classes.textSecondary}`}>
                <div className="flex justify-between">
                  <span>إجمالي الرسائل:</span>
                  <span className="text-cyan-500 font-medium">
                    {messages.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>الحقائق المحفوظة:</span>
                  <span className="text-purple-500 font-medium">
                    {userFacts.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>الجلسة النشطة:</span>
                  <span className="text-green-500 font-medium">متصل</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// المكون الرئيسي مع ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <AIChat />
    </ThemeProvider>
  );
}
