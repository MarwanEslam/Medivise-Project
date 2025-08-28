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
  ChevronDown,
  ChevronUp,
  X,
  Volume2,
  Pause,
  Play,
  MoreVertical,
  Edit,
  Check,
  AlertCircle,
  Menu,
  Maximize2,
  Minimize2,
} from "lucide-react";

import { useTheme } from "../ThemeContext";

function ClaudeStyleChat() {
  const { classes, darkMode, toggleDarkMode } = useTheme();

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "مرحباً! أنا Claude، مساعدك الذكي. يسعدني مساعدتك في أي موضوع تريده. كيف يمكنني خدمتك اليوم؟",
      timestamp: new Date(),
      reactions: [],
      edited: false,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: "محادثة جديدة", timestamp: new Date(), active: true },
  ]);

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

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      files: selectedFiles,
      timestamp: new Date(),
      reactions: [],
      edited: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setSelectedFiles([]);
    setIsTyping(true);

    // محاكاة رد المساعد
    setTimeout(() => {
      const assistantResponse = {
        id: Date.now() + 1,
        type: "assistant",
        content: generateResponse(inputMessage),
        timestamp: new Date(),
        reactions: [],
        edited: false,
      };
      setMessages((prev) => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateResponse = (input) => {
    const responses = [
      `أفهم سؤالك حول "${input}". دعني أقدم لك إجابة مفصلة ومفيدة...`,
      `شكراً لسؤالك. بناءً على ما ذكرت، إليك ما يمكنني مساعدتك به...`,
      `هذا موضوع مثير للاهتمام. دعني أشرح لك بالتفصيل...`,
      `أقدر سؤالك. إليك نظرة شاملة على هذا الموضوع...`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const createNewConversation = () => {
    const newConv = {
      id: Date.now(),
      title: "محادثة جديدة",
      timestamp: new Date(),
      active: true,
    };
    setConversations((prev) =>
      prev.map((c) => ({ ...c, active: false })).concat(newConv)
    );
    setMessages([
      {
        id: Date.now(),
        type: "assistant",
        content: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
        timestamp: new Date(),
        reactions: [],
        edited: false,
      },
    ]);
  };

  return (
    <div dir="rtl" className="flex h-screen">
      {/* الشريط الجانبي */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } lg:w-80 transition-all duration-300 ${
          classes.sidebar
        } border-r flex flex-col`}
      >
        {/* رأس الشريط الجانبي */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            {/* <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className={`font-semibold ${classes.textPrimary}`}>
                Claude
              </span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${classes.buttonGhost}`}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button> */}
          </div>

          <button
            onClick={createNewConversation}
            className={`w-full p-3 rounded-lg transition-colors ${classes.buttonSecondary} flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            محادثة جديدة
          </button>
        </div>

        {/* قائمة المحادثات */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <h3 className={`text-sm font-medium ${classes.textSecondary} mb-3`}>
            المحادثات الأخيرة
          </h3>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                conv.active
                  ? "bg-blue-600 text-white"
                  : `${classes.buttonGhost}`
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium truncate">
                  {conv.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* إعدادات سريعة */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            className={`w-full p-2 rounded-lg transition-colors ${classes.buttonGhost} flex items-center gap-2 text-sm`}
          >
            <Settings className="w-4 h-4" />
            الإعدادات
          </button>
          <button
            className={`w-full p-2 rounded-lg transition-colors ${classes.buttonGhost} flex items-center gap-2 text-sm`}
          >
            <Download className="w-4 h-4" />
            تصدير المحادثة
          </button>
        </div>
      </div>

      {/* المنطقة الرئيسية */}
      <div className="flex-1 flex flex-col">
        {/* شريط العلوي */}
        <header
          className={`${classes.chatArea} border-b p-4 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden p-2 rounded-lg ${classes.buttonGhost}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8  bg-blue-500  rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              {/* <div>
                <h1 className={`font-semibold ${classes.textPrimary}`}>
                  Claude
                </h1>
                <p className={`text-sm ${classes.textMuted}`}>مساعد ذكي</p>
              </div> */}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${classes.buttonGhost}`}>
              <Share className="w-4 h-4" />
            </button>
            <button className={`p-2 rounded-lg ${classes.buttonGhost}`}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* منطقة الرسائل */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div
                  className={`flex gap-3 ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* أفاتار */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" ? "bg-green-600" : "bg-blue-500"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Brain className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* محتوى الرسالة */}
                  <div
                    className={`flex-1 ${
                      message.type === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                        message.type === "user"
                          ? classes.userMessage
                          : classes.assistantMessage
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>

                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-xs bg-black/10 p-2 rounded"
                            >
                              <FileText className="w-3 h-3" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className={`mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        message.type === "user" ? "justify-end" : ""
                      }`}
                    >
                      <span className={`text-xs ${classes.textMuted}`}>
                        {message.timestamp.toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button
                        onClick={() => copyMessage(message.content)}
                        className={`p-1 rounded ${classes.buttonGhost}`}
                        title="نسخ"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className={`${classes.assistantMessage} p-4 rounded-2xl`}>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* منطقة الإدخال */}
        <footer className={`${classes.chatArea} border-t p-4`}>
          <div className="max-w-4xl mx-auto">
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${classes.buttonSecondary}`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالة..."
                  className={`w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${classes.input}`}
                  rows="1"
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
              </div>

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 rounded-xl transition-colors ${classes.buttonSecondary}`}
                  title="رفع ملف"
                >
                  <Upload className="w-4 h-4" />
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() && selectedFiles.length === 0}
                  className={`p-3 rounded-xl transition-colors ${classes.buttonPrimary}`}
                  title="إرسال"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className={`text-xs ${classes.textMuted} text-center mt-2`}>
              Claude يمكنه ارتكاب أخطاء. تحقق من المعلومات المهمة.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ClaudeStyleChat;