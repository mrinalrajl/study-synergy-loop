
import { useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CourseChat = () => {
  const [message, setMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to use the chat feature.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = { role: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful learning assistant that suggests personalized courses and helps users achieve their learning goals. Keep responses focused on educational guidance and motivation.'
            },
            ...messages,
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const assistantMessage = { role: "assistant" as const, content: data.choices[0].message.content };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-background border border-border rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Learning Assistant</h3>
      </div>

      {!apiKey && (
        <div className="p-4">
          <input
            type="password"
            placeholder="Enter your Perplexity API key"
            className="w-full p-2 border rounded"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Get your API key from{" "}
            <a
              href="https://docs.perplexity.ai/docs/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Perplexity AI
            </a>
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-4"
                  : "bg-muted text-foreground mr-4"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground p-3 rounded-lg animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about courses or learning goals..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
