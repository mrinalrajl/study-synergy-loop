// Gemini API client for frontend
// Usage: import { fetchGemini } from "@/lib/geminiClient";

// Default API key for development - REPLACE WITH YOUR OWN KEY FOR PRODUCTION
// This is just for demo purposes, in a real app you would use environment variables
const DEFAULT_API_KEY = "AIzaSyDEx7VUf4MlLGb61AMVG302MjrqSgyGBBA"; // Demo key with usage limits

export async function fetchGemini(prompt: string, apiKey: string = DEFAULT_API_KEY): Promise<string> {
  try {
    const response = await fetch("http://localhost:5174/api/gemini", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-API-KEY": apiKey 
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error in fetchGemini:", error);
    throw error;
  }
}

export function getGeminiApiKey(): string {
  // Check if a custom key is saved in localStorage
  const customKey = localStorage.getItem('gemini_api_key');
  
  // If a custom key exists and it's not empty, use it
  if (customKey && customKey.trim() !== '') {
    return customKey;
  }
  
  // Otherwise, use the default key
  return DEFAULT_API_KEY;
}

export function setGeminiApiKey(key: string): void {
  if (key && key.trim() !== '') {
    localStorage.setItem('gemini_api_key', key);
  }
}
