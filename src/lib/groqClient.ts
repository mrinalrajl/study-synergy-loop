import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface GroqState {
  isLoading: boolean;
  error: string | null;
  userId: string;
  conversationId: string | null;
  previousMessages: Array<{ role: string; content: string }>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUserId: (userId: string) => void;
  setConversationId: (conversationId: string | null) => void;
  addMessage: (role: string, content: string) => void;
  clearMessages: () => void;
}

// Generate a random user ID if none exists in localStorage
const getOrCreateUserId = (): string => {
  const storedUserId = localStorage.getItem('groq_user_id');
  if (storedUserId) return storedUserId;
  
  const newUserId = uuidv4();
  localStorage.setItem('groq_user_id', newUserId);
  return newUserId;
};

export const useGroqStore = create<GroqState>((set) => ({
  isLoading: false,
  error: null,
  userId: getOrCreateUserId(),
  conversationId: null,
  previousMessages: [],
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setUserId: (userId) => {
    localStorage.setItem('groq_user_id', userId);
    set({ userId });
  },
  setConversationId: (conversationId) => set({ conversationId }),
  addMessage: (role, content) => set((state) => ({
    previousMessages: [...state.previousMessages, { role, content }]
  })),
  clearMessages: () => set({ previousMessages: [] })
}));

interface GroqConfig {
  baseUrl?: string;
  maxRetries?: number;
  retryDelay?: number;
  includeHistory?: boolean;
}

const DEFAULT_CONFIG: GroqConfig = {
  baseUrl: '/api/groq',
  maxRetries: 2,
  retryDelay: 1000,
  includeHistory: true,
};

/**
 * Fetches a response from the Groq API
 * @param prompt The prompt to send to Groq
 * @param config Optional configuration for the request
 * @returns The text response from Groq
 */
export async function fetchGroq(prompt: string, config?: Partial<GroqConfig>): Promise<string> {
  const { baseUrl, maxRetries, retryDelay, includeHistory } = { ...DEFAULT_CONFIG, ...config };
  const state = useGroqStore.getState();
  
  // Set loading state to true
  state.setLoading(true);
  state.setError(null);
  
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      // Prepare request payload
      const payload: any = { 
        prompt,
        userId: state.userId
      };
      
      // Include conversation history if enabled
      if (includeHistory && state.previousMessages.length > 0) {
        payload.previousMessages = state.previousMessages;
      }
      
      // Include conversation ID if available
      if (state.conversationId) {
        payload.conversationId = state.conversationId;
      }
      
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API error (${res.status}): ${errorText}`);
      }
      
      const data = await res.json();
      
      // Add the messages to the store for conversation history
      state.addMessage('user', prompt);
      if (data.text) {
        state.addMessage('assistant', data.text);
      }
      
      // Set loading state to false
      state.setLoading(false);
      
      if (data.text) return data.text;
      throw new Error(data.error || "Groq API returned no text");
      
    } catch (error) {
      retries++;
      
      if (retries > maxRetries) {
        // Set error state and loading to false
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        state.setError(errorMessage);
        state.setLoading(false);
        
        console.error("Groq API error after retries:", error);
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  // This should never be reached due to the throw in the retry loop
  state.setLoading(false);
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

/**
 * Fetches chat history for the current user
 * @param limit Maximum number of messages to fetch
 * @returns Array of chat messages
 */
export async function fetchChatHistory(limit: number = 50): Promise<any[]> {
  const userId = useGroqStore.getState().userId;
  
  try {
    const res = await fetch(`/api/chat/history/${userId}?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch chat history: ${res.status}`);
    }
    
    const data = await res.json();
    return data.history || [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

/**
 * Clears chat history for the current user
 * @returns True if successful, false otherwise
 */
export async function clearChatHistory(): Promise<boolean> {
  const userId = useGroqStore.getState().userId;
  
  try {
    const res = await fetch(`/api/chat/history/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to clear chat history: ${res.status}`);
    }
    
    // Also clear local message history
    useGroqStore.getState().clearMessages();
    
    return true;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }
}

/**
 * Saves user preferences
 * @param preferences User preferences object
 * @returns True if successful, false otherwise
 */
export async function saveUserPreferences(preferences: {
  preferredModel?: 'groq' | 'gemini';
  learningLevel?: string;
  learningGoal?: string;
}): Promise<boolean> {
  const userId = useGroqStore.getState().userId;
  
  try {
    const res = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...preferences
      }),
    });
    
    return res.ok;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
}

/**
 * Fetches user preferences
 * @returns User preferences object or null if not found
 */
export async function getUserPreferences(): Promise<any | null> {
  const userId = useGroqStore.getState().userId;
  
  try {
    const res = await fetch(`/api/user/preferences/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.preferences;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
}