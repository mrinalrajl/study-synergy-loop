
import React from "react";
import { TOPIC_SUGGESTIONS, DEFAULT_SUGGESTIONS } from "@/utils/courseData";

interface ChatSuggestionsProps {
  message: string;
  onSelectSuggestion: (suggestion: string) => void;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  message,
  onSelectSuggestion
}) => {
  // Generate suggestions based on the current message
  const generateSuggestions = (): string[] => {
    if (message.length <= 2) return [];
    
    const matchedSuggestions: string[] = [];
    
    // Look for topic matches
    Object.entries(TOPIC_SUGGESTIONS).forEach(([topic, topicSuggestions]) => {
      if (message.toLowerCase().includes(topic.toLowerCase())) {
        matchedSuggestions.push(...topicSuggestions.slice(0, 5)); // Limit to 5 suggestions per topic
      }
    });
    
    // If we found matches, use them; otherwise, use default suggestions
    return matchedSuggestions.length > 0 ? matchedSuggestions : DEFAULT_SUGGESTIONS;
  };

  const suggestions = generateSuggestions();
  
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full mb-1 w-full bg-background/90 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="p-2 hover:bg-primary/10 cursor-pointer text-left text-sm border-b last:border-b-0 border-border"
          onClick={() => onSelectSuggestion(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};
