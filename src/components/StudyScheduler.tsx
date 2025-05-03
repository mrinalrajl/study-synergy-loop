import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const StudyScheduler = () => {
  const [date, setDate] = useState<Date | undefined>(() => {
    const saved = localStorage.getItem("study_date");
    return saved ? new Date(saved) : undefined;
  });

  const saveDate = (d: Date | undefined) => {
    setDate(d);
    if (d) localStorage.setItem("study_date", d.toISOString());
  };

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2">Study Scheduler</div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={saveDate}
        className="rounded border"
      />
      <div className="mt-2 text-xs text-muted-foreground">
        {date ? `Next study session: ${date.toLocaleDateString()}` : "No study session scheduled."}
      </div>
      <Button size="sm" className="mt-2" onClick={() => saveDate(undefined)}>
        Clear
      </Button>
    </Card>
  );
};

export default StudyScheduler;
