
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
        {modules.map((module) => (
          <div
            key={module.id}
            className={`transform transition-all duration-300 hover:scale-[1.02] ${
              module.completed ? "opacity-100" : "opacity-80"
            }`}
          >
            <div
              className={`relative overflow-hidden rounded-xl shadow-lg bg-white p-6 border-2 ${
                module.completed
                  ? "border-primary"
                  : "border-gray-200 hover:border-secondary"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {module.completed ? (
                    <Trophy className="w-8 h-8 text-primary" />
                  ) : (
                    <Star className="w-8 h-8 text-secondary" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{module.title}</h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>
                <button
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-colors ${
                    module.completed
                      ? "bg-primary hover:bg-primary-hover text-white"
                      : "bg-secondary hover:bg-secondary-hover text-white"
                  }`}
                >
                  <span>{module.completed ? "Review" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    module.completed ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
