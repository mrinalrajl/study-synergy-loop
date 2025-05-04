import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Learning style types
export type LearningStyle = "visual" | "auditory" | "reading" | "kinesthetic" | null;

// Learning style descriptions
const LEARNING_STYLE_DESCRIPTIONS = {
  visual: "You learn best through images, diagrams, and spatial understanding. Visual content like videos, charts, and infographics work well for you.",
  auditory: "You learn best through listening and speaking. Audio lectures, discussions, and verbal explanations are most effective for you.",
  reading: "You learn best through text-based materials. Books, articles, and written instructions work well for your learning style.",
  kinesthetic: "You learn best through hands-on experiences. Interactive exercises, practical applications, and physical activities enhance your learning."
};

// Assessment questions
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "When learning something new, I prefer to:",
    options: [
      { value: "visual", label: "See diagrams or watch demonstrations" },
      { value: "auditory", label: "Listen to explanations and discuss concepts" },
      { value: "reading", label: "Read detailed instructions or explanations" },
      { value: "kinesthetic", label: "Try it out hands-on and learn by doing" }
    ]
  },
  {
    id: 2,
    question: "When trying to remember information, I most easily recall:",
    options: [
      { value: "visual", label: "Images, diagrams, and how things looked" },
      { value: "auditory", label: "Conversations and what was said" },
      { value: "reading", label: "Written notes and text I've read" },
      { value: "kinesthetic", label: "Activities I performed and practiced" }
    ]
  },
  {
    id: 3,
    question: "When explaining a concept to someone else, I tend to:",
    options: [
      { value: "visual", label: "Draw a diagram or show visual examples" },
      { value: "auditory", label: "Explain verbally with detailed descriptions" },
      { value: "reading", label: "Write out the explanation or refer to written materials" },
      { value: "kinesthetic", label: "Demonstrate through actions or interactive examples" }
    ]
  },
  {
    id: 4,
    question: "I find it easiest to follow:",
    options: [
      { value: "visual", label: "Visual instructions with diagrams and images" },
      { value: "auditory", label: "Verbal instructions and explanations" },
      { value: "reading", label: "Written instructions and step-by-step guides" },
      { value: "kinesthetic", label: "Demonstrations that I can practice alongside" }
    ]
  },
  {
    id: 5,
    question: "When I'm bored, I'm most likely to:",
    options: [
      { value: "visual", label: "Doodle, watch videos, or look at images" },
      { value: "auditory", label: "Talk to someone or listen to music" },
      { value: "reading", label: "Read something interesting" },
      { value: "kinesthetic", label: "Fidget, move around, or do something active" }
    ]
  }
];

interface LearningStyleAssessmentProps {
  onComplete?: (style: LearningStyle) => void;
  className?: string;
}

export function LearningStyleAssessment({ onComplete, className = "" }: LearningStyleAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, LearningStyle>>({});
  const [result, setResult] = useState<LearningStyle>(null);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();
  const { user, updateUserProfile } = useAuth();

  const handleAnswer = (value: LearningStyle) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    // Count occurrences of each learning style
    const counts: Record<string, number> = {
      visual: 0,
      auditory: 0,
      reading: 0,
      kinesthetic: 0
    };

    Object.values(answers).forEach(style => {
      if (style) counts[style]++;
    });

    // Find the dominant learning style
    let dominantStyle: LearningStyle = null;
    let maxCount = 0;

    Object.entries(counts).forEach(([style, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantStyle = style as LearningStyle;
      }
    });

    setResult(dominantStyle);
    setShowResult(true);

    // Save to user profile if available
    if (user && updateUserProfile) {
      updateUserProfile({
        learningStyle: dominantStyle
      });
    }

    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(dominantStyle);
    }

    toast({
      title: "Assessment Complete!",
      description: `Your dominant learning style is: ${dominantStyle?.charAt(0).toUpperCase() + dominantStyle?.slice(1)}`,
    });
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl">Learning Style Assessment</CardTitle>
        <CardDescription>
          Discover your preferred learning style to get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showResult ? (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">
                Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
              </h3>
              <div className="h-2 w-full bg-secondary/20 rounded-full">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            
            <p className="text-lg mb-4">{ASSESSMENT_QUESTIONS[currentQuestion].question}</p>
            
            <RadioGroup 
              value={answers[currentQuestion] || ""} 
              className="space-y-3"
            >
              {ASSESSMENT_QUESTIONS[currentQuestion].options.map((option, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all"
                  onClick={() => handleAnswer(option.value as LearningStyle)}
                >
                  <RadioGroupItem value={option.value} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-primary/20 mb-4">
                {result === "visual" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
                {result === "auditory" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 10c0-3.9 3.1-7 7-7s7 3.1 7 7v4c0 3.9-3.1 7-7 7s-7-3.1-7-7v-4z"></path><line x1="10" y1="8" x2="14" y2="8"></line><line x1="10" y1="12" x2="14" y2="12"></line><line x1="10" y1="16" x2="14" y2="16"></line></svg>
                )}
                {result === "reading" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                )}
                {result === "kinesthetic" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><path d="m4.9 4.9 14.2 14.2"></path><path d="m19.1 4.9-14.2 14.2"></path></svg>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">
                Your Learning Style: {result?.charAt(0).toUpperCase() + result?.slice(1)}
              </h3>
              <p className="text-muted-foreground">
                {result && LEARNING_STYLE_DESCRIPTIONS[result]}
              </p>
            </div>
            
            <div className="bg-secondary/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recommended Content Types:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {result === "visual" && (
                  <>
                    <li>Video tutorials with visual demonstrations</li>
                    <li>Infographics and diagrams</li>
                    <li>Mind maps and visual summaries</li>
                    <li>Courses with strong visual components</li>
                  </>
                )}
                {result === "auditory" && (
                  <>
                    <li>Audio lectures and podcasts</li>
                    <li>Discussion-based courses</li>
                    <li>Verbal explanations and tutorials</li>
                    <li>Group study sessions with verbal exchange</li>
                  </>
                )}
                {result === "reading" && (
                  <>
                    <li>Text-based tutorials and documentation</li>
                    <li>Books and comprehensive articles</li>
                    <li>Written step-by-step guides</li>
                    <li>Note-taking focused courses</li>
                  </>
                )}
                {result === "kinesthetic" && (
                  <>
                    <li>Interactive exercises and hands-on projects</li>
                    <li>Practice-based learning</li>
                    <li>Simulations and real-world applications</li>
                    <li>Courses with practical components</li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showResult ? (
          <>
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
            </div>
            {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 && (
              <Button onClick={calculateResult} disabled={!answers[currentQuestion]}>
                Complete
              </Button>
            )}
          </>
        ) : (
          <Button onClick={handleRestart} variant="outline" className="ml-auto">
            Retake Assessment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}