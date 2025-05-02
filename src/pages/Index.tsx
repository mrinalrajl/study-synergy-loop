
import { LearningPath } from "@/components/LearningPath";
import { Leaderboard } from "@/components/Leaderboard";
import { CourseChat } from "@/components/CourseChat";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, LogOut } from "lucide-react";

const Index = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Learning Path</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button 
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                title="Begin your learning journey"
              >
                Start Learning
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LearningPath />
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </main>
      <CourseChat />
    </div>
  );
};

export default Index;
