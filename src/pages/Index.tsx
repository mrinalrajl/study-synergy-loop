import { LearningPath } from "@/components/LearningPath";
import { Leaderboard } from "@/components/Leaderboard";
import { PersonalizedLearning } from "@/components/PersonalizedLearning";
import { GlobalTour } from "@/components/GlobalTour";
import { useAuth } from "@/contexts/AuthContext";
import { Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LearningAssistant } from "@/components/LearningAssistant";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

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
    <div className="fixed inset-0 -z-10 overflow-hidden font-prism pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#f5d0fe] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#0f172a] animate-gradient-move transition-colors duration-700" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#a5b4fc]/40 dark:bg-[#334155]/40 rounded-full blur-3xl animate-bubble-move" />
      <div className="absolute top-2/3 left-2/4 w-72 h-72 bg-[#fbcfe8]/40 dark:bg-[#64748b]/40 rounded-full blur-2xl animate-bubble-move2" />
      <div className="absolute top-1/2 left-2/5 w-60 h-60 bg-[#99f6e4]/40 dark:bg-[#0ea5e9]/20 rounded-full blur-2xl animate-bubble-move3" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-transparent dark:bg-[#6366f1]/10 rounded-full blur-3xl animate-bubble-move4 hidden dark:block" />
    </div>
  );
}

const Index = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  // Always set showPersonalized to false since we're removing the personalized learning button
  const [showPersonalized] = useState(false);
  const [hasDuplicates, setHasDuplicates] = useState(true);
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRemoveDuplicates = () => {
    // Simulate removing duplicates
    setHasDuplicates(false);
    toast({
      title: "Duplicates Removed",
      description: "All duplicate items have been successfully removed.",
    });
  };

  return (
    <div className="min-h-screen w-full relative font-prism">
      <PrismBackground />
      <Navbar 
        variant="home" 
        user={user}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showPersonalized={showPersonalized}
        logout={logout}
        removeDuplicates={hasDuplicates ? handleRemoveDuplicates : undefined}
      />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12 flex flex-col items-center justify-center min-h-[90vh] mt-24">
        {showPersonalized ? (
          <PersonalizedLearning />
        ) : (
          <>
            {/* Featured Courses Section */}
            <div className="mb-12 tour-featured-courses">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Featured Courses</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[2000px] mx-auto">
                {FEATURED_COURSES.map((course, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/40 bg-background/50 backdrop-blur-sm border-primary/10 glass-container dark:hover:shadow-indigo-500/10"
                  >
                    <div className="h-36 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 dark:opacity-30 transition-opacity duration-300 z-10"></div>
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                      />
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="text-xs text-primary dark:text-indigo-400 font-medium mb-1">{course.category}</div>
                      <CardTitle className="text-lg dark:text-slate-100">{course.title}</CardTitle>
                      <CardDescription className="text-sm dark:text-slate-300">{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium dark:text-slate-200">{course.rating}</span>
                        <span className="text-muted-foreground dark:text-slate-400 ml-2">({course.students.toLocaleString()} students)</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full glass-btn-strong dark:bg-indigo-600/50 dark:hover:bg-indigo-600/70 dark:border-indigo-500/30 dark:text-white" variant="secondary">
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
          background-size: 300% 300%;
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
        .animate-bubble-move4 {
          animation: bubbleMove4 25s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove4 {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          100% { transform: translateY(-30px) scale(1.2) rotate(15deg); }
        }
        
        .dark .glass-container {
          background: rgba(15, 23, 42, 0.15);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
        }
        
        .dark .glass-container:hover {
          background: rgba(15, 23, 42, 0.25);
          border: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Index;