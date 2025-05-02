
import { useState, useEffect, useRef } from "react";
import { BookOpen, Send, ChevronDown, ChevronUp, BookUser, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChatSuggestions } from "@/components/ChatSuggestions";
import { CourseRecommendations } from "@/components/CourseRecommendations";
import { LEARNING_LEVELS, LEARNING_GOALS } from "@/utils/courseData";

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
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Define the Gemini API key - hardcoded for demo purposes (would normally come from env vars)
  const geminiApiKey = "AIzaSyCM8RqXyQgJfH7hu3gW1vjRW0xv8LmZ598";

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    if (value.length > 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle clicking outside suggestions to close them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Apply a suggestion to the input
  const applySuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Generate a personalized prompt based on user's learning level and goal
  const generatePersonalizedPrompt = (userMessage: string) => {
    let prompt = userMessage;
    
    if (learningLevel) {
      prompt += `\n\nMy learning level is: ${learningLevel}.`;
    }
    
    if (learningGoal) {
      prompt += `\n\nMy learning goal is: ${learningGoal}.`;
    }
    
    return prompt;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage = { role: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const personalizedMessage = generatePersonalizedPrompt(message);
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + geminiApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a helpful learning assistant that suggests personalized courses and helps users achieve their learning goals. Keep responses focused on educational guidance and motivation. Tailor recommendations based on user's learning level and goals when provided. 
                  
                  User message: ${personalizedMessage}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const assistantMessage = { 
        role: "assistant" as const, 
        content: data.candidates[0].content.parts[0].text
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Using Perplexity API as fallback.",
        variant: "destructive",
      });
      
      // Fallback to Perplexity if available
      if (apiKey) {
        try {
          const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.1-sonar-small-128k-online',
              messages: [
                {
                  role: 'system',
                  content: 'You are a helpful learning assistant that suggests personalized courses and helps users achieve their learning goals. Keep responses focused on educational guidance and motivation.'
                },
                ...messages,
                { role: 'user', content: message }
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          });

          if (!response.ok) throw new Error('Fallback API request failed');
          
          const data = await response.json();
          const assistantMessage = { role: "assistant" as const, content: data.choices[0].message.content };
          setMessages(prev => [...prev, assistantMessage]);
        } catch (secondError) {
          toast({
            title: "Error",
            description: "All API attempts failed. Please try again later.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "API request failed and no fallback API key provided.",
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

  // Mobile view uses a Sheet component
  const renderMobileChat = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center md:hidden glass-btn"
          size="icon"
          variant="secondary"
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-full h-[90vh] flex flex-col p-0 bg-background/80 backdrop-blur-lg border-primary/20">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-center flex items-center justify-center gap-2">
            <BookUser className="h-5 w-5 text-primary" />
            Learning Assistant
          </SheetTitle>
        </SheetHeader>
        {renderChatContent()}
      </SheetContent>
    </Sheet>
  );

  // Desktop view shows a fixed chat window
  const renderDesktopChat = () => (
    <div 
      className={`fixed bottom-4 right-4 w-96 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      } bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg flex flex-col hidden md:flex glass-container transition-all duration-300`}
    >
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <BookUser className="h-5 w-5 text-primary" />
          Learning Assistant
        </h3>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {!isMinimized && renderChatContent()}
    </div>
  );

  // Common chat content for both mobile and desktop
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
                  {LEARNING_LEVELS.map(level => (
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
                  {LEARNING_GOALS.map(goal => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 w-full">
              <Button 
                variant="outline" 
                className="w-full glass-btn"
                onClick={toggleCourses}
              >
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
        
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
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
          </div>
        ))}
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
            className="text-xs w-full hover:bg-background/40"
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
                <ChatSuggestions 
                  message={message} 
                  onSelectSuggestion={applySuggestion} 
                />
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
