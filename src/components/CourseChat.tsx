import { useState, useEffect, useRef } from "react";
import { BookOpen, Send, ChevronDown, ChevronUp, BookUser, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChatSuggestions } from "@/components/ChatSuggestions";
import { CourseRecommendations } from "@/components/CourseRecommendations";
import { LEARNING_LEVELS, LEARNING_GOALS, COURSE_CATEGORIES } from "@/utils/courseData";

const ONBOARDING_STEPS = [
  {
    title: "Welcome to LoopBot!",
    description: "I'm your personal AI learning assistant. I'll help you find the perfect courses and create a customized learning path.",
    icon: <Sparkles className="h-12 w-12 text-primary animate-pulse" />
  },
  {
    title: "Set Your Learning Level",
    description: "Tell me your current skill level so I can recommend appropriate courses.",
    highlight: "learning-level-select"
  },
  {
    title: "Choose Your Goal",
    description: "What do you want to achieve? This helps me tailor recommendations just for you.",
    highlight: "learning-goal-select"
  },
  {
    title: "Browse or Chat",
    description: "You can browse course recommendations or chat with me anytime for personalized help!",
    highlight: "chat-actions"
  }
];

export const CourseChat = () => {
  const [message, setMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [learningLevel, setLearningLevel] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem("hasSeenChatOnboarding") === "true";
  });
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Define the Gemini API key - hardcoded for demo purposes (would normally come from env vars)
  const geminiApiKey = "AIzaSyCM8RqXyQgJfH7hu3gW1vjRW0xv8LmZ598";

  // Use OpenRouter (free-tier) as a fallback LLM provider
  const openRouterApiKey = "demo"; // 'demo' key works for public/free-tier

  // Add keyboard handling for suggestions
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < 0 ? prev + 1 : prev // Replace with actual suggestions array logic
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > -1 ? prev - 1 : -1
        );
      } else if (e.key === 'Enter' && selectedSuggestionIndex > -1) {
        e.preventDefault();
        const suggestions = ["Suggestion 1", "Suggestion 2", "Suggestion 3"]; // Replace with actual suggestions logic
        applySuggestion(suggestions[selectedSuggestionIndex]);
        setSelectedSuggestionIndex(-1);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    }
  };

  // Reset selected suggestion when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [showSuggestions]);

  useEffect(() => {
    if (!hasSeenOnboarding && isOpen) {
      setShowOnboarding(true);
    }
  }, [isOpen, hasSeenOnboarding]);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem("hasSeenChatOnboarding", "true");
    toast({
      title: "Welcome aboard!",
      description: "I'm here to help whenever you need me.",
      variant: "default",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.length > 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const applySuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const generatePersonalizedPrompt = (userMessage: string) => {
    let prompt = `You are an AI learning assistant specializing in personalized course recommendations. 
    
Current request: ${userMessage}

Instructions:
- Analyze the user's interests, goals, and current skill level
- Provide specific course recommendations from our available categories: ${Object.keys(COURSE_CATEGORIES).join(", ")}
- Include difficulty level, estimated time commitment, and learning outcomes
- Suggest a learning path with related courses
- Format your response in a clear, structured way
- Keep responses focused and concise

Context:`;

    if (learningLevel) {
      prompt += `\nLearning Level: ${learningLevel}`;
    }

    if (learningGoal) {
      prompt += `\nLearning Goal: ${learningGoal}`;
    }

    prompt += "\n\nPlease provide course recommendations and learning guidance based on this context.";

    return prompt;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const personalizedMessage = generatePersonalizedPrompt(message);

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + geminiApiKey,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: personalizedMessage }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
              topP: 0.8,
              topK: 40,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = {
          role: "assistant" as const,
          content: data.candidates[0].content.parts[0].text,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Gemini API failed");
      }
    } catch (error) {
      try {
        const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful learning assistant that suggests personalized courses and helps users achieve their learning goals.",
              },
              ...messages,
              { role: "user", content: generatePersonalizedPrompt(message) },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });
        if (!openRouterRes.ok) throw new Error("OpenRouter API failed");
        const data = await openRouterRes.json();
        const assistantMessage = { role: "assistant" as const, content: data.choices[0].message.content };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (secondError) {
        toast({
          title: "Error",
          description: "All API attempts failed. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLearningLevel = (value: string) => {
    setLearningLevel(value);
  };

  const handleSelectLearningGoal = (goal: string) => {
    setLearningGoal(goal);
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  const toggleCourses = () => {
    setShowCourses(!showCourses);
  };

  const selectCourse = (course: string) => {
    setMessage(`Tell me more about "${course}"`);
    inputRef.current?.focus();
    setShowCourses(false);
  };

  const renderOnboarding = () => (
    <AnimatePresence mode="wait">
      {showOnboarding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="max-w-sm bg-card p-6 rounded-xl shadow-xl border border-primary/20"
          >
            <div className="text-center mb-6">
              {ONBOARDING_STEPS[onboardingStep].icon}
              <h3 className="text-xl font-semibold mt-4 mb-2">{ONBOARDING_STEPS[onboardingStep].title}</h3>
              <p className="text-muted-foreground">{ONBOARDING_STEPS[onboardingStep].description}</p>
            </div>
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => (onboardingStep > 0 ? setOnboardingStep((s) => s - 1) : completeOnboarding())}
              >
                {onboardingStep === 0 ? "Skip" : "Back"}
              </Button>
              <Button
                onClick={() =>
                  onboardingStep < ONBOARDING_STEPS.length - 1 ? setOnboardingStep((s) => s + 1) : completeOnboarding()
                }
              >
                {onboardingStep === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Next"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderMobileChat = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="fixed bottom-4 right-4 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center md:hidden prism-btn"
            size="icon"
            variant="secondary"
            aria-label="Open Learning Assistant"
          >
            <motion.div
              animate={{ rotate: isOpen ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <BookOpen className="h-6 w-6" />
            </motion.div>
          </Button>
        </motion.div>
      </SheetTrigger>
      
      <SheetContent 
        className="sm:max-w-full h-[90vh] flex flex-col p-0 bg-background/80 backdrop-blur-lg border-primary/20"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col h-full"
        >
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="text-center flex items-center justify-center gap-2">
              <BookUser className="h-5 w-5 text-primary" />
              Learning Assistant
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <motion.div
              className="h-full"
              initial={false}
              animate={{ 
                height: showCourses ? "auto" : "100%",
                opacity: 1 
              }}
              transition={{ type: "spring", bounce: 0.2 }}
            >
              {renderChatContent()}
            </motion.div>
          </div>

          {/* Mobile touch handle for better UX */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 flex justify-center items-center touch-none"
            role="presentation"
          >
            <div className="w-16 h-1 rounded-full bg-muted-foreground/20" />
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );

  const renderDesktopChat = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`fixed bottom-6 right-6 w-96 ${
            isMinimized ? "h-16" : "h-[calc(100vh-6rem)]"
          } bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg flex flex-col hidden md:flex glass-container`}
          role="complementary"
          aria-label="Learning Assistant Chat"
        >
          <div 
            className="p-4 border-b border-border flex justify-between items-center"
            role="toolbar"
            aria-label="Chat controls"
          >
            <h3 className="font-semibold flex items-center gap-2">
              <BookUser className="h-5 w-5 text-primary" />
              Learning Assistant
            </h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 prism-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                aria-expanded={!isMinimized}
              >
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                role="log"
                aria-label="Chat messages"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    role="article"
                    aria-label={`${msg.role === "user" ? "Your message" : "Assistant's response"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-primary/80 backdrop-blur-md text-primary-foreground ml-4"
                          : "bg-background/60 backdrop-blur-sm border border-border text-foreground mr-4"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div 
                    className="flex justify-start"
                    role="status"
                    aria-label="Assistant is thinking"
                  >
                    <div className="bg-background/40 text-foreground p-3 rounded-lg animate-pulse border border-border">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              <form 
                onSubmit={handleSubmit} 
                className="p-4 border-t border-border"
                role="form"
                aria-label="Message input form"
              >
                <div className="flex flex-col gap-2">
                  <div className="relative w-full">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about courses or learning goals..."
                      className="w-full bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary pr-10"
                      onFocus={() => message.length > 2 && setShowSuggestions(true)}
                      aria-label="Message input"
                      aria-controls={showSuggestions ? "suggestions-list" : undefined}
                      aria-expanded={showSuggestions}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !message.trim()}
                      className="absolute right-1 top-1 p-1 h-8 w-8"
                      size="icon"
                      variant="ghost"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>

                    {showSuggestions && (
                      <div 
                        ref={suggestionsRef}
                        id="suggestions-list"
                        role="listbox"
                        aria-label="Suggested messages"
                      >
                        <ChatSuggestions 
                          message={message}
                          selectedIndex={selectedSuggestionIndex}
                          onSelectSuggestion={applySuggestion}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
          {renderOnboarding()}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderMessage = (msg: { role: "user" | "assistant"; content: string }, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={index}
      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          msg.role === "user"
            ? "bg-primary/80 backdrop-blur-md text-primary-foreground ml-4 glass-msg"
            : "bg-background/60 backdrop-blur-sm border border-border text-foreground mr-4 glass-msg"
        }`}
      >
        {msg.content}
      </div>
    </motion.div>
  );

  const renderChatContent = () => (
    <>
      {!geminiApiKey && !apiKey && (
        <div className="p-4">
          <input
            type="password"
            placeholder="Enter your Perplexity API key as fallback"
            className="w-full p-2 border rounded bg-background/50"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Using Gemini API by default. You can provide a Perplexity API key as fallback from{" "}
            <a
              href="https://docs.perplexity.ai/docs/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Perplexity AI
            </a>
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="font-medium text-lg">Welcome to Learning Assistant</h3>
            <p className="text-sm max-w-xs">
              Ask me about courses, learning paths, or anything related to your educational journey!
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
              <Select value={learningLevel} onValueChange={handleSelectLearningLevel}>
                <SelectTrigger className="w-full bg-background/60">
                  <SelectValue placeholder="Learning Level" />
                </SelectTrigger>
                <SelectContent>
                  {LEARNING_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={learningGoal} onValueChange={handleSelectLearningGoal}>
                <SelectTrigger className="w-full bg-background/60">
                  <SelectValue placeholder="Learning Goal" />
                </SelectTrigger>
                <SelectContent>
                  {LEARNING_GOALS.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 w-full">
              <Button variant="outline" className="w-full glass-btn prism-btn" onClick={toggleCourses}>
                <Search className="mr-2 h-4 w-4" />
                Browse Course Recommendations
              </Button>
            </div>

            {showCourses && (
              <div className="w-full mt-4 border border-border rounded-lg p-4 bg-background/30 animate-fade-in">
                <CourseRecommendations onCourseSelect={selectCourse} />
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => renderMessage(msg, i))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-background/40 text-foreground p-3 rounded-lg animate-pulse border border-border">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-xs w-full hover:bg-background/40 prism-btn"
          >
            Clear conversation
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex flex-col gap-2">
          <div className="relative w-full">
            <Input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about courses or learning goals..."
              className="w-full bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary pr-10"
              onFocus={() => message.length > 2 && setShowSuggestions(true)}
            />
            <Button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="absolute right-1 top-1 p-1 h-8 w-8"
              size="icon"
              variant="ghost"
            >
              <Send className="w-4 h-4" />
            </Button>

            {showSuggestions && (
              <div ref={suggestionsRef}>
                <ChatSuggestions message={message} onSelectSuggestion={applySuggestion} />
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );

  return (
    <>
      {renderMobileChat()}
      {renderDesktopChat()}
    </>
  );
};
