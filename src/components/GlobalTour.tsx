import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { BookOpen, Star, Trophy, Brain, Calendar, Users, Sparkles, BookUser } from 'lucide-react';
import { TourFeedback } from './TourFeedback';

const TOUR_STEPS = [
  {
    title: "Welcome to Study Synergy Loop!",
    description: "Your personalized learning journey begins here. Let's explore all the features that will help you succeed!",
    icon: <Sparkles className="h-12 w-12 text-primary animate-pulse" />,
    target: null
  },
  {
    title: "Course Discovery",
    description: "Browse featured courses, filter by category, and find the perfect match for your goals.",
    icon: <BookOpen className="h-12 w-12 text-primary" />,
    target: ".featured-courses"
  },
  {
    title: "Personalized Learning Hub",
    description: "Set your learning preferences, goals, and get AI-powered course recommendations.",
    icon: <Brain className="h-12 w-12 text-primary" />,
    target: ".personalized-learning"
  },
  {
    title: "Daily Learning Loop",
    description: "Track your daily progress, complete challenges, and maintain your learning streak.",
    icon: <Calendar className="h-12 w-12 text-primary" />,
    target: ".daily-learning"
  },
  {
    title: "Interactive Study Tools",
    description: "Access quizzes, flashcards, and practice exercises to reinforce your learning.",
    icon: <BookUser className="h-12 w-12 text-primary" />,
    target: ".study-tools"
  },
  {
    title: "Community & Progress",
    description: "Join study groups, compete on the leaderboard, and share your achievements.",
    icon: <Users className="h-12 w-12 text-primary" />,
    target: ".community-section"
  },
  {
    title: "AI Learning Assistant",
    description: "Meet your personal AI tutor! Get instant help, course recommendations, and learning guidance 24/7.",
    icon: <Sparkles className="h-12 w-12 text-primary" />,
    target: ".CourseChat"
  },
  {
    title: "Achievement Center",
    description: "Track your certifications, badges, and overall learning progress.",
    icon: <Trophy className="h-12 w-12 text-primary" />,
    target: ".achievements"
  },
  {
    title: "Ready to Start!",
    description: "You're all set to begin your learning journey. Remember, you can always revisit this tour from your profile settings.",
    icon: <Star className="h-12 w-12 text-primary" />,
    target: null
  }
];

export const GlobalTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenAppTour');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const completeTour = () => {
    setShowFeedback(true);
  };

  const finalizeTour = () => {
    setIsVisible(false);
    setShowFeedback(false);
    localStorage.setItem('hasSeenAppTour', 'true');
  };

  const highlightTarget = (target: string | null) => {
    if (!target) return;
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-target');
      element.setAttribute('aria-label', `Currently highlighting: ${TOUR_STEPS[currentStep].title}`);
      element.setAttribute('role', 'region');
      return () => {
        element.classList.remove('highlight-target');
        element.removeAttribute('aria-label');
        element.removeAttribute('role');
      };
    }
  };

  useEffect(() => {
    if (isVisible) {
      const cleanup = highlightTarget(TOUR_STEPS[currentStep].target);
      return () => cleanup?.();
    }
  }, [currentStep, isVisible]);

  useEffect(() => {
    if (isVisible) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(s => s + 1);
          } else if (!showFeedback) {
            completeTour();
          }
        } else if (e.key === 'ArrowLeft') {
          if (currentStep > 0) {
            setCurrentStep(s => s - 1);
          }
        } else if (e.key === 'Escape') {
          finalizeTour();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isVisible, currentStep, showFeedback]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        {showFeedback ? (
          <TourFeedback onClose={finalizeTour} />
        ) : (
          <motion.div
            key={currentStep}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-card border border-primary/20 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center space-y-4">
              <div className="tour-icon">
                {TOUR_STEPS[currentStep].icon}
              </div>
              <h2 id="tour-title" className="text-2xl font-bold">{TOUR_STEPS[currentStep].title}</h2>
              <p className="text-muted-foreground">{TOUR_STEPS[currentStep].description}</p>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : finalizeTour()}
                aria-label={currentStep === 0 ? "Skip tour" : "Go to previous step"}
              >
                {currentStep === 0 ? "Skip Tour" : "Previous"}
              </Button>
              <Button
                onClick={() => currentStep < TOUR_STEPS.length - 1 ? setCurrentStep(s => s + 1) : completeTour()}
                aria-label={currentStep === TOUR_STEPS.length - 1 ? "Complete tour" : "Go to next step"}
              >
                {currentStep === TOUR_STEPS.length - 1 ? "Complete Tour" : "Next"}
              </Button>
            </div>

            <div className="flex justify-center mt-4 gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={TOUR_STEPS.length} aria-valuenow={currentStep + 1}>
              {TOUR_STEPS.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep ? 'w-4 bg-primary' : 'w-2 bg-primary/30'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: index === currentStep ? 1 : 0.8 }}
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>
                Press <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd> or{' '}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> to navigate,{' '}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to exit
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};