import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star } from "lucide-react";

const BADGES = [
  { icon: <Flame className="text-orange-500" />, label: "3-Day Streak" },
  { icon: <Trophy className="text-yellow-500" />, label: "Quiz Master" },
  { icon: <Star className="text-blue-500" />, label: "Topic Expert" },
];

const Achievements = () => {
  const [earned, setEarned] = useState([false, false, false]);

  useEffect(() => {
    // Example: unlock badges based on localStorage progress
    const streak = parseInt(localStorage.getItem("daily_streak") || "0");
    setEarned([
      streak >= 3,
      (localStorage.getItem("quiz_master") === "true"),
      (localStorage.getItem("topic_expert") === "true"),
    ]);
  }, []);

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2">Achievements</div>
      <div className="flex flex-wrap gap-2">
        {BADGES.map((badge, i) => (
          <Badge key={badge.label} variant={earned[i] ? "default" : "outline"} className="flex items-center gap-1">
            {badge.icon}
            {badge.label}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default Achievements;
