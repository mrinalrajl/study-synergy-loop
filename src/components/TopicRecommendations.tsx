import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

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

  useEffect(() => {
    // Simple recommendation: filter out completed topics
    setRecommended(TOPICS.filter(t => !completed.includes(t.topic)));
  }, [completed]);

  const markComplete = (topic: string) => {
    const updated = [...completed, topic];
    setCompleted(updated);
    localStorage.setItem("completed_topics", JSON.stringify(updated));
  };

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2">Recommended Topics</div>
      <ul className="space-y-2">
        {recommended.length === 0 && <li className="text-xs text-muted-foreground">All topics completed!</li>}
        {recommended.map((t, i) => (
          <li key={i} className="flex justify-between items-center bg-background/60 rounded px-2 py-1">
            <span>{t.topic} <span className="text-xs text-muted-foreground">({t.tag})</span></span>
            <button className="text-xs text-primary underline" onClick={() => markComplete(t.topic)}>
              Mark Complete
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default TopicRecommendations;