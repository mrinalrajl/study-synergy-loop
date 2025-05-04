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
import { Navbar } from "@/components/UserProfile";

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

function PrismBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden font-prism">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#f5d0fe] animate-gradient-move" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#a5b4fc]/40 rounded-full blur-3xl animate-bubble-move" />
      <div className="absolute top-2/3 left-2/4 w-72 h-72 bg-[#fbcfe8]/40 rounded-full blur-2xl animate-bubble-move2" />
      <div className="absolute top-1/2 left-2/5 w-60 h-60 bg-[#99f6e4]/40 rounded-full blur-2xl animate-bubble-move3" />
    </div>
  );
}

const Index = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPersonalized, setShowPersonalized] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen w-full relative font-prism">
      <PrismBackground />
      <Navbar />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12 flex flex-col items-center justify-center min-h-[90vh]">
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
      <LearningAssistant />
      <GlobalTour />
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
      `}</style>
    </div>
  );
};

export default Index;
