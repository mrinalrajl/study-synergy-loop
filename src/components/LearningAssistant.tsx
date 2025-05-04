import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, MinusCircle, MaximizeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchGemini, getGeminiApiKey } from "@/lib/geminiClient";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { fetchAI } from "@/lib/aiService";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const QUICK_SUGGESTIONS = [
  "Help me learn Python basics",
  "Suggest coding exercises",
  "What should I study next?",
  "Explain complex topics simply",
];

export function LearningAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useLocalStorage<Message[]>("learning_assistant_messages", [
    {
      id: "welcome",
      text: "Hi! I'm LoopBot, your learning assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() && !e?.currentTarget) return;
    
    // If triggered by suggestion click, use its text
    const messageText = typeof e?.currentTarget === 'string' ? e.currentTarget : input;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Generate learning-focused prompt with improved instructions
      const prompt = `As LoopBot, a friendly and helpful learning assistant, please respond to this question about learning or education: "${messageText}"
      
      Keep your response friendly, detailed, and focused on helping the person learn effectively. If you don't know something, suggest resources they could check.
      
      If they're asking about learning a topic:
      1. Suggest a good starting point with specific details
      2. Mention 2-3 high-quality resources they could use (books, courses, websites)
      3. Add 2-3 practical tips for effective learning in this area
      4. If relevant, suggest a learning path or progression
      
      Make your response engaging, informative, and actionable. Use examples where appropriate and be conversational in tone.`;
      
      // Try to use the unified AI service first for better fallback handling
      let response;
      try {
        response = await fetchAI(prompt);
      } catch (aiError) {
        console.warn("Unified AI service failed, falling back to direct Gemini:", aiError);
        const apiKey = getGeminiApiKey();
        response = await fetchGemini(prompt, apiKey);
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || "I'm sorry, I couldn't generate a response. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev: Message[]) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "There was a problem connecting to the learning assistant. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered a technical issue. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSendMessage(suggestion as any);
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        text: "Hi! I'm LoopBot, your learning assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Chat cleared",
      description: "All previous messages have been removed.",
    });
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg z-50 hover:scale-110 transition-transform"
            onClick={toggleAssistant}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ rotate: 15 }}
            aria-label="Open Learning Assistant"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-80 sm:w-96 rounded-lg shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Header */}
            <div className="bg-primary text-white p-3 flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                <div>
                  <h3 className="font-medium text-sm">LoopBot</h3>
                  <p className="text-xs opacity-80">Your learning assistant</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full hover:bg-white/20"
                  onClick={toggleMinimize}
                  aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                >
                  {isMinimized ? <MaximizeIcon className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full hover:bg-white/20"
                  onClick={toggleAssistant}
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="bg-background border border-input rounded-b-lg"
                >
                  {/* Messages area */}
                  <div className="h-80 overflow-y-auto p-4" style={{ scrollBehavior: "smooth" }}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-3 max-w-[90%] ${
                          message.sender === "user" ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shadow-sm ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-secondary/30 text-foreground"
                          }`}
                        >
                          {message.text}
                        </div>
                        <div
                          className={`text-xs text-muted-foreground mt-1 ${
                            message.sender === "user" ? "text-right" : ""
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex space-x-2 items-center p-2 bg-secondary/20 rounded-lg w-24">
                        <div className="animate-bounce h-2 w-2 rounded-full bg-muted-foreground"></div>
                        <div className="animate-bounce h-2 w-2 rounded-full bg-muted-foreground" style={{ animationDelay: "0.2s" }}></div>
                        <div className="animate-bounce h-2 w-2 rounded-full bg-muted-foreground" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestions */}
                  {messages.length < 3 && (
                    <div className="px-4 mb-2">
                      <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_SUGGESTIONS.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input area */}
                  <form onSubmit={handleSendMessage} className="border-t p-2 flex items-center">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask LoopBot a question..."
                      className="flex-1"
                      disabled={isLoading}
                      ref={inputRef}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="ml-2"
                      disabled={!input.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                  
                  {/* Clear chat button */}
                  {messages.length > 1 && (
                    <div className="p-2 pt-0 text-center">
                      <button 
                        onClick={clearChat}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear conversation
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}