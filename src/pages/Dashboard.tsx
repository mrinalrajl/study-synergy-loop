
import React, { useState, useEffect } from "react";
import { 
  Book, BookOpen, Clock, Star, Users, 
  Calendar, Bell, Search, BookUser 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { fetchUdemyFreeCourses } from "@/lib/udemyApi";
import { useProgressTracker } from "@/lib/progress-tracker";
import { useRecommendationEngine } from "@/lib/recommendation-engine";
import { useNotifications } from "@/lib/notification-service";
import { trackEvent } from "@/lib/analytics";
import { LoopBot } from "@/components/LoopBot";

import { motion } from "framer-motion";

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [showLoopBot, setShowLoopBot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { toast } = useToast();
  const progress = useProgressTracker();
  const { createCourseReminder, addNotification } = useNotifications();
  const recommendationEngine = useRecommendationEngine();

  useEffect(() => {
    // Track page view
    trackEvent('page_view', 'dashboard');
    
    // Fetch course data
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const featured = await fetchUdemyFreeCourses("web development");
        setFeaturedCourses(featured);
        
        // Get enrolled courses from localStorage
        const enrolled = JSON.parse(localStorage.getItem("enrolled_courses") || "[]");
        if (enrolled.length > 0) {
          const recent = await fetchUdemyFreeCourses(enrolled[0]);
          setRecentCourses(recent.slice(0, 3));
        } else {
          const recommended = await fetchUdemyFreeCourses("programming");
          setRecentCourses(recommended.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({
          title: "Connection Error",
          description: "Failed to load course data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
    
    // Show welcome notification for new users
    const hasSeenWelcome = localStorage.getItem("has_seen_welcome");
    if (!hasSeenWelcome) {
      setTimeout(() => {
        addNotification({
          type: 'update',
          title: 'Welcome to your learning dashboard!',
          message: 'Start by exploring featured courses or ask LoopBot for personalized recommendations.',
          priority: 'high',
          icon: 'star',
        });
        localStorage.setItem("has_seen_welcome", "true");
      }, 1500);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await fetchUdemyFreeCourses(searchQuery);
      setFeaturedCourses(results);
      trackEvent('search', 'query', searchQuery, results.length);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = (course: any) => {
    // Check if already enrolled
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolled_courses") || "[]");
    if (enrolledCourses.includes(course.id)) {
      toast({
        title: "Already Enrolled",
        description: "You're already enrolled in this course.",
      });
      return;
    }
    
    // Add to enrolled courses
    const updatedEnrolled = [...enrolledCourses, course.id];
    localStorage.setItem("enrolled_courses", JSON.stringify(updatedEnrolled));
    
    // Track enrollment
    recommendationEngine.recordCourseEnrollment(course.id);
    trackEvent('course_engagement', 'enroll', course.id);
    
    // Start progress tracking
    progress.startTrackingTime(course.id, course.title, 10); // Assuming 10 modules
    
    // Create notification
    addNotification({
      type: 'achievement',
      title: 'New Enrollment!',
      message: `You've enrolled in "${course.title}". Start learning now.`,
      priority: 'medium',
      courseId: course.id,
      actionUrl: course.url,
      icon: 'book',
    });
    
    // Create reminder for later
    setTimeout(() => {
      createCourseReminder(course.id, course.title);
    }, 1000 * 60 * 60 * 24); // 24 hour reminder
    
    toast({
      title: "Successfully Enrolled!",
      description: `You've been enrolled in "${course.title}"`,
    });
  };

  return (
    <div className="container min-h-screen py-6 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and discover new courses</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <Input
              type="search"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80"
            />
            <Button type="submit" variant="default" className="ml-2">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </header>

      {/* Weekly Progress Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Weekly Learning Progress
            </CardTitle>
            <CardDescription>
              Your goal: {progress.weeklyGoalHours} hours this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress.getWeeklyProgressPercent()} />
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">
                  {Math.round(progress.totalLearningTime / 3600)} hours
                </span> completed out of {progress.weeklyGoalHours} hour goal
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                  const dayKey = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
                    .toLocaleDateString('en-US', { weekday: 'long' })
                    .toLowerCase();
                  const dayValue = progress.weeklyProgress[dayKey] || 0;
                  const heightPercentage = Math.min(100, (dayValue / (progress.weeklyGoalHours * 3600 / 7)) * 100);

                  return (
                    <div key={day} className="flex flex-col items-center">
                      <div className="h-20 w-full bg-muted rounded-sm flex items-end">
                        <div 
                          className="bg-primary w-full rounded-sm transition-all duration-500"
                          style={{ height: `${heightPercentage || 3}%` }}
                        />
                      </div>
                      <span className="text-xs mt-1">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Learning Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/20 p-2 rounded mr-3">
                    <Book className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Enrolled Courses</div>
                    <div className="text-xs text-muted-foreground">Total courses</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {progress.getAllCoursesProgress().length}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-orange-500/20 p-2 rounded mr-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Total Learning Time</div>
                    <div className="text-xs text-muted-foreground">Hours spent learning</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(progress.totalLearningTime / 3600)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-500/20 p-2 rounded mr-3">
                    <Star className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Completed</div>
                    <div className="text-xs text-muted-foreground">Finished courses</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {progress.getAllCoursesProgress().filter(course => course.progress === 100).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Course Tabs */}
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="h-40 w-full object-cover"
                    />
                    <CardContent className="p-4 flex-1">
                      <h3 className="text-lg font-semibold line-clamp-2 mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{course.rating?.toFixed(1) || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{course.enrolled}</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 mt-auto">
                      <Button 
                        onClick={() => handleEnroll(course)} 
                        variant="default" 
                        className="w-full"
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookUser className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground">Try a different search term or check back later</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="enrolled">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden h-full flex flex-col">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="h-40 w-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white font-medium bg-primary/80 px-2 py-1 rounded-sm">
                          In Progress
                        </span>
                        <Progress value={35} className="w-24 h-2" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1">
                    <h3 className="text-lg font-semibold line-clamp-2 mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs">Last active: 2 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto flex gap-2">
                    <Button variant="outline" className="w-1/2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button className="w-1/2">
                      Continue
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookUser className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No enrolled courses yet</h3>
                <p className="text-muted-foreground">Enroll in courses to start learning</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowLoopBot(true)}
                >
                  <BookUser className="h-4 w-4 mr-2" />
                  Ask LoopBot for Recommendations
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCourses.slice(0, 8).map((course) => (
              <Card key={course.id} className="overflow-hidden h-full flex flex-col">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="h-40 w-full object-cover"
                />
                <CardContent className="p-4 flex-1">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{course.rating?.toFixed(1) || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{course.enrolled}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button 
                    onClick={() => handleEnroll(course)} 
                    variant="default" 
                    className="w-full"
                  >
                    Enroll Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* LoopBot Chat Assistant */}
      {showLoopBot ? (
        <LoopBot onClose={() => setShowLoopBot(false)} />
      ) : (
        <Button 
          className="fixed bottom-4 right-4 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center"
          size="icon"
          variant="default"
          onClick={() => setShowLoopBot(true)}
        >
          <BookUser className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
