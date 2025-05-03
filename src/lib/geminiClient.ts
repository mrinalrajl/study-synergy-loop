// Gemini API client for frontend
// Usage: import { fetchGemini } from "@/lib/geminiClient";
export async function fetchGemini(prompt: string): Promise<string> {
  const response = await fetch("http://localhost:5174/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error("Gemini API error");
  const data = await response.json();
  return data.text;
}
