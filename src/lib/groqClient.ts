import { create } from 'zustand';

interface GroqState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGroqStore = create<GroqState>((set) => ({
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

interface GroqConfig {
  baseUrl?: string;
  maxRetries?: number;
  retryDelay?: number;
}

const DEFAULT_CONFIG: GroqConfig = {
  baseUrl: '/api/groq',
  maxRetries: 2,
  retryDelay: 1000,
};

/**
 * Fetches a response from the Groq API
 * @param prompt The prompt to send to Groq
 * @param config Optional configuration for the request
 * @returns The text response from Groq
 */
export async function fetchGroq(prompt: string, config?: Partial<GroqConfig>): Promise<string> {
  const { baseUrl, maxRetries, retryDelay } = { ...DEFAULT_CONFIG, ...config };
  
  // Set loading state to true
  useGroqStore.getState().setLoading(true);
  useGroqStore.getState().setError(null);
  
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API error (${res.status}): ${errorText}`);
      }
      
      const data = await res.json();
      
      // Set loading state to false
      useGroqStore.getState().setLoading(false);
      
      if (data.text) return data.text;
      throw new Error(data.error || "Groq API returned no text");
      
    } catch (error) {
      retries++;
      
      if (retries > maxRetries) {
        // Set error state and loading to false
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        useGroqStore.getState().setError(errorMessage);
        useGroqStore.getState().setLoading(false);
        
        console.error("Groq API error after retries:", error);
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  // This should never be reached due to the throw in the retry loop
  useGroqStore.getState().setLoading(false);
  throw new Error("Groq API request failed after retries");
}

/**
 * Checks if the Groq server is available
 * @returns True if the server is available, false otherwise
 */
export async function checkGroqServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/groq/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch (error) {
    console.error('Groq server health check failed:', error);
    return false;
  }
}