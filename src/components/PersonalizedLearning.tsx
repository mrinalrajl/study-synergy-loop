
import { useState } from "react";
import { CalendarCheck, Clock, MessageSquare, Mail, Bell, BookUser, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  
  const handleSubmit = (e: React.FormEvent) => {
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
  
  return (
    <div className="w-full max-w-4xl mx-auto">
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
                    className={`text-sm h-auto py-2 ${goal === option ? "bg-primary" : "bg-background/50"} transition-all duration-200`}
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
            className="w-full glass-btn bg-primary hover:bg-primary-hover text-primary-foreground py-6 text-lg"
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
                  Recommended Courses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dynamically generated course recommendations based on topic */}
                  {[1, 2, 3, 4].map((_, i) => (
                    <div 
                      key={i} 
                      className="p-4 bg-background/40 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all duration-200 hover:bg-background/60"
                      onClick={() => toast({
                        title: "Course selected",
                        description: "You've been enrolled in this course"
                      })}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium">
                          {topic} {i === 0 ? "Fundamentals" : i === 1 ? "Intermediate Concepts" : i === 2 ? "Advanced Techniques" : "Mastery"}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm ml-1">{4 + i * 0.2}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {i === 0 ? "Perfect for beginners" : i === 1 ? "Build on your fundamentals" : i === 2 ? "Deep dive into complex topics" : "Expert-level content"}
                      </div>
                      <div className="flex items-center mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground ml-1">
                          {(i+1) * 4} hours • {level}
                        </span>
                      </div>
                    </div>
                  ))}
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
                      <Button variant="outline" className="w-full glass-btn">
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
                      className="flex items-center"
                    >
                      <CalendarCheck className="h-4 w-4 mr-2" />
                      Calendar
                    </Button>
                    <Button
                      variant={notificationType.includes("email") ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationToggle("email")}
                      className="flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant={notificationType.includes("app") ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationToggle("app")}
                      className="flex items-center"
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
                    className="w-full glass-btn"
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
              className="glass-btn"
            >
              Adjust Preferences
            </Button>
            <Button 
              onClick={() => toast({
                title: "Learning plan created",
                description: "Your personalized learning plan is ready!"
              })}
              className="glass-btn bg-primary text-primary-foreground"
            >
              Start Learning
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
