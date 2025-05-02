import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEMO_GROUPS = [
  { name: "AI & ML Study Group", members: 5 },
  { name: "React Learners", members: 8 },
  { name: "Finance Prep", members: 3 }
];

const StudyGroups = () => {
  const [joined, setJoined] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2">Study Groups</div>
      <ul className="space-y-2 mb-2">
        {DEMO_GROUPS.map((g, i) => (
          <li key={g.name} className="flex justify-between items-center">
            <span>{g.name} <span className="text-xs text-muted-foreground">({g.members} members)</span></span>
            <Button size="sm" onClick={() => setJoined(i)} disabled={joined === i}>
              {joined === i ? "Joined" : "Join"}
            </Button>
          </li>
        ))}
      </ul>
      {joined !== null && (
        <div className="mt-2">
          <Button size="sm" onClick={() => setShowVideo(v => !v)}>
            {showVideo ? "Hide Video Room" : "Join Video Room"}
          </Button>
          {showVideo && (
            <div className="mt-2 text-xs text-muted-foreground">
              {/* Placeholder for WebRTC video integration */}
              <div className="w-full aspect-video bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center rounded">
                <span>Video Room (WebRTC integration demo)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default StudyGroups;
