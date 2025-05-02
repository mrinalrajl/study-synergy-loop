import React from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface ChatSuggestionsProps {
  message: string;
  selectedIndex?: number;
  onSelectSuggestion: (suggestion: string) => void;
}

const COMMON_SUGGESTIONS = [
  "What courses would you recommend for a beginner in programming?",
  "Can you suggest advanced machine learning courses?",
  "I want to learn web development, where should I start?",
  "What are the best courses for data science?",
  "Recommend business analytics courses",
  "Show me courses about artificial intelligence",
];

export const ChatSuggestions = ({
  message,
  selectedIndex = -1,
  onSelectSuggestion,
}: ChatSuggestionsProps) => {
  const filteredSuggestions = message
    ? COMMON_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(message.toLowerCase())
      )
    : COMMON_SUGGESTIONS;

  if (!filteredSuggestions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute bottom-full left-0 right-0 mb-2 bg-background/95 backdrop-blur-md border border-primary/20 rounded-lg shadow-lg overflow-hidden"
    >
      <div
        className="p-2 max-h-48 overflow-y-auto"
        role="listbox"
        aria-label="Message suggestions"
      >
        {filteredSuggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            onClick={() => onSelectSuggestion(suggestion)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors
              ${
                index === selectedIndex
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-primary/10 focus:bg-primary/10"
              }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            role="option"
            aria-selected={index === selectedIndex}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{suggestion}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
