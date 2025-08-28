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
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2,
  X,
  Volume2,
  Pause,
  Play,
  MoreVertical,
  Edit,
  Check,
  AlertCircle,
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

  const themeClasses = {
    background: darkMode
      ? "bg-gradient-to-br from-gray-900 to-gray-800"
      : "bg-gradient-to-br from-blue-50 to-indigo-100",

    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    cardBorder: darkMode ? "border-gray-700" : "border-gray-200",

    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textMuted: darkMode ? "text-gray-400" : "text-gray-500",

    buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
    buttonSecondary: darkMode
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
      : "bg-gray-100 hover:bg-gray-200 text-gray-700",

    input: darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",

    userMessage: darkMode
      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
      : "bg-gradient-to-r from-blue-500 to-blue-400 text-white",

    aiMessage: darkMode
      ? "bg-gray-700 text-gray-100 border border-gray-600"
      : "bg-gray-100 text-gray-900 border border-gray-200",

    sidebarCard: darkMode
      ? "bg-gray-800/70 backdrop-blur-lg border-gray-700"
      : "bg-white/70 backdrop-blur-lg border-gray-200",

    chatCard: darkMode
      ? "bg-gray-800/90 backdrop-blur-lg border-gray-700"
      : "bg-white/90 backdrop-blur-lg border-gray-200",

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
        className={`min-h-screen transition-all duration-300 ${themeClasses.background} ${themeClasses.textPrimary}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

function AIChat() {
  const { classes, darkMode, toggleDarkMode } = useTheme();

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "مرحباً! أنا مساعدك الذكي الشخصي. يمكنني مساعدتك في أي موضوع تريده. كيف يمكنني خدمتك اليوم؟",
      timestamp: new Date(),
      reactions: [],
      edited: false,
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
    voiceEnabled: true,
    autoSave: true,
  });

  const [factInput, setFactInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [chatSessions, setChatSessions] = useState([
    {
      id: 1,
      name: "المحادثة الحالية",
      messages: messages,
      active: true,
      timestamp: new Date(),
    },
  ]);
  const [currentSession, setCurrentSession] = useState(1);
  const [showMessageActions, setShowMessageActions] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

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
      reactions: [],
      edited: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setSelectedFiles([]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        reactions: [],
        edited: false,
        thinking: false,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, Math.random() * 2000 + 1000);
  };

  const generateAIResponse = (input) => {
    const responses = [
      `شكراً لسؤالك "${input}". بناءً على الحقائق المحفوظة عنك (${userFacts.length} حقيقة) وإعداداتك الحالية، إليك إجابتي المفصلة...`,
      `فهمت طلبك بخصوص "${input}". مع مراعاة تفضيلاتك للغة ${settings.language} ونمط الاستجابة ${settings.responseStyle}، دعني أقدم لك أفضل إجابة ممكنة...`,
      `هذا سؤال ممتاز! "${input}". بناءً على شخصيتي ${settings.personality} والحقائق المحفوظة عنك، إليك رأيي المدروس...`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const resendMessage = (messageContent) => {
    setInputMessage(messageContent);
    textareaRef.current?.focus();
  };

  const quoteMessage = (content) => {
    setInputMessage(`> ${content}\n\n`);
    textareaRef.current?.focus();
  };

  const deleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const editMessage = (messageId, newContent) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, edited: true, editedAt: new Date() }
          : msg
      )
    );
    setEditingMessage(null);
    setEditText("");
  };

  const reactToMessage = (messageId, reaction) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(
            (r) => r.type === reaction
          );
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.filter((r) => r.type !== reaction),
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { type: reaction, timestamp: new Date() },
              ],
            };
          }
        }
        return msg;
      })
    );
  };

  const saveFact = () => {
    if (!factInput.trim()) return;
    const newFact = {
      id: Date.now(),
      content: factInput,
      timestamp: new Date(),
      category: "عام",
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
    const chatData = JSON.stringify(
      { messages, userFacts, settings, timestamp: new Date() },
      null,
      2
    );
    const blob = new Blob([chatData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const createNewSession = () => {
    const newSession = {
      id: Date.now(),
      name: `محادثة ${chatSessions.length + 1}`,
      messages: [messages[0]],
      active: true,
      timestamp: new Date(),
    };

    setChatSessions((prev) =>
      prev.map((s) => ({ ...s, active: false })).concat(newSession)
    );
    setCurrentSession(newSession.id);
    setMessages([messages[0]]);
  };

  const switchSession = (sessionId) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      setChatSessions((prev) =>
        prev.map((s) => ({ ...s, active: s.id === sessionId }))
      );
      setCurrentSession(sessionId);
      setMessages(session.messages);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 h-screen max-w-7xl">
      <div
        className={`grid transition-all duration-300 gap-3 sm:gap-6 h-full ${
          sidebarCollapsed && settingsCollapsed
            ? "grid-cols-1"
            : sidebarCollapsed || settingsCollapsed
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 lg:grid-cols-5"
        }`}
      >
        {/* الشريط الجانبي - الحقائق والجلسات */}
        {!sidebarCollapsed && (
          <div
            className={`${
              settingsCollapsed ? "lg:col-span-1" : "lg:col-span-1"
            } ${
              classes.sidebarCard
            } rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-xl relative`}
          >
            <button
              onClick={() => setSidebarCollapsed(true)}
              className={`absolute top-4 left-4 p-1 rounded-lg ${classes.buttonSecondary} lg:hidden`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
                <h3
                  className={`text-lg sm:text-xl font-bold ${classes.textPrimary}`}
                >
                  الجلسات والحقائق
                </h3>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all ${classes.buttonSecondary}`}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>

            {/* إدارة الجلسات */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-sm font-semibold ${classes.textPrimary}`}>
                  جلسات المحادثة
                </h4>
                <button
                  onClick={createNewSession}
                  className={`p-1 rounded-lg ${classes.buttonSecondary} text-xs`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => switchSession(session.id)}
                    className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                      session.active
                        ? "bg-blue-500 text-white"
                        : `${classes.buttonSecondary} hover:bg-opacity-80`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" />
                      <span className="truncate">{session.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* إضافة حقيقة */}
            <div className="mb-4 sm:mb-6">
              <textarea
                value={factInput}
                onChange={(e) => setFactInput(e.target.value)}
                placeholder="أضف معلومة شخصية عنك..."
                className={`w-full p-3 border rounded-xl resize-none h-16 sm:h-20 transition-colors text-sm ${classes.input}`}
              />
              <button
                onClick={saveFact}
                className={`mt-2 w-full px-4 py-2 rounded-xl transition-all ${classes.buttonPrimary} flex items-center justify-center gap-2 text-sm`}
              >
                <Save className="w-4 h-4" />
                احفظ الحقيقة
              </button>
            </div>

            {/* عرض الحقائق */}
            <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-96 overflow-y-auto">
              <h4
                className={`text-sm font-semibold ${classes.textPrimary} mb-2`}
              >
                الحقائق المحفوظة ({userFacts.length})
              </h4>
              {userFacts.map((fact) => (
                <div
                  key={fact.id}
                  className={`${classes.cardBg} p-3 rounded-xl border ${classes.cardBorder} shadow-sm`}
                >
                  <p
                    className={`${classes.textPrimary} text-xs sm:text-sm mb-2 leading-relaxed`}
                  >
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
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {userFacts.length === 0 && (
                <div className={`text-center py-6 ${classes.textMuted}`}>
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد حقائق محفوظة بعد</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* منطقة الشات الرئيسية */}
        <div
          className={`${
            sidebarCollapsed && settingsCollapsed
              ? "col-span-1"
              : sidebarCollapsed || settingsCollapsed
              ? "lg:col-span-2"
              : "lg:col-span-3"
          } ${
            classes.chatCard
          } rounded-2xl sm:rounded-3xl flex flex-col border shadow-xl relative`}
        >
          {/* أزرار التحكم */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className={`p-2 rounded-xl ${classes.buttonSecondary} lg:hidden`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {settingsCollapsed && (
              <button
                onClick={() => setSettingsCollapsed(false)}
                className={`p-2 rounded-xl ${classes.buttonSecondary} lg:hidden`}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* شريط العنوان */}
          <div className={`p-4 sm:p-6 border-b ${classes.cardBorder}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2
                    className={`text-lg sm:text-xl font-bold ${classes.textPrimary}`}
                  >
                    المساعد الذكي المتطور
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p
                      className={`${classes.textSecondary} text-xs sm:text-sm`}
                    >
                      متصل • {messages.length} رسالة • {userFacts.length} حقيقة
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportChat}
                  className={`p-2 rounded-xl transition-all ${classes.buttonSecondary}`}
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={createNewSession}
                  className={`p-2 rounded-xl transition-all ${classes.buttonSecondary}`}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* منطقة الرسائل */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } group`}
                onMouseEnter={() => setShowMessageActions(message.id)}
                onMouseLeave={() => setShowMessageActions(null)}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 relative shadow-lg transition-all hover:scale-[1.02] ${
                    message.type === "user"
                      ? classes.userMessage
                      : classes.aiMessage
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "user"
                          ? "bg-white/20"
                          : darkMode
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingMessage === message.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className={`w-full p-2 rounded-lg text-sm ${classes.input}`}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => editMessage(message.id, editText)}
                              className="p-1 bg-green-500 text-white rounded"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingMessage(null);
                                setEditText("");
                              }}
                              className="p-1 bg-red-500 text-white rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm sm:text-base mb-2 leading-relaxed break-words">
                            {message.content}
                          </p>
                          {message.edited && (
                            <span
                              className={`text-xs ${classes.textMuted} italic`}
                            >
                              (تم التعديل)
                            </span>
                          )}
                        </>
                      )}

                      {message.files && message.files.length > 0 && (
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {message.files.map((file, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs ${classes.buttonSecondary} flex items-center gap-1`}
                            >
                              <FileText className="w-3 h-3" />
                              {file.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* التفاعلات */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {message.reactions.map((reaction, index) => (
                            <span
                              key={index}
                              className="text-sm bg-white/20 px-2 py-1 rounded-full"
                            >
                              {reaction.type}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className={`${classes.textMuted} text-xs`}>
                          {message.timestamp.toLocaleTimeString("ar-EG", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {/* أزرار التفاعل */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => reactToMessage(message.id, "👍")}
                            className="text-xs hover:scale-110 transition-transform"
                          >
                            👍
                          </button>
                          <button
                            onClick={() => reactToMessage(message.id, "❤️")}
                            className="text-xs hover:scale-110 transition-transform"
                          >
                            ❤️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* أزرار التفاعل المتقدمة */}
                  {showMessageActions === message.id && (
                    <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-black/80 rounded-lg p-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-white/20 rounded transition-all"
                        title="نسخ"
                      >
                        <Copy className="w-3 h-3 text-white" />
                      </button>
                      {message.type === "user" && (
                        <>
                          <button
                            onClick={() => resendMessage(message.content)}
                            className="p-1 hover:bg-white/20 rounded transition-all"
                            title="إرسال مرة أخرى"
                          >
                            <RotateCcw className="w-3 h-3 text-white" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingMessage(message.id);
                              setEditText(message.content);
                            }}
                            className="p-1 hover:bg-white/20 rounded transition-all"
                            title="تعديل"
                          >
                            <Edit className="w-3 h-3 text-white" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => quoteMessage(message.content)}
                        className="p-1 hover:bg-white/20 rounded transition-all"
                        title="اقتباس"
                      >
                        <Quote className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="p-1 bg-red-500/70 rounded hover:bg-red-500 transition-all"
                        title="حذف"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}
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
          <div className={`p-4 sm:p-6 border-t ${classes.cardBorder}`}>
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
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
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
        {!settingsCollapsed && (
          <div
            className={`lg:col-span-1 ${classes.sidebarCard} rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-xl relative`}
          >
            <button
              onClick={() => setSettingsCollapsed(true)}
              className={`absolute top-4 left-4 p-1 rounded-lg ${classes.buttonSecondary} lg:hidden`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-purple-500" />
              <h3 className={`text-xl font-bold ${classes.textPrimary}`}>
                إعدادات المساعد
              </h3>
            </div>

            <div className="space-y-6">
              {/* درجة الحرارة */}
              <div>
                <label
                  className={`${classes.textPrimary} block mb-2 text-sm font-medium`}
                >
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
                <div className="flex justify-between text-xs mt-1">
                  <span className={classes.textMuted}>محافظ</span>
                  <span className={`${classes.textSecondary} font-medium`}>
                    {settings.temperature}
                  </span>
                  <span className={classes.textMuted}>مبدع</span>
                </div>
              </div>

              {/* طول الاستجابة */}
              <div>
                <label
                  className={`${classes.textPrimary} block mb-2 text-sm font-medium`}
                >
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
                  className={`w-full p-3 border rounded-xl transition-colors ${classes.input}`}
                >
                  <option value={500}>قصير (500 كلمة)</option>
                  <option value={1000}>متوسط (1000 كلمة)</option>
                  <option value={2000}>مفصل (2000 كلمة)</option>
                  <option value={3000}>شامل (3000 كلمة)</option>
                </select>
              </div>

              {/* اللغة المفضلة */}
              <div>
                <label
                  className={`${classes.textPrimary} block mb-2 text-sm font-medium`}
                >
                  اللغة المفضلة
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl transition-colors ${classes.input}`}
                >
                  <option value="arabic">العربية</option>
                  <option value="english">الإنجليزية</option>
                  <option value="mixed">مختلطة</option>
                  <option value="auto">تلقائي</option>
                </select>
              </div>

              {/* نمط الشخصية */}
              <div>
                <label
                  className={`${classes.textPrimary} block mb-2 text-sm font-medium`}
                >
                  نمط الشخصية
                </label>
                <select
                  value={settings.personality}
                  onChange={(e) =>
                    setSettings({ ...settings, personality: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl transition-colors ${classes.input}`}
                >
                  <option value="friendly">ودود ومرح</option>
                  <option value="professional">مهني ورسمي</option>
                  <option value="creative">إبداعي وملهم</option>
                  <option value="analytical">تحليلي ودقيق</option>
                  <option value="supportive">داعم ومتفهم</option>
                </select>
              </div>

              {/* نمط الاستجابة */}
              <div>
                <label
                  className={`${classes.textPrimary} block mb-2 text-sm font-medium`}
                >
                  نمط الاستجابة
                </label>
                <select
                  value={settings.responseStyle}
                  onChange={(e) =>
                    setSettings({ ...settings, responseStyle: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl transition-colors ${classes.input}`}
                >
                  <option value="detailed">مفصل وشامل</option>
                  <option value="concise">مختصر ومركز</option>
                  <option value="bullet">نقاط منظمة</option>
                  <option value="conversational">محادثة طبيعية</option>
                </select>
              </div>

              {/* إعدادات إضافية */}
              <div className="space-y-3">
                <h4 className={`${classes.textPrimary} font-medium text-sm`}>
                  إعدادات إضافية
                </h4>

                <div className="flex items-center justify-between">
                  <span className={`${classes.textSecondary} text-sm`}>
                    تفعيل الصوت
                  </span>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        voiceEnabled: !settings.voiceEnabled,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.voiceEnabled
                        ? "bg-blue-500"
                        : classes.buttonSecondary
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.voiceEnabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`${classes.textSecondary} text-sm`}>
                    الحفظ التلقائي
                  </span>
                  <button
                    onClick={() =>
                      setSettings({ ...settings, autoSave: !settings.autoSave })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoSave
                        ? "bg-blue-500"
                        : classes.buttonSecondary
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoSave ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* إحصائيات وتحليلات */}
              <div
                className={`p-4 ${classes.glassCard} rounded-xl border shadow-sm`}
              >
                <h4
                  className={`${classes.textPrimary} font-semibold mb-3 flex items-center gap-2`}
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  إحصائيات الجلسة
                </h4>
                <div className={`space-y-2 text-sm ${classes.textSecondary}`}>
                  <div className="flex justify-between items-center">
                    <span>إجمالي الرسائل:</span>
                    <span className="text-cyan-500 font-medium">
                      {messages.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>رسائل المستخدم:</span>
                    <span className="text-blue-500 font-medium">
                      {messages.filter((m) => m.type === "user").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ردود المساعد:</span>
                    <span className="text-green-500 font-medium">
                      {messages.filter((m) => m.type === "ai").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الحقائق المحفوظة:</span>
                    <span className="text-purple-500 font-medium">
                      {userFacts.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الجلسات النشطة:</span>
                    <span className="text-orange-500 font-medium">
                      {chatSessions.length}
                    </span>
                  </div>
                </div>

                {/* معلومات الإعدادات الحالية */}
                <div className="mt-4 pt-3 border-t border-gray-300/20">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded-lg ${classes.cardBg}`}>
                      <div className={`${classes.textMuted} mb-1`}>الإبداع</div>
                      <div className="text-cyan-500 font-medium">
                        {settings.temperature}
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${classes.cardBg}`}>
                      <div className={`${classes.textMuted} mb-1`}>الشخصية</div>
                      <div className="text-purple-500 font-medium">
                        {settings.personality}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراءات السريعة */}
              <div className="space-y-2">
                <button
                  onClick={() =>
                    setSettings({
                      temperature: 0.7,
                      maxTokens: 2000,
                      language: "arabic",
                      personality: "friendly",
                      responseStyle: "detailed",
                      voiceEnabled: true,
                      autoSave: true,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-xl transition-all ${classes.buttonSecondary} text-sm flex items-center justify-center gap-2`}
                >
                  <RotateCcw className="w-4 h-4" />
                  إعادة تعيين الإعدادات
                </button>

                <button
                  onClick={exportChat}
                  className={`w-full px-4 py-2 rounded-xl transition-all ${classes.buttonPrimary} text-sm flex items-center justify-center gap-2`}
                >
                  <Download className="w-4 h-4" />
                  تصدير البيانات
                </button>
              </div>
            </div>
          </div>
        )}
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
