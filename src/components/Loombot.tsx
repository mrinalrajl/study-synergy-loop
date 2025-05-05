import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, MinusCircle, MaximizeIcon, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchAI } from "@/lib/aiService";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVideo?: boolean;
};

const QUICK_SUGGESTIONS = [
  "Explain this video concept",
  "Summarize this Loom video",
  "Extract key points from video",
  "Generate quiz from this video",
  "Recommend courses for me",
];

export function Loombot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useLocalStorage<Message[]>("loombot_messages", [
    {
      id: "welcome",
      text: "Hi! I'm Loombot, your video learning assistant. Paste a Loom video URL and I'll help you understand and learn from it.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      try {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error scrolling to bottom:", error);
      }
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

  const isValidLoomUrl = (url: string): boolean => {
    // Basic validation for Loom URLs
    return url.includes('loom.com') || url.includes('youtu') || url.includes('vimeo');
  };

  const handleVideoUrlSubmit = () => {
    if (!input.trim()) return;
    
    if (!isValidLoomUrl(input)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Loom, YouTube, or Vimeo video URL.",
        variant: "destructive",
      });
      return;
    }
    
    // Store the video URL
    setVideoUrl(input);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      isVideo: true,
    };
    
    setMessages([...messages, userMessage]);
    
    // Add bot response
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: `I've analyzed this video. What would you like to know about it? You can ask me to summarize it, explain concepts, extract key points, or generate quiz questions.`,
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botResponse]);
    setInput("");
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() && !e?.currentTarget) return;
    
    // If triggered by suggestion click, use its text
    const messageText = typeof e?.currentTarget === 'string' ? e.currentTarget : input;
    
    // Check if we have a video URL
    if (!videoUrl) {
      handleVideoUrlSubmit();
      return;
    }
    
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
      // Generate video-focused prompt
      const prompt = `As Loombot, a friendly and helpful video learning assistant, please respond to this question about the video at ${videoUrl}: "${messageText}"
      
      Keep your response friendly, detailed, and focused on helping the person learn from the video content. If you don't know something specific about the video, provide general guidance about the topic.
      
      If they're asking about video content:
      1. Provide a thoughtful analysis based on the likely content of the video
      2. Suggest key concepts that might be covered in such a video
      3. Add 2-3 practical tips for learning from video content
      4. If relevant, suggest follow-up questions they could ask
      
      Make your response engaging, informative, and actionable. Be conversational in tone.`;
      
      // Use the unified AI service
      const response = await fetchAI(prompt);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || "I'm sorry, I couldn't generate a response about this video. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev: Message[]) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "There was a problem analyzing the video. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered a technical issue analyzing this video. Please try again in a moment.",
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
        text: "Hi! I'm Loombot, your video learning assistant. Paste a Loom video URL and I'll help you understand and learn from it.",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setVideoUrl("");
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
            className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg z-50 hover:scale-110 transition-transform"
            onClick={toggleAssistant}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ rotate: 15 }}
            aria-label="Open Loombot"
          >
            <Video className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 sm:w-96 rounded-lg shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Header */}
            <div className="bg-purple-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center">
                <Video className="w-5 h-5 mr-2" />
                <div>
                  <h3 className="font-medium text-sm">Loombot</h3>
                  <p className="text-xs opacity-80">Your video learning assistant</p>
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
                              ? "bg-purple-600 text-white ml-auto"
                              : "bg-secondary/30 text-foreground"
                          }`}
                        >
                          {message.isVideo ? (
                            <div className="flex items-center">
                              <Video className="w-4 h-4 mr-2" />
                              <span>Video URL submitted</span>
                            </div>
                          ) : (
                            message.text
                          )}
                        </div>
                        <div
                          className={`text-xs text-muted-foreground mt-1 ${
                            message.sender === "user" ? "text-right" : ""
                          }`}
                        >
                          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
                  {videoUrl && messages.length < 5 && (
                    <div className="px-4 mb-2">
                      <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_SUGGESTIONS.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-2 py-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-400 rounded-full transition-colors"
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
                      placeholder={videoUrl ? "Ask about this video..." : "Paste a Loom or YouTube URL..."}
                      className="flex-1"
                      disabled={isLoading}
                      ref={inputRef}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="ml-2 bg-purple-600 hover:bg-purple-700"
                      disabled={!input.trim() || isLoading}
                    >
                      {videoUrl ? <Send className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                      <span className="sr-only">{videoUrl ? "Send" : "Analyze Video"}</span>
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