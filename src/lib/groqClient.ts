export async function fetchGroq(prompt: string): Promise<string> {
  const res = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (data.text) return data.text;
  throw new Error(data.error || "Groq API error");
}
