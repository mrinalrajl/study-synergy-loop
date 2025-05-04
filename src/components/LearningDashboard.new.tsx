import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Award, Book, BookOpen, Search, User, Bell, Bookmark, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearch, SearchResult } from "@/hooks/use-search";
import { 
  getAllCoursesProgress, 
  getEnrolledCourses, 
  enrollInCourse,
  updateCourseProgress,
  getUserSkills,
  updateLearningStreak
} from "@/lib/progress-tracker";
import { fetchGroq } from "@/lib/groqClient";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Notes from "./Notes";
import { Navbar } from "@/components/Navbar";
import PrismBackground from "./PrismBackground";

export const LearningDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [learningGoal, setLearningGoal] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [timeframeFilter, setTimeframeFilter] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [courseProgress, setCoursesProgress] = useState<Record<string, any>>({});
  const [skills, setSkills] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  
  const { toast } = useToast();
  const { results, aiSuggestions, isLoading, searchCourses } = useSearch();

  // Load user data on component mount
  useEffect(() => {
    setEnrolledCourses(getEnrolledCourses());
    setCoursesProgress(getAllCoursesProgress());
    setSkills(getUserSkills());
    updateLearningStreak();
    
    // Generate AI welcome insight
    generateAiInsight();
  }, []);

  // Generate AI learning insights based on user data
  const generateAiInsight = async () => {
    setIsLoadingAi(true);
    try {
      const enrolledCount = getEnrolledCourses().length;
      const progress = getAllCoursesProgress();
      const completedCount = Object.values(progress).filter(course => course.completed).length;
      const skills = getUserSkills().map(skill => `${skill.name} (Level ${skill.level})`).join(", ");
      
      const prompt = `Based on this learning profile, give a short, personalized insight or tip:
      - Enrolled in ${enrolledCount} courses
      - Completed ${completedCount} courses
      - Skills: ${skills || "No skills tracked yet"}
      
      Keep it under 2 sentences and make it motivational but specific to their situation.`;
      
      const insight = await fetchGroq(prompt);
      setAiInsight(insight);
    } catch (error) {
      console.error("Error generating AI insight:", error);
      setAiInsight("Keep up your learning momentum! Each course brings you closer to mastery.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Handle course search
  const handleSearch = () => {
    searchCourses(searchQuery, {
      level: levelFilter,
      goal: learningGoal,
      timeframe: timeframeFilter
    });
  };

  // Handle course enrollment
  const handleEnroll = (course: SearchResult) => {
    enrollInCourse(course.id, course.title);
    setEnrolledCourses(getEnrolledCourses());
    setCoursesProgress(getAllCoursesProgress());
    
    toast({
      title: "Enrolled Successfully",
      description: `You've enrolled in "${course.title}"`,
    });
  };

  // Calculate user stats
  const calculateCompletionRate = () => {
    const courses = Object.values(courseProgress);
    if (courses.length === 0) return 0;
    
    const completed = courses.filter(course => course.completed).length;
    return Math.round((completed / courses.length) * 100);
  };

  const totalLearningTime = Object.values(courseProgress).reduce(
    (total, course) => total + (course.timeSpent || 0), 0
  );

  // Format learning time (seconds to hours and minutes)
  const formatLearningTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen flex flex-col relative font-prism">
      <PrismBackground intensity="high" />
      <Navbar variant="home" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and discover new courses</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Bookmark className="h-4 w-4" />
              <span className="hidden md:inline">Saved</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </Button>
          </div>
        </div>

        {/* AI Learning Insight */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5l-.7 3.5 3.5-.7c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"></path>
                  <path d="M12 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                  <path d="M12 11V8"></path>
                </svg>
              </div>
              <span>AI Learning Insight</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {isLoadingAi ? "Generating your personalized learning insight..." : aiInsight}
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateCompletionRate()}%</div>
              <Progress value={calculateCompletionRate()} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLearningTime(totalLearningTime)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skills.length}</div>
            </CardContent>
          </Card>
        </div>