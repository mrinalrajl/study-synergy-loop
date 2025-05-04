import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw } from "lucide-react";
import { 
  generateQuizQuestions, 
  saveQuizResult, 
  getLastQuizTopic,
  getQuizStatistics,
  QuizQuestion 
} from "@/lib/quizService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuizProps {
  initialTopic?: string;
  questionCount?: number;
}

const Quiz = ({ initialTopic, questionCount = 5 }: QuizProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState(initialTopic || getLastQuizTopic() || "");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced" | "mixed">("mixed");
  const [count, setCount] = useState(questionCount);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState(getQuizStatistics());

  // Generate questions when component mounts or when topic/difficulty/count changes
  useEffect(() => {
    if (initialTopic && !questions.length) {
      loadQuestions(initialTopic);
    }
  }, [initialTopic]);

  const loadQuestions = async (quizTopic: string) => {
    if (!quizTopic) {
      setError("Please enter a topic");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newQuestions = await generateQuizQuestions(quizTopic, count, difficulty);
      setQuestions(newQuestions);
      resetQuiz();
    } catch (err) {
      console.error("Failed to generate quiz questions:", err);
      setError("Failed to generate quiz questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[current].answer) {
      setScore(s => s + 1);
    }
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      // Save quiz result
      saveQuizResult(topic, score + (selected === questions[current].answer ? 1 : 0), questions.length);
      // Update stats
      setStats(getQuizStatistics());
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setCompleted(false);
    setSelected(null);
    setShowExplanation(false);
  };

  const generateNewQuiz = () => {
    loadQuestions(topic);
  };

  return (
    <Card className="bg-background/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Quiz Challenge</span>
          {stats.totalQuizzes > 0 && (
            <span className="text-xs text-muted-foreground">
              Avg Score: {stats.averageScore}% | Quizzes: {stats.totalQuizzes}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quiz Topic</label>
              <Input 
                placeholder="Enter a topic (e.g., JavaScript, Machine Learning)" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Questions</label>
                <Select value={count.toString()} onValueChange={(value) => setCount(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Number of questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Questions</SelectItem>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <Button 
              className="w-full" 
              onClick={() => loadQuestions(topic)}
              disabled={isLoading || !topic}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                "Generate Quiz"
              )}
            </Button>
            
            {stats.recentTopics.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Recent Topics</div>
                <div className="flex flex-wrap gap-2">
                  {stats.recentTopics.map((recentTopic, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setTopic(recentTopic);
                        loadQuestions(recentTopic);
                      }}
                    >
                      {recentTopic}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <div className="text-sm text-muted-foreground">Generating your quiz questions...</div>
          </div>
        ) : completed ? (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <div className="text-xl font-bold mb-1">Quiz Complete!</div>
              <div className="text-lg">Your score: {score}/{questions.length}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {score === questions.length 
                  ? "Perfect score! Amazing job! 🎉" 
                  : score >= questions.length / 2 
                    ? "Good job! Keep learning! 👍" 
                    : "Keep practicing to improve! 💪"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => { resetQuiz(); }}
              >
                Retry Quiz
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={generateNewQuiz}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Question {current + 1} of {questions.length}</div>
              <div className="text-sm font-medium">Score: {score}</div>
            </div>
            
            <div className="font-medium">{questions[current].question}</div>
            
            <div className="space-y-2">
              {questions[current].options.map((opt, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={selected === i 
                    ? (i === questions[current].answer ? "default" : "destructive") 
                    : "outline"
                  }
                  className="w-full text-left justify-start"
                  onClick={() => selected === null && handleSelect(i)}
                  disabled={selected !== null}
                >
                  {opt}
                </Button>
              ))}
            </div>
            
            {showExplanation && (
              <div className="text-sm p-2 bg-muted/50 rounded-md">
                {questions[current].explanation}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateNewQuiz}
                disabled={!completed}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                New Quiz
              </Button>
              <Button 
                size="sm" 
                onClick={next} 
                disabled={selected === null}
              >
                {current === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Quiz;