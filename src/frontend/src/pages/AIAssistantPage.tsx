import { BookOpen, Bot, Send, Sparkles, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Category } from "../backend.d";
import {
  useGetAvailableBooks,
  useSearchBooksByCategory,
} from "../hooks/useQueries";
import { CATEGORY_LABELS } from "../lib/classification";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
  books?: Array<{
    title: string;
    author: string;
    category: string;
    available: boolean;
  }>;
}

const QUICK_SUGGESTIONS = [
  "What books are available in Computer Science?",
  "Find books by Griffiths",
  "Show me mathematics books",
  "What is Dewey Decimal Classification?",
  "Books about organic chemistry",
  "Help me find a book",
];

const AI_RESPONSES: Record<string, string> = {
  default:
    "I'm your AK Lib AI Assistant! I can help you find books, explain classifications, and guide your research. Try asking me to search for a specific book, author, or subject!",
  ddc: "The Dewey Decimal Classification (DDC) is a library classification system that divides books into 10 main classes (000-999):\n\n\u2022 000 - General Knowledge\n\u2022 100 - Philosophy & Psychology\n\u2022 200 - Religion\n\u2022 300 - Social Sciences\n\u2022 400 - Language\n\u2022 500 - Pure Science\n\u2022 600 - Technology\n\u2022 700 - Arts & Recreation\n\u2022 800 - Literature\n\u2022 900 - History & Geography\n\nEach class is further subdivided for more specific topics!",
  colon:
    "The Colon Classification (CC) was devised by S.R. Ranganathan (an Indian librarian) in 1933. It uses facet analysis with 5 fundamental categories: Personality, Matter, Energy, Space, and Time (PMEST). It's especially suited for Indian libraries and academic collections. Example: Q:4 for Computer Science, B:1 for Mathematics.",
  hello:
    "Hello! Welcome to AK Lib. I'm here to help you navigate our library. You can ask me to:\n\u2022 Find books by title, author, or subject\n\u2022 Explain library classifications (DDC/Colon)\n\u2022 Get reading recommendations\n\u2022 Help with research queries\n\nWhat would you like to explore today?",
  research:
    "For research assistance, I recommend:\n1. Start with our OPAC to search the physical collection\n2. Check E-Books & Journals for digital resources\n3. Use Shodhganga for Indian theses and dissertations\n4. Explore IEEE Xplore for technology journals\n5. NPTEL for free IIT/IISc course materials\n\nWould you like me to search for specific books on your research topic?",
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: "rgba(34,183,173,0.15)" }}
      >
        <Bot size={14} style={{ color: "#22B7AD" }} />
      </div>
      <div className="lib-card px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
        <span className="text-xs" style={{ color: "#7F93A8" }}>
          AI is thinking...
        </span>
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: AI_RESPONSES.hello,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchCategory, setSearchCategory] = useState<Category | "">(
    "" as Category | "",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: allBooks } = useGetAvailableBooks();
  const { data: categoryResults } = useSearchBooksByCategory(searchCategory);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const generateResponse = async (
    userMessage: string,
  ): Promise<ChatMessage> => {
    const msg = userMessage.toLowerCase();
    let text = AI_RESPONSES.default;
    let foundBooks: ChatMessage["books"] = [];

    if (msg.match(/^(hi|hello|hey|good\s*(morning|afternoon|evening))/)) {
      text = AI_RESPONSES.hello;
    } else if (
      msg.includes("ddc") ||
      msg.includes("dewey") ||
      msg.includes("decimal")
    ) {
      text = AI_RESPONSES.ddc;
    } else if (
      msg.includes("colon") ||
      msg.includes("ranganathan") ||
      msg.includes("classification")
    ) {
      text = AI_RESPONSES.colon;
    } else if (
      msg.includes("research") ||
      msg.includes("thesis") ||
      msg.includes("dissertation")
    ) {
      text = AI_RESPONSES.research;
    } else if (
      msg.includes("computer science") ||
      msg.includes("programming") ||
      msg.includes("software")
    ) {
      setSearchCategory(Category.computerscience);
      const books =
        categoryResults ||
        allBooks?.filter((b) => b.category.toString() === "computerscience") ||
        [];
      foundBooks = books.slice(0, 5).map((b) => ({
        title: b.title,
        author: b.author,
        category: CATEGORY_LABELS[b.category.toString()],
        available: Number(b.availableCopies) > 0,
      }));
      text =
        foundBooks.length > 0
          ? `I found ${foundBooks.length} Computer Science books in our collection. Here are some available titles:`
          : "I searched our Computer Science collection. The catalog is still loading \u2014 please try again in a moment!";
    } else if (
      msg.includes("mathematics") ||
      msg.includes("math") ||
      msg.includes("calculus") ||
      msg.includes("algebra")
    ) {
      setSearchCategory(Category.math);
      const books =
        categoryResults ||
        allBooks?.filter((b) => b.category.toString() === "math") ||
        [];
      foundBooks = books.slice(0, 5).map((b) => ({
        title: b.title,
        author: b.author,
        category: CATEGORY_LABELS[b.category.toString()],
        available: Number(b.availableCopies) > 0,
      }));
      text =
        foundBooks.length > 0
          ? `I found ${foundBooks.length} Mathematics books. Here are some recommendations:`
          : "Searching the Mathematics collection. Please try again shortly!";
    } else if (
      msg.includes("physics") ||
      msg.includes("quantum") ||
      msg.includes("mechanics")
    ) {
      setSearchCategory(Category.physics);
      const books =
        allBooks?.filter((b) => b.category.toString() === "physics") || [];
      foundBooks = books.slice(0, 5).map((b) => ({
        title: b.title,
        author: b.author,
        category: CATEGORY_LABELS[b.category.toString()],
        available: Number(b.availableCopies) > 0,
      }));
      text =
        foundBooks.length > 0
          ? "Here are Physics books from our collection:"
          : "I'll search our Physics section for you. The catalog is loading!";
    } else if (
      msg.includes("chemistry") ||
      msg.includes("organic") ||
      msg.includes("chemical")
    ) {
      const books =
        allBooks?.filter((b) => b.category.toString() === "chemistry") || [];
      foundBooks = books.slice(0, 5).map((b) => ({
        title: b.title,
        author: b.author,
        category: CATEGORY_LABELS[b.category.toString()],
        available: Number(b.availableCopies) > 0,
      }));
      text =
        foundBooks.length > 0
          ? "Here are Chemistry books available:"
          : "Searching Chemistry section...";
    } else if (
      msg.includes("by ") ||
      msg.includes("author") ||
      msg.includes("griffiths") ||
      msg.includes("grewal") ||
      msg.includes("cormen")
    ) {
      const authorMatch =
        msg.match(/(?:by |author )([a-zA-Z]+)/)?.[1] ||
        (msg.includes("griffiths")
          ? "griffiths"
          : msg.includes("grewal")
            ? "grewal"
            : msg.includes("cormen")
              ? "cormen"
              : null);
      if (authorMatch) {
        const books =
          allBooks?.filter((b) =>
            b.author.toLowerCase().includes(authorMatch),
          ) || [];
        if (books.length > 0) {
          foundBooks = books.slice(0, 5).map((b) => ({
            title: b.title,
            author: b.author,
            category: CATEGORY_LABELS[b.category.toString()],
            available: Number(b.availableCopies) > 0,
          }));
          text = `I found books by ${authorMatch.charAt(0).toUpperCase() + authorMatch.slice(1)}:`;
        } else {
          text = `I searched for "${authorMatch}" in our catalog. Results will appear shortly. You can also use the Books section for detailed search.`;
        }
      } else {
        text =
          "Please specify an author name. For example: 'Find books by Griffiths' or 'Show books by Grewal'";
      }
    } else if (
      msg.includes("find") ||
      msg.includes("search") ||
      msg.includes("look for") ||
      msg.includes("show me")
    ) {
      const bookTitleMatch = userMessage.match(
        /(?:find|search|look for|show me)\s+(?:a |the |books? (?:about |on )?)?(.+)/i,
      )?.[1];
      if (bookTitleMatch && allBooks) {
        const books = allBooks.filter(
          (b) =>
            b.title.toLowerCase().includes(bookTitleMatch.toLowerCase()) ||
            b.category.toString().includes(bookTitleMatch.toLowerCase()),
        );
        if (books.length > 0) {
          foundBooks = books.slice(0, 5).map((b) => ({
            title: b.title,
            author: b.author,
            category: CATEGORY_LABELS[b.category.toString()],
            available: Number(b.availableCopies) > 0,
          }));
          text = `I found ${books.length} matching book${books.length > 1 ? "s" : ""} for "${bookTitleMatch}":`;
        } else {
          text = `I couldn't find any books matching "${bookTitleMatch}" in our current catalog. Try a different keyword, or browse the full catalog in the Books section.`;
        }
      } else {
        text =
          "I'd be happy to help you find a book! What title, author, or subject are you looking for?";
      }
    } else {
      text = `I received your query: "${userMessage}"\n\nI can help you:\n\u2022 Search by book title or author\n\u2022 Browse by category (Computer Science, Mathematics, Physics, etc.)\n\u2022 Explain DDC or Colon classification\n\u2022 Guide research needs\n\nTry: "Find books about algorithms" or "Show Computer Science books"`;
    }

    return {
      id: Date.now().toString(),
      role: "assistant",
      text,
      timestamp: new Date(),
      books: foundBooks.length > 0 ? foundBooks : undefined,
    };
  };

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));
    const aiResponse = await generateResponse(text);
    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full" style={{ maxHeight: "calc(100vh - 73px)" }}>
      {/* Sidebar: Quick Suggestions */}
      <div
        className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r p-4 space-y-4"
        style={{ borderColor: "#22384A", background: "#0C1722" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: "#22B7AD" }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#7F93A8" }}
            >
              Quick Questions
            </span>
          </div>
          <div className="space-y-2">
            {QUICK_SUGGESTIONS.map((q, i) => (
              <button
                key={q}
                type="button"
                className="w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all"
                style={{ background: "rgba(34,56,74,0.3)", color: "#A9B6C6" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(34,183,173,0.1)";
                  e.currentTarget.style.color = "#22B7AD";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(34,56,74,0.3)";
                  e.currentTarget.style.color = "#A9B6C6";
                }}
                onClick={() => handleSend(q)}
                data-ocid={`ai.suggestion.button.${i + 1}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4" style={{ borderColor: "#22384A" }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#7F93A8" }}
          >
            About AI Assistant
          </p>
          <p className="text-xs" style={{ color: "#7F93A8" }}>
            This AI assistant searches the live book catalog and provides
            library guidance. It can find books by title, author, or category.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Chat Header */}
        <div
          className="flex items-center gap-3 px-5 py-3 border-b flex-shrink-0"
          style={{
            borderColor: "#22384A",
            background: "rgba(15,29,42,0.5)",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #22B7AD, #1FAEA4)" }}
          >
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#E8EEF6" }}>
              AK Lib AI Assistant
            </p>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#2ECC9A" }}
              />
              <span className="text-xs" style={{ color: "#7F93A8" }}>
                Online \u2022 Ready to help
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
                data-ocid={`ai.message.${msg.role === "user" ? "user" : "assistant"}.item`}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      msg.role === "assistant"
                        ? "linear-gradient(135deg, #22B7AD, #1FAEA4)"
                        : "linear-gradient(135deg, #D18A4A, #C17840)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={13} className="text-white" />
                  ) : (
                    <User size={13} className="text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`max-w-[75%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  } flex flex-col gap-2`}
                >
                  <div
                    className="px-4 py-3 rounded-2xl text-sm"
                    style={{
                      background:
                        msg.role === "assistant"
                          ? "#1A2D3E"
                          : "rgba(34,183,173,0.2)",
                      border: `1px solid ${
                        msg.role === "assistant"
                          ? "#22384A"
                          : "rgba(34,183,173,0.3)"
                      }`,
                      color: msg.role === "assistant" ? "#A9B6C6" : "#E8EEF6",
                      lineHeight: "1.6",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Book results */}
                  {msg.books && msg.books.length > 0 && (
                    <div className="space-y-2 w-full">
                      {msg.books.map((book, bi) => (
                        <div
                          key={`${book.title}-${bi}`}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={{
                            background: "#152534",
                            border: "1px solid #22384A",
                          }}
                          data-ocid={`ai.bookresult.item.${bi + 1}`}
                        >
                          <div
                            className="w-8 h-10 rounded flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "rgba(34,183,173,0.15)",
                              color: "#22B7AD",
                            }}
                          >
                            <BookOpen size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: "#E8EEF6" }}
                            >
                              {book.title}
                            </p>
                            <p className="text-xs" style={{ color: "#7F93A8" }}>
                              {book.author} \u2022 {book.category}
                            </p>
                          </div>
                          <span
                            className={
                              book.available
                                ? "lib-badge-available"
                                : "lib-badge-borrowed"
                            }
                          >
                            {book.available ? "Available" : "Out"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs px-1" style={{ color: "#7F93A8" }}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="px-4 py-4 border-t flex-shrink-0"
          style={{
            borderColor: "#22384A",
            background: "rgba(15,29,42,0.8)",
          }}
        >
          <div className="flex gap-3">
            <textarea
              className="lib-input flex-1 resize-none"
              rows={1}
              placeholder="Ask about books, classifications, or research help..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ lineHeight: "1.5" }}
              data-ocid="ai.chat.textarea"
            />
            <button
              type="button"
              className="lib-btn-primary px-4 flex items-center gap-2 flex-shrink-0"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              data-ocid="ai.chat.submit_button"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: "#7F93A8" }}>
            Press Enter to send \u2022 Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
