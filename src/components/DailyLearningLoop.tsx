import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CARDS = [
  { type: "quote", content: "Learning never exhausts the mind. – Leonardo da Vinci" },
  { type: "flashcard", front: "What is the powerhouse of the cell?", back: "Mitochondria" },
  { type: "video", title: "2-Minute Study Hack", url: "https://www.youtube.com/embed/2vj37yeQQHg" },
];

const getTodayIndex = () => {
  const start = new Date(2025, 0, 1).getTime();
  const today = new Date().getTime();
  return Math.abs(Math.floor((today - start) / (1000 * 60 * 60 * 24))) % CARDS.length;
};

const DailyLearningLoop = () => {
  const [showBack, setShowBack] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastActive, setLastActive] = useState<string | null>(null);
  const todayIdx = getTodayIndex();
  const card = CARDS[todayIdx];

  useEffect(() => {
    const last = localStorage.getItem("daily_last_active");
    const streakVal = parseInt(localStorage.getItem("daily_streak") || "0");
    const todayStr = new Date().toDateString();
    if (last === todayStr) {
      setStreak(streakVal);
    } else if (last && (new Date(todayStr).getTime() - new Date(last).getTime() === 86400000)) {
      setStreak(streakVal + 1);
      localStorage.setItem("daily_streak", (streakVal + 1).toString());
    } else {
      setStreak(1);
      localStorage.setItem("daily_streak", "1");
    }
    setLastActive(todayStr);
    localStorage.setItem("daily_last_active", todayStr);
  }, []);

  return (
    <Card className="mb-4 p-4 bg-background/80">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-primary">Daily Learning</span>
        <span className="text-xs text-muted-foreground">Streak: {streak} days</span>
      </div>
      {card.type === "quote" && (
        <div>
          <blockquote className="italic text-lg">“{card.content}”</blockquote>
        </div>
      )}
      {card.type === "flashcard" && (
        <div className="cursor-pointer" onClick={() => setShowBack((b) => !b)}>
          <div className="text-center text-lg font-medium min-h-[48px]">
            {showBack ? card.back : card.front}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Click to flip</div>
        </div>
      )}
      {card.type === "video" && (
        <div className="aspect-video rounded overflow-hidden mt-2">
          <iframe
            src={card.url}
            title={card.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      )}
    </Card>
  );
};

export default DailyLearningLoop;
