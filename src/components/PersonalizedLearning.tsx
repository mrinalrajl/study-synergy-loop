import { useState, useEffect } from "react";
import { CalendarCheck, Clock, MessageSquare, Mail, Bell, BookUser, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast, toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import { AnimatedToaster, useAnimatedToaster } from "@/components/ui/AnimatedToaster";
import { motion, AnimatePresence } from "framer-motion";
import DailyLearningLoop from "./DailyLearningLoop";
import Achievements from "./Achievements";
import Bookmarks from "./Bookmarks";
import Notes from "./Notes";
import StudyScheduler from "./StudyScheduler";
import Quiz from "./Quiz";
import StudyGroups from "./StudyGroups";
import ResourceHub from "./ResourceHub";
import TopicRecommendations from "./TopicRecommendations";
import { Leaderboard } from "./Leaderboard";
import { CourseChat } from "./CourseChat";
import { fetchAI } from "@/lib/aiService";
import { processAIResponse, formatCourseRecommendations, createMarkup } from "@/utils/responseFormatter";

// Learning durations for users to select
const LEARNING_DURATIONS = [
  "1 week",
  "2 weeks",
  "1 month",
  "3 months",
  "6 months",
  "Flexible schedule"
];

// Learning goals templates
const LEARNING_GOALS = [
  "Get a job in tech",
  "Prepare for an interview",
  "Improve current skills",
  "Change career paths",
  "Launch a project/startup",
  "Academic research",
  "Personal interest"
];

// Sample interview questions by field
const INTERVIEW_QUESTIONS = {
  "AI & Machine Learning": [
    "Explain the difference between supervised and unsupervised learning.",
    "How would you handle imbalanced data in a classification problem?",
    "Explain the bias-variance tradeoff.",
    "What is the purpose of regularization in machine learning?"
  ],
  "Finance & Business": [
    "How would you value a company with negative earnings?",
    "Explain the difference between NPV and IRR.",
    "What factors would you consider when building a financial model?",
    "How does inflation impact investment decisions?"
  ],
  "Software Development": [
    "Explain the concept of time and space complexity.",
    "What are the SOLID principles of object-oriented design?",
    "How would you optimize a website's performance?",
    "Describe the differences between REST and GraphQL."
  ],
  "Engineering & Design": [
    "How do you approach a design problem with competing constraints?",
    "Explain the concept of load balancing in structural engineering.",
    "What considerations go into making a design sustainable?",
    "How would you test a physical product for durability?"
  ]
};

const DEMO_STEPS = [
  {
    title: "Welcome to Study Synergy Loop!",
    description: "This is your all-in-one learning platform. Let's take a tour of the main features you'll use!",
    target: null
  },
  {
    title: "Header & Navigation",
    description: "At the top, you can search for courses, toggle dark/light mode, view notifications, and sign out.",
    target: "header"
  },
  {
    title: "Personalized Learning",
    description: "Click 'Personalize Learning' to set your goals, experience, and get a custom learning path.",
    target: "button[title='Begin your learning journey']"
  },
  {
    title: "Featured Courses",
    description: "Browse top courses, see ratings, and enroll instantly from the dashboard.",
    target: ".grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4"
  },
  {
    title: "Learning Path",
    description: "Track your progress, complete modules, and unlock achievements as you learn.",
    target: ".LearningPath"
  },
  {
    title: "Quick Access Panel",
    description: "Access your daily learning, achievements, bookmarks, and notes for fast productivity.",
    target: ".grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4"
  },
  {
    title: "Study Tools & Social",
    description: "Schedule study sessions, take quizzes, and join study groups to learn together.",
    target: ".grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3"
  },
  {
    title: "Resource Hub & Recommendations",
    description: "Find curated resources and get AI-powered topic recommendations.",
    target: ".grid-cols-1.md\\:grid-cols-2.gap-6"
  },
  {
    title: "Leaderboard & Profile",
    description: "See top learners, share your progress, and view or edit your profile.",
    target: ".Leaderboard"
  },
  {
    title: "Learning Assistant (LoopBot)",
    description: "Click the chat icon to open LoopBot, your AI assistant for instant help, course suggestions, and more.",
    target: ".CourseChat"
  },
  {
    title: "You're all set!",
    description: "Explore, learn, and have fun! You can revisit this tour anytime from your profile or settings.",
    target: null
  }
];

// Helper to render stars
const renderStars = (count: number) => '★'.repeat(count) + '☆'.repeat(5 - count);

export const PersonalizedLearning = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [goal, setGoal] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showInterviewQuestions, setShowInterviewQuestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("AI & Machine Learning");
  const [notificationType, setNotificationType] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const { toasts, showToast } = useAnimatedToaster();
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [udemyCourses, setUdemyCourses] = useState<any[]>([]);
  const [isLoadingUdemy, setIsLoadingUdemy] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("enrolled_courses") || "[]");
    } catch {
      return [];
    }
  });

  const fallbackCourses = [
    "1. Python for Beginners - Learn the basics of Python programming.",
    "2. Data Science Essentials - Introduction to data analysis and visualization.",
    "3. Web Development Bootcamp - Build modern websites and web apps.",
    "4. AI Fundamentals - Understand the core concepts of artificial intelligence."
  ];

  useEffect(() => {
    // Show demo for new users (no localStorage flag)
    if (!localStorage.getItem("seen_demo")) {
      setShowDemo(true);
      localStorage.setItem("seen_demo", "true");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter what you'd like to learn",
        variant: "destructive",
      });
      return;
    }

    setShowRecommendations(true);
    setIsLoadingAI(true);
    setAiRecommendations([]);
    setUdemyCourses([]);
    setIsLoadingUdemy(true);

    try {
      // AI Recommended Courses
      const prompt = `Suggest a personalized learning path and 4 recommended courses for the following user preferences.\n\nTopic: ${topic}\nLevel: ${level}\nDuration: ${duration}\nGoal: ${goal}\n\nFormat the response as a numbered list of course titles with a short description for each.`;
      const aiText = await fetchAI(prompt);
      const lines = aiText.split(/\n|\r/).filter(Boolean).slice(0, 4);
      setAiRecommendations(lines.length ? lines : fallbackCourses);

      // Free Udemy Courses via Groq
      const udemyPrompt = `Suggest 4 free Udemy courses for learning ${topic}. For each, include: title, a short description, instructor, popularity (1-5 stars), and rating (1-5 stars). Format as a JSON array.`;
      const udemyText = await fetchAI(udemyPrompt);
      let udemyList = [];
      try {
        udemyList = JSON.parse(udemyText);
      } catch {
        udemyList = [];
      }
      setUdemyCourses(Array.isArray(udemyList) ? udemyList : []);
    } catch (err) {
      toast({
        title: "AI Error",
        description: "Could not fetch AI recommendations.",
        variant: "destructive",
      });
      setAiRecommendations(fallbackCourses);
      setUdemyCourses([]);
    } finally {
      setIsLoadingAI(false);
      setIsLoadingUdemy(false);
    }

    toast({
      title: "Personalizing your learning journey",
      description: "We've prepared recommendations based on your preferences",
    });
  };

  const handleNotificationToggle = (type: string) => {
    setNotificationType(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const setupNotifications = () => {
    if (notificationType.length === 0) {
      toast({
        title: "Select notification method",
        description: "Please select at least one notification method",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Notifications set up",
      description: `You'll receive updates through ${notificationType.join(", ")}`,
    });
  };

  const showInterviewPrep = () => {
    if (goal === "Prepare for an interview") {
      setShowInterviewQuestions(true);
    }
  };

  const handleNextDemo = () => {
    if (demoStep < DEMO_STEPS.length - 1) {
      setDemoStep(demoStep + 1);
    } else {
      setShowDemo(false);
      setDemoStep(0);
      showToast({ type: "success", title: "Tour Complete!", message: "You're ready to explore the app." });
    }
  };

  const handleOpenAssistant = () => {
    showToast({ type: "info", title: "LoopBot Activated", message: "Ask me anything about your learning journey!" });
  };

  const handleCloseAssistant = () => {
    showToast({ type: "info", title: "LoopBot Closed", message: "You can reopen the assistant anytime from the chat icon." });
  };

  const showAppleToast = (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 4000,
      className: "apple-toast",
    });
    const audio = new Audio("/apple-notification.mp3");
    audio.play();
  };

  const handleEnroll = (courseTitle: string) => {
    if (!enrolledCourses.includes(courseTitle)) {
      const updated = [...enrolledCourses, courseTitle];
      setEnrolledCourses(updated);
      localStorage.setItem("enrolled_courses", JSON.stringify(updated));
      toast({ title: "Enrolled!", description: "Course added to your learning path." });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 relative">
      <AnimatedToaster toasts={toasts} />
      <AnimatePresence>
        {showDemo && (
          <motion.div
            key="demo-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce-in"
            >
              <h2 className="text-2xl font-bold mb-2">{DEMO_STEPS[demoStep].title}</h2>
              <p className="mb-6 text-zinc-600 dark:text-zinc-300">{DEMO_STEPS[demoStep].description}</p>
              <Button onClick={handleNextDemo} className="w-full">
                {demoStep === DEMO_STEPS.length - 1 ? "Finish" : "Next"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Personalized Learning Path
        </h2>
        <p className="text-muted-foreground">
          Tell us what you want to learn and we'll create a customized learning journey for you
        </p>
      </div>

      {!showRecommendations ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-container">
            <CardHeader>
              <CardTitle className="text-xl">What would you like to learn?</CardTitle>
              <CardDescription>
                Enter a topic, skill, or subject area you're interested in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Python programming, Data Science, Financial Analysis..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background/50"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-container">
              <CardHeader>
                <CardTitle className="text-lg">Your experience level</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-full bg-background/50">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="glass-container">
              <CardHeader>
                <CardTitle className="text-lg">Learning timeframe</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="w-full bg-background/50">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_DURATIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-container">
            <CardHeader>
              <CardTitle className="text-lg">Learning goal</CardTitle>
              <CardDescription>
                What do you hope to achieve with this learning?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {LEARNING_GOALS.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={goal === option ? "default" : "outline"}
                    className={`text-sm h-auto py-2 prism-btn ${goal === option ? "bg-primary" : "bg-background/50"} transition-all duration-200`}
                    onClick={() => setGoal(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full glass-btn bg-primary hover:bg-primary-hover text-primary-foreground py-6 text-lg prism-btn"
          >
            Create My Learning Path
          </Button>
        </form>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <Card className="glass-container">
            <CardHeader>
              <CardTitle className="text-2xl">Your Personalized Path for {topic}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {level && (
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {level}
                  </span>
                )}
                {duration && (
                  <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {duration}
                  </span>
                )}
                {goal && (
                  <span className="px-3 py-1 bg-accent/30 text-accent-foreground rounded-full text-sm">
                    {goal}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <BookUser className="h-5 w-5 mr-2 text-primary" />
                  AI Recommended Courses
                </h3>
                {isLoadingAI ? (
                  <div className="text-muted-foreground">Loading AI recommendations...</div>
                ) : aiRecommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {aiRecommendations.map((rec, i) => (
                      <li key={i} className="p-3 bg-background/40 rounded border border-border">
                        {rec}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted-foreground">No AI recommendations yet.</div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <BookUser className="h-5 w-5 mr-2 text-primary" />
                  Free Udemy Courses
                </h3>
                {isLoadingUdemy ? (
                  <div className="text-muted-foreground">Loading free courses...</div>
                ) : udemyCourses.length > 0 ? (
                  udemyCourses.map((course, idx) => (
                    <div key={idx} className="p-2 bg-background/40 rounded border border-border flex gap-3 items-center">
                      <div className="flex-1">
                        <div className="font-medium text-sm flex justify-between">
                          <span>{course.title}</span>
                          <span className="px-2 py-0.5 text-xs bg-secondary/30 rounded-full">Free</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{course.description}</div>
                        <div className="text-xs mt-1 flex flex-col gap-1">
                          <span>Instructor: {course.instructor}</span>
                          <span>Popularity: <span className="text-yellow-400">{renderStars(course.popularity)}</span></span>
                          <span>Rating: <span className="text-yellow-400">{renderStars(course.rating)}</span></span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={enrolledCourses.includes(course.title) ? "default" : "outline"}
                        className="ml-2 text-xs"
                        disabled={enrolledCourses.includes(course.title)}
                        onClick={() => handleEnroll(course.title)}
                      >
                        {enrolledCourses.includes(course.title) ? "Enrolled" : "Enroll"}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No free courses found.</div>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  Progress: {enrolledCourses.length} enrolled
                </div>
              </div>
              {goal === "Prepare for an interview" && (
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    Interview Preparation
                  </h3>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full glass-btn prism-btn">
                        View Sample Interview Questions
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>Interview Questions: {selectedCategory}</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-wrap gap-2 my-4">
                        {Object.keys(INTERVIEW_QUESTIONS).map((category) => (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="text-xs"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-4 mt-4">
                        {INTERVIEW_QUESTIONS[selectedCategory as keyof typeof INTERVIEW_QUESTIONS].map((question, index) => (
                          <div key={index} className="p-3 bg-background/50 rounded-lg border border-border">
                            <p className="text-sm">{question}</p>
                          </div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Set Up Learning Reminders
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={notificationType.includes("calendar") ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationToggle("calendar")}
                      className="flex items-center prism-btn"
                    >
                      <CalendarCheck className="h-4 w-4 mr-2" />
                      Calendar
                    </Button>
                    <Button
                      variant={notificationType.includes("email") ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationToggle("email")}
                      className="flex items-center prism-btn"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant={notificationType.includes("app") ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationToggle("app")}
                      className="flex items-center prism-btn"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      App
                    </Button>
                  </div>

                  {notificationType.includes("email") && (
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50"
                    />
                  )}

                  <Button
                    onClick={setupNotifications}
                    className="w-full glass-btn prism-btn"
                  >
                    Set Up Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowRecommendations(false)}
              className="glass-btn prism-btn"
            >
              Adjust Preferences
            </Button>
            <Button
              onClick={() => toast({
                title: "Learning plan created",
                description: "Your personalized learning plan is ready!"
              })}
              className="glass-btn bg-primary text-primary-foreground prism-btn"
            >
              Start Learning
            </Button>
          </div>
        </div>
      )}

      {/* Quick Access Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="col-span-1">
          <DailyLearningLoop />
        </div>
        <div className="col-span-1">
          <Achievements />
        </div>
        <div className="col-span-1">
          <Bookmarks />
        </div>
        <div className="col-span-1">
          <Notes />
        </div>
      </div>
      {/* Study tools and social features */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="col-span-1">
          <StudyScheduler />
        </div>
        <div className="col-span-1">
          <Quiz initialTopic={topic || undefined} />
        </div>
        <div className="col-span-1">
          <StudyGroups />
        </div>
      </div>
      {/* Resource hub and recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResourceHub />
        <TopicRecommendations />
      </div>
      {/* Leaderboard and chat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Leaderboard />
        <CourseChat />
      </div>
      <Toaster />
    </div>
  );
};
