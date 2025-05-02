
import { useState, useEffect, useRef } from "react";
import { BookOpen, Send, X, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Predefined suggestions for different topics
const TOPIC_SUGGESTIONS: Record<string, string[]> = {
  "javascript": [
    "JavaScript Fundamentals",
    "Advanced JS Concepts",
    "JavaScript Frameworks Comparison",
    "Functional Programming in JS"
  ],
  "react": [
    "React Hooks Deep Dive",
    "State Management in React",
    "React Performance Optimization",
    "Building React Components"
  ],
  "python": [
    "Python for Beginners",
    "Data Science with Python",
    "Machine Learning with Python",
    "Web Development with Django"
  ],
  "design": [
    "UI/UX Fundamentals",
    "Design Systems",
    "Responsive Design Patterns",
    "Color Theory for Digital Designers"
  ],
  "data": [
    "SQL Fundamentals",
    "Data Analysis Techniques",
    "Data Visualization Tools",
    "Big Data Processing"
  ],
  "machine learning": [
    "ML Fundamentals",
    "Neural Networks",
    "Natural Language Processing",
    "Computer Vision"
  ]
};

// Generic suggestions when no specific match is found
const DEFAULT_SUGGESTIONS = [
  "Course recommendations for beginners",
  "Advanced learning paths",
  "Most popular tech courses",
  "Career transition guidance"
];

// Learning levels for users to select
const LEARNING_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

// Learning goals templates
const LEARNING_GOALS = [
  "Get a job in tech",
  "Improve current skills",
  "Change career paths",
  "Launch a project/startup",
  "Academic research",
  "Personal interest"
];

export const CourseChat = () => {
  const [message, setMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [learningLevel, setLearningLevel] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle input change and generate suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    if (value.length > 2) {
      const matchedSuggestions: string[] = [];
      
      // Look for topic matches
      Object.entries(TOPIC_SUGGESTIONS).forEach(([topic, topicSuggestions]) => {
        if (value.toLowerCase().includes(topic)) {
          matchedSuggestions.push(...topicSuggestions);
        }
      });
      
      // If we found matches, use them; otherwise, use default suggestions
      setSuggestions(matchedSuggestions.length > 0 ? matchedSuggestions : DEFAULT_SUGGESTIONS);
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
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to use the chat feature.",
        variant: "destructive",
      });
      return;
    }

    const personalizedMessage = generatePersonalizedPrompt(message);
    const userMessage = { role: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setShowSuggestions(false);

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
              content: 'You are a helpful learning assistant that suggests personalized courses and helps users achieve their learning goals. Keep responses focused on educational guidance and motivation. Tailor recommendations based on user\'s learning level and goals when provided.'
            },
            ...messages,
            { role: 'user', content: personalizedMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const assistantMessage = { role: "assistant" as const, content: data.choices[0].message.content };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
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

  // Mobile view uses a Sheet component
  const renderMobileChat = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center md:hidden"
          size="icon"
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-full h-[90vh] flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-center">Learning Assistant</SheetTitle>
        </SheetHeader>
        {renderChatContent()}
      </SheetContent>
    </Sheet>
  );

  // Desktop view shows a fixed chat window
  const renderDesktopChat = () => (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-background border border-border rounded-lg shadow-lg flex flex-col hidden md:flex">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold">Learning Assistant</h3>
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
      {!apiKey && (
        <div className="p-4">
          <input
            type="password"
            placeholder="Enter your Perplexity API key"
            className="w-full p-2 border rounded"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Get your API key from{" "}
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
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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
                  ? "bg-primary text-primary-foreground ml-4"
                  : "bg-muted text-foreground mr-4"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground p-3 rounded-lg animate-pulse">
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
            className="text-xs w-full"
          >
            Clear conversation
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex flex-col gap-2">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Ask about courses or learning goals..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
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
              <div 
                ref={suggestionsRef}
                className="absolute bottom-full mb-1 w-full bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-accent cursor-pointer text-left text-sm border-b last:border-b-0 border-border"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
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
