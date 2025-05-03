import { useState, useEffect } from "react";
import { Search, Star, BookUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COURSE_CATEGORIES, LATEST_COURSES } from "@/utils/courseData";
import { useToast } from "@/hooks/use-toast";
import { fetchGroq } from "@/lib/groqClient";
import { fetchUdemyFreeCourses } from "@/lib/udemyApi";

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
  const [isAIRecommended, setIsAIRecommended] = useState<boolean>(false);
  const [aiCourses, setAiCourses] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [udemyCourses, setUdemyCourses] = useState<any[]>([]);
  const [isLoadingUdemy, setIsLoadingUdemy] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("enrolled_courses") || "[]");
    } catch {
      return [];
    }
  });
  const { toast } = useToast();

  const fallbackCourses = [
    "1. JavaScript Essentials - Core JS concepts for all levels.",
    "2. React Mastery - Build interactive UIs with React.",
    "3. Data Structures - Learn algorithms and data structures.",
    "4. Cloud Computing Basics - Intro to AWS, Azure, and GCP.",
    "5. Machine Learning Crash Course - ML for everyone."
  ];
  
  const handleCourseClick = (course: string) => {
    onCourseSelect(course);
    toast({
      title: "Course selected",
      description: `You selected "${course}". Ask for personalized learning path.`,
    });
  };
  
  const handleAIRecommend = async () => {
    setIsLoadingAI(true);
    setAiCourses([]);
    try {
      const prompt = `Suggest 5 trending or highly recommended courses for the category: ${selectedCategory}. Format as a numbered list with course title and a short description.`;
      // Use Groq instead of Gemini
      const aiText = await fetchGroq(prompt);
      console.log("Groq raw response:", aiText); // Debug log
      const lines = aiText.split(/\n|\r/).filter(Boolean).slice(0, 5);
      setAiCourses(lines.length ? lines : fallbackCourses);
    } catch (err) {
      toast({
        title: "AI Error",
        description: "Could not fetch AI recommendations.",
        variant: "destructive",
      });
      setAiCourses(fallbackCourses);
    } finally {
      setIsLoadingAI(false);
    }
  };
  
  const toggleAIRecommendations = () => {
    setIsAIRecommended(!isAIRecommended);
    if (!isAIRecommended) {
      handleAIRecommend();
      toast({
        title: "AI Recommendations Enabled",
        description: "Recommendations will be personalized using Groq AI",
      });
    }
  };

  const handleEnroll = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      const updated = [...enrolledCourses, courseId];
      setEnrolledCourses(updated);
      localStorage.setItem("enrolled_courses", JSON.stringify(updated));
      toast({ title: "Enrolled!", description: "Course added to your learning path." });
    }
  };

  useEffect(() => {
    setIsLoadingUdemy(true);
    fetchUdemyFreeCourses(selectedCategory)
      .then(setUdemyCourses)
      .catch(() => setUdemyCourses([]))
      .finally(() => setIsLoadingUdemy(false));
  }, [selectedCategory]);
  
  return (
    <div className="w-full rounded-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Search className="h-4 w-4 text-primary mr-2" />
          <h3 className="text-base font-medium">Course Recommendations</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAIRecommendations}
            className="text-xs glass-btn"
          >
            <BookUser className="h-4 w-4 mr-1" />
            {isAIRecommended ? "Standard View" : "AI Recommendations"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLatest(!showLatest)}
            className="text-xs glass-btn"
          >
            {showLatest ? "All Courses" : "Latest Additions"}
          </Button>
        </div>
      </div>
      
      {isAIRecommended ? (
        <div className="mb-4">
          {isLoadingAI ? (
            <div className="text-muted-foreground">Loading AI recommendations...</div>
          ) : aiCourses.length > 0 ? (
            <ul className="space-y-2">
              {aiCourses.map((rec, i) => (
                <li key={i} className="p-2 bg-background/40 rounded border border-border">
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground">No AI recommendations yet.</div>
          )}
        </div>
      ) : (
        <>
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
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoadingUdemy ? (
              <div className="text-muted-foreground">Loading free courses...</div>
            ) : udemyCourses.length > 0 ? (
              udemyCourses.map((course) => (
                <div key={course.id} className="p-2 bg-background/40 rounded border border-border flex gap-3 items-center">
                  <img src={course.image} alt={course.title} className="w-20 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium text-sm flex justify-between">
                      <a href={course.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{course.title}</a>
                      <span className="px-2 py-0.5 text-xs bg-secondary/30 rounded-full">Free</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{course.description}</div>
                    <div className="text-xs mt-1 flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full">{course.instructor}</span>
                      <span className="ml-2">⭐ {course.rating?.toFixed(1) || "N/A"}</span>
                      <span className="ml-2">👥 {course.enrolled}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={enrolledCourses.includes(course.id) ? "default" : "outline"}
                    className="ml-2 text-xs"
                    disabled={enrolledCourses.includes(course.id)}
                    onClick={() => handleEnroll(course.id)}
                  >
                    {enrolledCourses.includes(course.id) ? "Enrolled" : "Enroll"}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No free courses found.</div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              Progress: {enrolledCourses.length} enrolled
            </div>
          </div>
        </>
      )}
    </div>
  );
};

