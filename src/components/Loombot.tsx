import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, MinusCircle, MaximizeIcon, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchAI, fetchYouTubeDetails } from "@/lib/aiService";
import { useLocalStorage } from "@/hooks/use-local-storage";

type QuizQA = { question: string; answer: string };
type Message = {
  id: string;
  text?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVideo?: boolean;
  quiz?: QuizQA[];
};

const QUICK_SUGGESTIONS = [
  "Explain this video concept",
  "Summarize this Loom video",
  "Extract key points from video",
  "Generate quiz from this video",
];

const parseQuiz = (text: string): QuizQA[] => {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const quiz: QuizQA[] = [];
  let q = '';
  for (let i = 0; i < lines.length; i++) {
    if (/^Q\d+[:.]/i.test(lines[i])) {
      q = lines[i].replace(/^Q\d+[:.]/i, '').trim();
      if (lines[i+1] && /^A\d+[:.]/i.test(lines[i+1])) {
        const a = lines[i+1].replace(/^A\d+[:.]/i, '').trim();
        quiz.push({ question: q, answer: a });
        i++;
      }
    }
  }
  return quiz;
};

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
    
    setVideoUrl(input);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      isVideo: true,
    };
    
    setMessages([...messages, userMessage]);
    
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
    
    const messageText = typeof e?.currentTarget === 'string' ? e.currentTarget : input;
    
    if (!videoUrl) {
      handleVideoUrlSubmit();
      return;
    }
    
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
      let videoDetails = null;
      if (videoUrl.includes('youtu')) {
        videoDetails = await fetchYouTubeDetails(videoUrl);
      }
      
      let prompt = "";
      const isQuiz = /quiz|flash\s*card/i.test(messageText);
      if (videoDetails) {
        if (isQuiz) {
          prompt = `Generate a quiz of 5 flash cards (Q&A pairs) based on this YouTube video.\nTitle: ${videoDetails.title}\nDescription: ${videoDetails.description}\nFormat: Q1: ...\nA1: ...\nQ2: ...\nA2: ...`;
        } else {
          prompt = `As Loombot, a friendly and helpful video learning assistant, here is the YouTube video info:\nTitle: ${videoDetails.title}\nDescription: ${videoDetails.description}\nUser question: ${messageText}\n\nGive a clear, detailed, and actionable answer based on the video info above.`;
        }
      } else {
        if (isQuiz) {
          prompt = `Generate a quiz of 5 flash cards (Q&A pairs) about the video at ${videoUrl}. Format: Q1: ...\nA1: ...\nQ2: ...\nA2: ...`;
        } else {
          prompt = `As Loombot, a friendly and helpful video learning assistant, please respond to this question about the video at ${videoUrl}: \"${messageText}\"`;
        }
      }
      
      const response = await fetchAI(prompt);
      
      if (isQuiz) {
        const quiz = parseQuiz(response);
        const quizMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          timestamp: new Date(),
          quiz,
        };
        setMessages((prev: Message[]) => [...prev, quizMessage]);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response || "I'm sorry, I couldn't generate a response about this video. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev: Message[]) => [...prev, botMessage]);
      }
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 sm:w-96 rounded-lg shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
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

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="bg-background border border-input rounded-b-lg"
                >
                  <div className="h-80 overflow-y-auto p-4" style={{ scrollBehavior: "smooth" }}>
                    {messages.map((message) => (
                      message.quiz ? (
                        <QuizFlashCards key={message.id} quiz={message.quiz} />
                      ) : (
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
                      )
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

function QuizFlashCards({ quiz }: { quiz: QuizQA[] }) {
  const parseOptions = (answer: string) => {
    const match = answer.match(/Options?:\s*([a-dA-D][).][^\n]+(\s+[a-dA-D][).][^\n]+)*)/);
    if (!match) return null;
    const optionsStr = match[1];
    return optionsStr.split(/(?=[a-dA-D][).])/).map(opt => opt.trim());
  };
  const [selected, setSelected] = useState<(string|null)[]>(Array(quiz.length).fill(null));
  return (
    <div className="my-4 space-y-6">
      <div className="text-base font-semibold text-purple-700 dark:text-purple-300 mb-2">Quiz</div>
      {quiz.map((qa, idx) => {
        const options = parseOptions(qa.answer);
        const answerText = options ? qa.answer.replace(/Options?:.+/i, '').trim() : qa.answer;
        return (
          <div key={idx} className="mb-4 p-4 rounded-lg bg-background border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="font-medium mb-2">Q{idx+1}. {qa.question}</div>
            {options ? (
              <div className="space-y-2">
                {options.map(opt => (
                  <button
                    key={opt}
                    className={`block w-full text-left px-4 py-2 rounded border transition-colors ${selected[idx] === opt ? (opt.toLowerCase().includes(answerText.toLowerCase()) ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800') : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:bg-purple-50 dark:hover:bg-zinc-800'}`}
                    disabled={selected[idx] !== null}
                    onClick={() => setSelected(sel => sel.map((s, i) => i === idx ? opt : s))}
                  >{opt}</button>
                ))}
                {selected[idx] && (
                  <div className={`mt-2 text-sm ${selected[idx]?.toLowerCase().includes(answerText.toLowerCase()) ? 'text-green-700' : 'text-red-700'}`}>
                    {selected[idx]?.toLowerCase().includes(answerText.toLowerCase()) ? 'Correct!' : `Incorrect. Answer: ${answerText}`}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">Answer: {answerText}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}