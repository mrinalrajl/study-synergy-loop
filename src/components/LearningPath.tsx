import { Trophy, Star, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  skills: string[];
  estimatedTime: string;
}

export const LearningPath = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const { user, updateProgress } = useAuth();
  const { toast } = useToast();

  // Initialize modules with user progress
  useEffect(() => {
    const initialModules: Module[] = [
      {
        id: 1,
        title: "Foundations",
        description: "Build your core knowledge",
        progress: 0,
        completed: false,
        skills: ["Critical Thinking", "Basic Concepts", "Terminology"],
        estimatedTime: "4-6 hours",
      },
      {
        id: 2,
        title: "Intermediate Applications",
        description: "Apply concepts to real scenarios",
        progress: 0,
        completed: false,
        skills: ["Problem Solving", "Analysis", "Implementation"],
        estimatedTime: "8-10 hours",
      },
      {
        id: 3,
        title: "Advanced Techniques",
        description: "Master complex methodologies",
        progress: 0,
        completed: false,
        skills: ["Innovation", "Optimization", "Research Methods"],
        estimatedTime: "12-15 hours",
      },
      {
        id: 4,
        title: "Expert Specialization",
        description: "Become a domain expert",
        progress: 0,
        completed: false,
        skills: ["Leadership", "Original Contribution", "Thought Leadership"],
        estimatedTime: "15-20 hours",
      }
    ];

    // Update modules with user progress if available
    if (user?.progress) {
      const updatedModules = initialModules.map(module => {
        const userProgress = user.progress.find(p => p.moduleId === module.id);
        if (userProgress) {
          return {
            ...module,
            progress: userProgress.progress,
            completed: userProgress.completed
          };
        }
        return module;
      });
      setModules(updatedModules);
    } else {
      setModules(initialModules);
    }
  }, [user]);

  const handleModuleAction = async (moduleId: number) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;

    const module = modules[moduleIndex];
    const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;

    // Cannot start module if previous is not completed (except first module)
    if (moduleIndex > 0 && !prevModule?.completed) {
      toast({
        title: "Module locked",
        description: "Please complete the previous module first",
        variant: "destructive"
      });
      return;
    }

    // If module is completed, allow review
    if (module.completed) {
      toast({
        title: "Module Review",
        description: `Reviewing ${module.title}`,
      });
      return;
    }

    // Update progress
    const newProgress = Math.min(module.progress + 20, 100);
    const completed = newProgress === 100;

    // Update both local state and persist to auth context
    const updatedModules = modules.map(m => 
      m.id === moduleId 
        ? { ...m, progress: newProgress, completed } 
        : m
    );

    setModules(updatedModules);
    updateProgress(moduleId, newProgress, completed);

    if (completed) {
      toast({
        title: "Congratulations! 🎉",
        description: `You've completed the ${module.title} module!`,
      });
    } else {
      toast({
        title: "Progress saved",
        description: `${module.title}: ${newProgress}% complete`,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Learning Path</h2>
        <Button variant="outline" size="sm" className="text-sm border-primary/20">
          View All Paths
        </Button>
      </div>
      
      <div className="space-y-6 animate-fade-in">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={`transform transition-all duration-300 hover:scale-[1.01] ${
              module.completed ? "opacity-100" : "opacity-90"
            }`}
            aria-label={`${module.title} module - ${module.completed ? "Completed" : "In Progress"}`}
          >
            <div
              className={`relative overflow-hidden rounded-xl bg-background/60 backdrop-blur-sm p-6 border ${
                module.completed
                  ? "border-primary/40 shadow-md shadow-primary/5"
                  : index === 0 || modules[index - 1]?.completed
                  ? "border-secondary/30 hover:border-secondary/50 cursor-pointer shadow-md"
                  : "border-gray-200/30 opacity-70 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {module.completed ? (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-secondary" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{module.title}</h3>
                    <p className="text-muted-foreground">{module.description}</p>
                  </div>
                </div>
                <Button
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-300 ${
                    module.completed
                      ? "bg-primary hover:bg-primary-hover text-white transform hover:scale-105"
                      : index === 0 || modules[index - 1]?.completed
                      ? "bg-secondary hover:bg-secondary-hover text-white transform hover:scale-105"
                      : "bg-gray-200/70 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!module.completed && !(index === 0 || modules[index - 1]?.completed)}
                  onClick={() => handleModuleAction(module.id)}
                  title={
                    !module.completed && !(index === 0 || modules[index - 1]?.completed)
                      ? "Complete previous modules first"
                      : module.completed
                      ? "Review this module"
                      : "Start learning"
                  }
                >
                  <span>{module.completed ? "Review" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 mb-3">
                {module.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className={`px-2 py-1 text-xs rounded-full ${
                      module.completed 
                        ? "bg-primary/10 text-primary" 
                        : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
                <span className="px-2 py-1 text-xs rounded-full bg-accent/30 text-accent-foreground ml-auto">
                  {module.estimatedTime}
                </span>
              </div>
              
              <div className="w-full bg-background/40 rounded-full h-2.5 mb-1">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${
                    module.completed ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-right">
                {module.progress}% Complete
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
