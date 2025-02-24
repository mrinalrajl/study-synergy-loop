
import { Trophy, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Module {
  id: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
}

export const LearningPath = () => {
  const [modules] = useState<Module[]>([
    {
      id: 1,
      title: "Basics",
      description: "Start your journey here",
      progress: 100,
      completed: true,
    },
    {
      id: 2,
      title: "Intermediate",
      description: "Take your skills further",
      progress: 60,
      completed: false,
    },
    {
      id: 3,
      title: "Advanced",
      description: "Master complex concepts",
      progress: 0,
      completed: false,
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-8 animate-fade-in">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={`transform transition-all duration-300 hover:scale-[1.02] ${
              module.completed ? "opacity-100" : "opacity-80"
            }`}
            aria-label={`${module.title} module - ${module.completed ? "Completed" : "In Progress"}`}
          >
            <div
              className={`relative overflow-hidden rounded-xl shadow-lg bg-white p-6 border-2 ${
                module.completed
                  ? "border-primary"
                  : index === 0 || modules[index - 1]?.completed
                  ? "border-secondary hover:border-secondary-hover cursor-pointer"
                  : "border-gray-200 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {module.completed ? (
                    <Trophy className="w-8 h-8 text-primary animate-bounce" />
                  ) : (
                    <Star className="w-8 h-8 text-secondary" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{module.title}</h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>
                <button
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-300 ${
                    module.completed
                      ? "bg-primary hover:bg-primary-hover text-white transform hover:scale-105"
                      : index === 0 || modules[index - 1]?.completed
                      ? "bg-secondary hover:bg-secondary-hover text-white transform hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!module.completed && !(index === 0 || modules[index - 1]?.completed)}
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
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${
                    module.completed ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 text-right">
                {module.progress}% Complete
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
