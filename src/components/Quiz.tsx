import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    answer: 2,
    explanation: "Paris is the capital of France."
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1,
    explanation: "Mars is called the Red Planet due to its reddish appearance."
  }
];

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setShowExplanation(true);
    if (idx === QUESTIONS[current].answer) {
      setScore(s => s + 1);
      if (current === QUESTIONS.length - 1) {
        localStorage.setItem("quiz_master", "true");
      }
    }
  };

  const next = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  return (
    <Card className="p-4 bg-background/80">
      <div className="font-semibold mb-2">Quiz</div>
      {completed ? (
        <div>
          <div className="mb-2">Quiz complete! Your score: {score}/{QUESTIONS.length}</div>
          <Button size="sm" onClick={() => { setCurrent(0); setScore(0); setCompleted(false); setSelected(null); setShowExplanation(false); }}>Restart</Button>
        </div>
      ) : (
        <div>
          <div className="mb-2 font-medium">{QUESTIONS[current].question}</div>
          <div className="space-y-2 mb-2">
            {QUESTIONS[current].options.map((opt, i) => (
              <Button
                key={i}
                size="sm"
                variant={selected === i ? (i === QUESTIONS[current].answer ? "default" : "destructive") : "outline"}
                className="w-full text-left"
                onClick={() => selected === null && handleSelect(i)}
                disabled={selected !== null}
              >
                {opt}
              </Button>
            ))}
          </div>
          {showExplanation && (
            <div className="text-xs text-muted-foreground mb-2">{QUESTIONS[current].explanation}</div>
          )}
          <Button size="sm" onClick={next} disabled={selected === null}>
            {current === QUESTIONS.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Quiz;
