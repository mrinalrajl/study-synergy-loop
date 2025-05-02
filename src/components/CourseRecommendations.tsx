
import { useState } from "react";
import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COURSE_CATEGORIES, LATEST_COURSES } from "@/utils/courseData";
import { useToast } from "@/hooks/use-toast";

type CourseType = {
  title: string;
  description: string;
  level: string;
};

interface CourseRecommendationsProps {
  onCourseSelect: (course: string) => void;
}

export const CourseRecommendations = ({ onCourseSelect }: CourseRecommendationsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("AI & Machine Learning");
  const [showLatest, setShowLatest] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleCourseClick = (course: string) => {
    onCourseSelect(course);
    toast({
      title: "Course selected",
      description: `You selected "${course}"`,
    });
  };
  
  return (
    <div className="w-full rounded-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Search className="h-4 w-4 text-primary mr-2" />
          <h3 className="text-base font-medium">Course Recommendations</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLatest(!showLatest)}
          className="text-xs glass-btn"
        >
          {showLatest ? "All Courses" : "Latest Additions"}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(COURSE_CATEGORIES).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="glass-btn text-xs"
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {(showLatest ? LATEST_COURSES[selectedCategory as keyof typeof LATEST_COURSES] : COURSE_CATEGORIES[selectedCategory]).map((course: CourseType, index: number) => (
          <div 
            key={index} 
            className="p-2 bg-background/40 rounded border border-border hover:border-primary/50 cursor-pointer transition-all duration-200 hover:bg-background/60"
            onClick={() => handleCourseClick(course.title)}
          >
            <div className="font-medium text-sm flex justify-between">
              <span>{course.title}</span>
              {showLatest && (
                <span className="px-2 py-0.5 text-xs bg-secondary/30 rounded-full">New</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{course.description}</div>
            <div className="text-xs mt-1 flex justify-between items-center">
              <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                {course.level}
              </span>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-xs">{(4 + Math.random()).toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

