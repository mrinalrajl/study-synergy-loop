import { LearningPath } from "@/components/LearningPath";
import { Leaderboard } from "@/components/Leaderboard";
import { PersonalizedLearning } from "@/components/PersonalizedLearning";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlobalTour } from "@/components/GlobalTour";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, LogOut, Search, Star, BookUser, Bell, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LearningAssistant } from "@/components/LearningAssistant";

// Featured courses data
const FEATURED_COURSES = [
  {
    title: "Machine Learning Fundamentals",
    category: "AI & Machine Learning",
    rating: 4.9,
    students: 12453,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Dr. Andrew Thomas"
  },
  {
    title: "Financial Analysis Masterclass",
    category: "Finance & Business",
    rating: 4.8,
    students: 8761,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Emma Rodriguez"
  },
  {
    title: "Advanced React Development",
    category: "Software Development",
    rating: 4.7,
    students: 15320,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Michael Chen"
  },
  {
    title: "Architectural Design Principles",
    category: "Engineering & Design",
    rating: 4.8,
    students: 6289,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Sophia Williams"
  }
];

const Index = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPersonalized, setShowPersonalized] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header with glassmorphism effect */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-primary/20 sticky top-0 z-10 w-full tour-header">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookUser className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-hover text-transparent bg-clip-text">Learning Path</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search for courses..." 
                  className="pl-10 bg-background/50 border-primary/10 focus:border-primary/30"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative glass-btn-strong text-zinc-700 dark:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              <ThemeToggle />
              <Button 
                className="glass-btn-strong text-zinc-700 dark:text-white"
                title="Begin your learning journey"
                onClick={() => setShowPersonalized(!showPersonalized)}
              >
                {showPersonalized ? "Browse Courses" : "Personalize Learning"}
              </Button>
              <Link to="/profile" className="text-muted-foreground hover:text-foreground">
                <Button variant="ghost" size="icon" className="glass-btn-strong text-zinc-700 dark:text-white">
                  <span className="sr-only">Profile</span>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {user?.name?.[0] || "U"}
                  </div>
                </Button>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile search - only visible on small screens */}
      <div className="md:hidden p-4 bg-background/30">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search for courses..." 
            className="pl-10 bg-background/50 border-primary/10 focus:border-primary/30"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {showPersonalized ? (
          <PersonalizedLearning />
        ) : (
          <>
            {/* Featured Courses Section */}
            <div className="mb-12 tour-featured-courses">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Featured Courses</h2>
                <Button 
                  variant="outline" 
                  className="text-sm border-primary/20 hover:bg-background/60 glass-btn-strong"
                  onClick={() => setShowPersonalized(true)}
                >
                  Personalize Learning
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[2000px] mx-auto">
                {FEATURED_COURSES.map((course, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/40 bg-background/50 backdrop-blur-sm border-primary/10 glass-container"
                  >
                    <div className="h-36 overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                      />
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="text-xs text-primary font-medium mb-1">{course.category}</div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="text-sm">{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-muted-foreground ml-2">({course.students.toLocaleString()} students)</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full glass-btn-strong" variant="secondary">
                        Enroll Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-[2000px] mx-auto">
              <div className="xl:col-span-3">
                <LearningPath />
              </div>
              <div>
                <Leaderboard />
              </div>
            </div>
          </>
        )}
      </main>
      
      {/* Learning Assistant (AI Chat) */}
      <LearningAssistant />
      
      {/* Global Tour Component */}
      <GlobalTour />
    </div>
  );
};

export default Index;
