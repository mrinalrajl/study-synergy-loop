// API utility functions for making requests to the backend

/**
 * Base API URL that changes based on environment
 * In development: uses localhost
 * In production: uses the environment variable or falls back to localhost
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Send a prompt to the Groq API via our backend proxy
 * @param prompt The text prompt to send to Groq
 * @returns The response from Groq
 */
export async function sendPromptToGroq(prompt: string): Promise<{ text: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/groq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from Groq');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending prompt to Groq:', error);
    throw error;
  }
}