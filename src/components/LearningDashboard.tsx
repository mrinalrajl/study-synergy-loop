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

function PrismBackground() {
  useEffect(() => {
    document.body.classList.add("font-prism");
    return () => document.body.classList.remove("font-prism");
  }, []);
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden font-prism pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#f5d0fe] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#0f172a] animate-gradient-move transition-colors duration-700" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#a5b4fc]/40 dark:bg-[#334155]/40 rounded-full blur-3xl animate-bubble-move" />
      <div className="absolute top-2/3 left-2/4 w-72 h-72 bg-[#fbcfe8]/40 dark:bg-[#64748b]/40 rounded-full blur-2xl animate-bubble-move2" />
      <div className="absolute top-1/2 left-2/5 w-60 h-60 bg-[#99f6e4]/40 dark:bg-[#0ea5e9]/20 rounded-full blur-2xl animate-bubble-move3" />
      {/* Sunlight blue effect on bubble */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none">
        <div className="absolute w-40 h-40 left-24 top-10 bg-gradient-to-br from-blue-300/60 via-white/40 to-transparent rounded-full blur-2xl opacity-70 animate-sunlight-glow" />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Quicksand:wght@500;700&display=swap');
        .font-prism {
          font-family: 'Montserrat', 'Quicksand', 'Segoe UI', 'Arial', sans-serif;
          letter-spacing: 0.01em;
        }
        .animate-gradient-move {
          animation: gradientMove 16s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-bubble-move {
          animation: bubbleMove 12s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-40px) scale(1.13); }
        }
        .animate-bubble-move2 {
          animation: bubbleMove2 18s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove2 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(30px) scale(1.11); }
        }
        .animate-bubble-move3 {
          animation: bubbleMove3 22s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove3 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.15); }
        }
        .animate-sunlight-glow {
          animation: sunlightGlow 6s ease-in-out infinite alternate;
        }
        @keyframes sunlightGlow {
          0% { opacity: 0.5; filter: blur(16px); }
          100% { opacity: 1; filter: blur(32px); }
        }
      `}</style>
    </div>
  );
}

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
      <PrismBackground />
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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="notes">Notes & Resources</TabsTrigger>
          </TabsList>
          
          {/* Discover Tab */}
          <TabsContent value="discover">
            <Card>
              <CardHeader>
                <CardTitle>Find Your Next Course</CardTitle>
                <CardDescription>
                  Search for courses or get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search for courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <Select value={levelFilter} onValueChange={setLevelFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (&lt;3h)</SelectItem>
                          <SelectItem value="medium">Medium (3-10h)</SelectItem>
                          <SelectItem value="long">Long (&gt;10h)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button onClick={handleSearch}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 text-lg">What's your learning goal?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {["Career switch", "Skill improvement", "Hobby", "Academic", "Certification"].map(goal => (
                        <Button
                          key={goal}
                          variant={learningGoal === goal ? "default" : "outline"}
                          onClick={() => setLearningGoal(goal)}
                          className="h-auto py-2"
                        >
                          {goal}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Search Results */}
                  {isLoading ? (
                    <div className="text-center py-4">Searching for courses...</div>
                  ) : results.length > 0 && (
                    <div className="space-y-4 mt-4">
                      <h3 className="font-medium">Search Results</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.slice(0, 6).map((course) => (
                          <Card key={course.id} className="overflow-hidden h-full flex flex-col">
                            <div className="aspect-video w-full overflow-hidden">
                              <img 
                                src={course.image} 
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardHeader className="pb-2 flex-grow">
                              <CardTitle className="text-base">{course.title}</CardTitle>
                              <CardDescription className="line-clamp-2">
                                {course.description}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-0 flex items-center justify-between">
                              <div className="flex items-center text-sm">
                                <span className="flex items-center">
                                  <Award className="h-3.5 w-3.5 mr-1" />
                                  {course.level || "All Levels"}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-2" />
                                <span>
                                  {course.price === "Free" ? "Free" : course.price}
                                </span>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleEnroll(course)}
                                disabled={enrolledCourses.includes(course.id)}
                              >
                                {enrolledCourses.includes(course.id) ? "Enrolled" : "Enroll"}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* AI Recommendations */}
                  {aiSuggestions.length > 0 && (
                    <div className="space-y-4 mt-4">
                      <h3 className="font-medium">AI Course Recommendations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiSuggestions.map((suggestion, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">AI Suggested Course</CardTitle>
                              <CardDescription>{suggestion}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                              <Button variant="outline" size="sm" className="ml-auto">Find Similar</Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* My Courses Tab */}
          <TabsContent value="my-courses">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Journey</CardTitle>
                <CardDescription>
                  Track your enrolled courses and continue learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't enrolled in any courses yet.
                    </p>
                    <Button onClick={() => setActiveTab("discover")}>
                      Discover Courses
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {enrolledCourses.map((courseId) => {
                      const course = courseProgress[courseId];
                      if (!course) return null;
                      
                      return (
                        <div key={courseId} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="font-medium">{course.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                <span>{formatLearningTime(course.timeSpent || 0)} spent learning</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-2" />
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                <span>Last accessed {new Date(course.lastAccessed).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Button variant="outline" size="sm" className="mr-2">
                                Resume Learning
                              </Button>
                              {course.completed ? (
                                <div className="flex items-center text-green-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                  </svg>
                                  <span className="ml-1">Completed</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 min-w-[100px]">
                                  <Progress value={course.progress} className="h-2 w-16" />
                                  <span className="text-xs">{course.progress}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notes Tab */}
          <TabsContent value="notes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Notes />
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                  <CardDescription>
                    Helpful materials to support your studies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {["Documentation", "Practice exercises", "Video tutorials", "Community forums"].map((resource, i) => (
                      <li key={i} className="flex justify-between items-center p-2 hover:bg-accent/50 rounded-md transition-colors">
                        <span className="flex items-center">
                          <Book className="h-4 w-4 mr-2 text-primary" />
                          {resource}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Browse All Resources</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearningDashboard;
