/**
 * Unified AI Service Interface
 * 
 * This service provides a unified interface for making AI requests to either Groq or Gemini.
 * It handles fallback logic, error handling, and configuration.
 */

import { fetchGroq, checkGroqServerHealth } from './groqClient';
import { fetchGemini, getGeminiApiKey } from './geminiClient';

// AI Service configuration
export interface AIServiceConfig {
  preferredService: 'groq' | 'gemini';
  enableFallback: boolean;
  maxRetries: number;
  timeout: number;
  cacheResponses: boolean;
}

// Default configuration
const DEFAULT_CONFIG: AIServiceConfig = {
  preferredService: 'groq', // Prefer Groq by default
  enableFallback: true,     // Fall back to the other service if preferred fails
  maxRetries: 3,            // Increased number of retries before falling back
  timeout: 30000,           // Increased timeout in milliseconds
  cacheResponses: true,     // Cache responses to improve responsiveness
};

// Current configuration (can be updated at runtime)
let currentConfig: AIServiceConfig = { ...DEFAULT_CONFIG };

// Simple cache for responses
interface CacheEntry {
  response: string;
  timestamp: number;
}
const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache TTL

/**
 * Updates the AI service configuration
 * @param config Partial configuration to update
 */
export function configureAIService(config: Partial<AIServiceConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Gets the current AI service configuration
 * @returns The current configuration
 */
export function getAIServiceConfig(): AIServiceConfig {
  return { ...currentConfig };
}

/**
 * Makes an AI request using the configured service(s)
 * @param prompt The prompt to send to the AI
 * @param config Optional configuration override for this request
 * @returns The AI response text
 */
export async function fetchAI(prompt: string, config?: Partial<AIServiceConfig>): Promise<string> {
  // Merge default config with any request-specific config
  const requestConfig = { ...currentConfig, ...config };
  
  // Check cache first if caching is enabled
  if (requestConfig.cacheResponses) {
    const cacheKey = prompt.trim();
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL) {
      console.log('Using cached AI response');
      return cachedResponse.response;
    }
  }
  
  // Try the preferred service first
  try {
    let response: string;
    
    if (requestConfig.preferredService === 'groq') {
      response = await fetchWithRetries(() => fetchGroq(prompt), requestConfig.maxRetries, 1000);
    } else {
      response = await fetchWithRetries(() => fetchGemini(prompt), requestConfig.maxRetries, 1000);
    }
    
    // Cache the successful response if caching is enabled
    if (requestConfig.cacheResponses) {
      responseCache.set(prompt.trim(), {
        response,
        timestamp: Date.now()
      });
    }
    
    return response;
  } catch (primaryError) {
    console.error(`Error with primary AI service (${requestConfig.preferredService}):`, primaryError);
    
    // If fallback is enabled, try the other service
    if (requestConfig.enableFallback) {
      try {
        console.log('Falling back to secondary AI service...');
        let response: string;
        
        if (requestConfig.preferredService === 'groq') {
          response = await fetchWithRetries(() => fetchGemini(prompt), requestConfig.maxRetries, 1000);
        } else {
          response = await fetchWithRetries(() => fetchGroq(prompt), requestConfig.maxRetries, 1000);
        }
        
        // Cache the successful fallback response if caching is enabled
        if (requestConfig.cacheResponses) {
          responseCache.set(prompt.trim(), {
            response,
            timestamp: Date.now()
          });
        }
        
        return response;
      } catch (fallbackError) {
        console.error('Error with fallback AI service:', fallbackError);
        throw new Error(`Both AI services failed. Primary error: ${primaryError}. Fallback error: ${fallbackError}`);
      }
    }
    
    // If no fallback or fallback failed, rethrow the original error
    throw primaryError;
  }
}

/**
 * Helper function to retry a function multiple times
 * @param fn The function to retry
 * @param maxRetries Maximum number of retries
 * @param delay Delay between retries in ms
 * @returns The result of the function
 */
async function fetchWithRetries<T>(fn: () => Promise<T>, maxRetries: number, delay: number): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying, with exponential backoff
        const retryDelay = delay * Math.pow(1.5, attempt);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Checks the health of the AI services
 * @returns Object containing health status of each service
 */
export async function checkAIServicesHealth(): Promise<{groq: boolean, gemini: boolean}> {
  // Check Groq health
  let groqHealth = false;
  try {
    groqHealth = await checkGroqServerHealth();
  } catch (error) {
    console.error('Error checking Groq health:', error);
  }
  
  // Check Gemini health (simplified check - just verifies API key exists)
  let geminiHealth = false;
  try {
    geminiHealth = !!getGeminiApiKey();
  } catch (error) {
    console.error('Error checking Gemini health:', error);
  }
  
  return {
    groq: groqHealth,
    gemini: geminiHealth
  };
}

/**
 * Automatically selects the best available AI service based on health checks
 */
export async function autoSelectBestAIService(): Promise<void> {
  const health = await checkAIServicesHealth();
  
  if (health.groq) {
    configureAIService({ preferredService: 'groq' });
    console.log('Auto-selected Groq as preferred AI service');
  } else if (health.gemini) {
    configureAIService({ preferredService: 'gemini' });
    console.log('Auto-selected Gemini as preferred AI service');
  } else {
    console.warn('No healthy AI services detected. Using default configuration.');
  }
}

/**
 * Clears the response cache
 */
export function clearResponseCache(): void {
  responseCache.clear();
  console.log('AI response cache cleared');
}

/**
 * Fetch YouTube video details using YouTube Data API v3 or Groq API fallback
 * @param videoUrl The URL of the YouTube video
 * @returns The video details (title and description) or null if not found
 */
export async function fetchYouTubeDetails(videoUrl: string): Promise<{ title: string; description: string } | null> {
  try {
    // Extract video ID from URL
    const match = videoUrl.match(/[?&]v=([^&#]+)/) || videoUrl.match(/youtu\.be\/([^?&#]+)/);
    const videoId = match ? match[1] : null;
    if (!videoId) return null;

    // Try YouTube Data API first
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
    if (apiKey) {
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const snippet = data.items[0].snippet;
        return { title: snippet.title, description: snippet.description };
      }
    }

    // Fallback: Use Groq API to extract video details
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
    if (groqApiKey) {
      const groqRes = await fetch("/api/groq/youtube-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({ videoId }),
      });
      if (groqRes.ok) {
        const groqData = await groqRes.json();
        if (groqData.title && groqData.description) {
          return { title: groqData.title, description: groqData.description };
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}