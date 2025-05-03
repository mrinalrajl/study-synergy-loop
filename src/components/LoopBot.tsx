
import React, { useState, useEffect, useRef } from "react";
import { BookUser, Send, X, Minimize2, Maximize2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGemini } from "@/lib/geminiClient";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export interface LoopBotProps {
  onClose?: () => void;
  initialPrompt?: string;
}

export function LoopBot({ onClose, initialPrompt }: LoopBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initial assistant message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hi! I'm LoopBot, your learning assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);

    // If an initial prompt was provided, send it after a delay
    if (initialPrompt) {
      const timer = setTimeout(() => {
        handleSendMessage(initialPrompt);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: "user" as const, content: message, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Use Gemini API through our client
      const prompt = `You are LoopBot, a knowledgeable and friendly learning assistant. You provide helpful, accurate, and concise information about courses, learning paths, and educational resources.
      
      User query: ${message}
      
      Guidelines:
      - Provide personalized course recommendations based on the user's interests
      - Suggest learning paths and next steps
      - Be encouraging and supportive
      - Keep responses concise (max 3-4 sentences)
      - If you don't know something, admit it honestly
      
      Respond:`;
      
      const response = await fetchGemini(prompt);
      
      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, timestamp: new Date() },
      ]);
    } catch (e) {
      console.error("Error getting response:", e);
      setError("There was a problem connecting to the learning assistant. Please try again.");
      toast({
        title: "Connection Error",
        description: "Failed to connect to LoopBot. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 w-80 md:w-96 z-50"
    >
      <Card className="border shadow-lg overflow-hidden bg-purple-500/90 text-white backdrop-blur-md">
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 bg-purple-600/80">
          <CardTitle className="text-base font-medium flex items-center">
            <BookUser className="w-5 h-5 mr-2" />
            LoopBot
            <span className="text-xs ml-2 opacity-80">Your learning assistant</span>
          </CardTitle>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:text-white hover:bg-purple-700/50"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:text-white hover:bg-purple-700/50"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence initial={false}>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-0 max-h-96 overflow-y-auto bg-purple-900/90">
                <div className="space-y-4 p-4">
                  {messages.map((message, i) => (
                    <div key={i} className={`${message.role === "assistant" ? "bg-purple-800/80" : "bg-purple-700/80"} p-3 rounded-lg`}>
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs text-right mt-1 opacity-70">{formatTime(message.timestamp)}</div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="bg-purple-800/80 p-3 rounded-lg animate-pulse">
                      <div className="text-sm">Thinking...</div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-900/90 p-3 rounded-lg">
                      <div className="text-sm">{error}</div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="p-2 border-t border-purple-600">
                <form onSubmit={handleSubmit} className="w-full flex space-x-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-purple-700/40 border-purple-600 text-white placeholder:text-purple-300/70 focus-visible:ring-purple-400"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-purple-700 hover:bg-purple-600 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
