
import { useState } from 'react';
import { fetchGroq } from '@/lib/groqClient';
import { fetchUdemyFreeCourses } from '@/lib/udemyApi';
import { useToast } from './use-toast';

export type SearchResult = {
  id: string;
  title: string;
  url: string;
  image: string;
  instructor: string;
  description: string;
  price: string;
  rating: number;
  enrolled: number;
  level?: string;
  category?: string;
  source: 'udemy' | 'ai';
  relevance?: number;
};

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchCourses = async (query: string, preferences: {
    level?: string;
    goal?: string;
    timeframe?: string;
  } = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch courses from Udemy
      const udemyCourses = await fetchUdemyFreeCourses(query);
      
      // Format Udemy results
      const udemyResults: SearchResult[] = udemyCourses.map(course => ({
        ...course,
        source: 'udemy' as const,
      }));

      // Set results immediately for better UX
      setResults(udemyResults);

      // Generate AI recommendations in parallel
      generateAiRecommendations(query, preferences);
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch course results');
      toast({
        title: 'Search Error',
        description: 'Failed to fetch course results. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAiRecommendations = async (query: string, preferences: {
    level?: string;
    goal?: string;
    timeframe?: string;
  } = {}) => {
    try {
      // Create a prompt that includes user preferences
      const preferenceText = Object.entries(preferences)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      const prompt = `I'm looking for course recommendations about "${query}"${
        preferenceText ? ` with these preferences: ${preferenceText}` : ''
      }. Please suggest 5 course titles and brief descriptions that would help me learn this topic effectively. Format as a numbered list with just the title and a one-sentence description for each.`;

      // Get AI recommendations
      const aiResponse = await fetchGroq(prompt);
      
      // Parse the response into separate suggestions
      const suggestions = aiResponse
        .split(/\d+\./)
        .map(item => item.trim())
        .filter(Boolean)
        .slice(0, 5);

      setAiSuggestions(suggestions);

    } catch (err) {
      console.error('AI recommendation error:', err);
      // Don't show an error toast for AI failure - we already have Udemy results
    }
  };

  return {
    results,
    aiSuggestions,
    isLoading,
    error,
    searchCourses
  };
}
