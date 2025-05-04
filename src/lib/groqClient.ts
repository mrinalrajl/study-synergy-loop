import { create } from 'zustand';

interface GroqState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useGroqStore = create<GroqState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export async function fetchGroq(prompt: string): Promise<string> {
  // Set loading state to true
  useGroqStore.getState().setLoading(true);
  
  try {
    const res = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    
    // Set loading state to false
    useGroqStore.getState().setLoading(false);
    
    if (data.text) return data.text;
    throw new Error(data.error || "Groq API error");
  } catch (error) {
    // Make sure loading state is set to false even if there's an error
    useGroqStore.getState().setLoading(false);
    throw error;
  }
}