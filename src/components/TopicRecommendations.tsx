import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { fetchGemini } from "@/lib/geminiClient";

const TOPICS = [
  { topic: "React Basics", tag: "beginner" },
  { topic: "Advanced React Patterns", tag: "advanced" },
  { topic: "Machine Learning 101", tag: "beginner" },
  { topic: "Async/Await in JS", tag: "intermediate" },
  { topic: "Financial Modeling", tag: "intermediate" }
];

const TopicRecommendations = () => {
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("completed_topics") || "[]");
    } catch {
      return [];
    }
  });
  const [recommended, setRecommended] = useState(TOPICS);
  const [aiTopics, setAiTopics] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const fallbackTopics = [
    "1. TypeScript Basics (beginner)",
    "2. Deep Learning (advanced)",
    "3. UI/UX Design (intermediate)",
    "4. Blockchain Essentials (beginner)",
    "5. Cloud Security (advanced)"
  ];

  useEffect(() => {
    // Simple recommendation: filter out completed topics
    setRecommended(TOPICS.filter(t => !completed.includes(t.topic)));
  }, [completed]);

  const markComplete = (topic: string) => {
    const updated = [...completed, topic];
    setCompleted(updated);
    localStorage.setItem("completed_topics", JSON.stringify(updated));
  };

  const handleAIRecommend = async () => {
    setIsLoadingAI(true);
    setAiTopics([]);
    try {
      const prompt = `Suggest 5 personalized learning topics for a user interested in upskilling. Format as a list with topic and a short tag (e.g., beginner, advanced, etc).`;
      const aiText = await fetchGemini(prompt);
      console.log("Gemini raw response:", aiText); // Debug log
      const lines = aiText.split(/\n|\r/).filter(Boolean).slice(0, 5);
      setAiTopics(lines.length ? lines : fallbackTopics);
    } catch (err) {
      setAiTopics(fallbackTopics);
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    if (useAI) handleAIRecommend();
  }, [useAI]);

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2 flex items-center justify-between">
        <span>Recommended Topics</span>
        <button
          className="text-xs text-primary underline"
          onClick={() => setUseAI((v) => !v)}
        >
          {useAI ? (isLoadingAI ? "Loading..." : "Standard") : "AI"}
        </button>
      </div>
      <ul className="space-y-2">
        {useAI ? (
          isLoadingAI ? (
            <li className="text-xs text-muted-foreground">Loading AI topics...</li>
          ) : aiTopics.length > 0 ? (
            aiTopics.map((t, i) => (
              <li key={i} className="flex justify-between items-center bg-background/60 rounded px-2 py-1">
                <span>{t}</span>
              </li>
            ))
          ) : (
            <li className="text-xs text-muted-foreground">No AI topics found.</li>
          )
        ) : (
          recommended.length === 0 ? (
            <li className="text-xs text-muted-foreground">All topics completed!</li>
          ) : (
            recommended.map((t, i) => (
              <li key={i} className="flex justify-between items-center bg-background/60 rounded px-2 py-1">
                <span>{t.topic} <span className="text-xs text-muted-foreground">({t.tag})</span></span>
                <button className="text-xs text-primary underline" onClick={() => markComplete(t.topic)}>
                  Mark Complete
                </button>
              </li>
            ))
          )
        )}
      </ul>
    </Card>
  );
};

export default TopicRecommendations;