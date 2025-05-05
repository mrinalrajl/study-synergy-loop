import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, ExternalLink, BookOpen, Clock, Tag, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Types for course data
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  students: number;
  instructor: string;
  image: string;
  url: string;
  duration: string;
  level: string;
  price: string;
  isRecommended?: boolean;
}

// Sample course data (this would come from an API or context in a real app)
const SAMPLE_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Machine Learning Fundamentals",
    description: "Learn the core concepts of machine learning and AI with practical examples and projects.",
    category: "AI & Machine Learning",
    tags: ["Python", "Data Science", "AI"],
    rating: 4.9,
    students: 12453,
    instructor: "Dr. Andrew Thomas",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    url: "https://example.com/courses/machine-learning",
    duration: "10 weeks",
    level: "Intermediate",
    price: "$49.99",
    isRecommended: true
  },
  {
    id: "course-2",
    title: "Financial Analysis Masterclass",
    description: "Master financial analysis techniques used by investment professionals and financial analysts.",
    category: "Finance & Business",
    tags: ["Finance", "Excel", "Analysis"],
    rating: 4.8,
    students: 8761,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Emma Rodriguez",
    url: "https://example.com/courses/financial-analysis",
    duration: "8 weeks",
    level: "Advanced",
    price: "$59.99"
  },
  {
    id: "course-3",
    title: "Advanced React Development",
    description: "Take your React skills to the next level with advanced patterns, hooks, and state management.",
    category: "Software Development",
    tags: ["JavaScript", "React", "Frontend"],
    rating: 4.7,
    students: 15320,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Michael Chen",
    url: "https://example.com/courses/advanced-react",
    duration: "6 weeks",
    level: "Advanced",
    price: "$39.99",
    isRecommended: true
  },
  {
    id: "course-4",
    title: "Architectural Design Principles",
    description: "Explore fundamental architectural design principles and techniques for creating stunning structures.",
    category: "Engineering & Design",
    tags: ["Architecture", "Design", "CAD"],
    rating: 4.8,
    students: 6289,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Sophia Williams",
    url: "https://example.com/courses/architectural-design",
    duration: "12 weeks",
    level: "Intermediate",
    price: "$69.99"
  },
  {
    id: "course-5",
    title: "Data Visualization with D3.js",
    description: "Create powerful interactive data visualizations using D3.js and modern web technologies.",
    category: "Data Science",
    tags: ["JavaScript", "D3.js", "Visualization"],
    rating: 4.6,
    students: 7845,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Jason Miller",
    url: "https://example.com/courses/data-visualization",
    duration: "5 weeks",
    level: "Intermediate",
    price: "$29.99",
    isRecommended: true
  },
  {
    id: "course-6",
    title: "Digital Marketing Strategy",
    description: "Develop comprehensive digital marketing strategies to grow your business or personal brand.",
    category: "Marketing",
    tags: ["SEO", "Social Media", "Content"],
    rating: 4.7,
    students: 9321,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Sarah Johnson",
    url: "https://example.com/courses/digital-marketing",
    duration: "8 weeks",
    level: "Beginner",
    price: "$49.99"
  },
  {
    id: "course-7",
    title: "Introduction to Cybersecurity",
    description: "Learn the fundamentals of cybersecurity and how to protect systems from common threats.",
    category: "IT & Security",
    tags: ["Security", "Networks", "Ethical Hacking"],
    rating: 4.9,
    students: 11234,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Robert Chen",
    url: "https://example.com/courses/cybersecurity",
    duration: "10 weeks",
    level: "Beginner",
    price: "$59.99",
    isRecommended: true
  },
  {
    id: "course-8",
    title: "UX/UI Design Fundamentals",
    description: "Master the principles of user experience and interface design for digital products.",
    category: "Design",
    tags: ["UX", "UI", "Figma"],
    rating: 4.8,
    students: 8765,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    instructor: "Emily Wong",
    url: "https://example.com/courses/ux-ui-design",
    duration: "8 weeks",
    level: "Beginner",
    price: "$49.99"
  }
];

// Background component for the Courses page
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

// Course card component with animation
const CourseCard = ({ course, index }: { course: Course; index: number }) => {
  const { toast } = useToast();
  
  const handleEnroll = () => {
    toast({
      title: "Course Enrollment",
      description: `You've enrolled in "${course.title}"`,
    });
  };
  
  const handleVisitCourse = () => {
    // In a real app, this would navigate to the course URL
    window.open(course.url, '_blank');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/40 bg-background/50 backdrop-blur-sm border-primary/10 h-full flex flex-col ${course.isRecommended ? 'ring-2 ring-purple-500/50 dark:ring-purple-600/50' : ''}`}>
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 dark:opacity-30 transition-opacity duration-300 z-10"></div>
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          />
          {course.isRecommended && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center z-20">
              <Sparkles className="h-3 w-3 mr-1" />
              Recommended
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div className="text-xs text-primary dark:text-indigo-400 font-medium mb-1">{course.category}</div>
            <Badge variant="outline" className="text-xs">{course.level}</Badge>
          </div>
          <CardTitle className="text-lg dark:text-slate-100 line-clamp-2">{course.title}</CardTitle>
          <CardDescription className="text-sm dark:text-slate-300">{course.instructor}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
          <div className="flex items-center text-sm mb-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium dark:text-slate-200">{course.rating}</span>
            <span className="text-muted-foreground dark:text-slate-400 ml-2">({course.students.toLocaleString()} students)</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{course.duration}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{course.price}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            className="flex-1 glass-btn-strong dark:bg-indigo-600/50 dark:hover:bg-indigo-600/70 dark:border-indigo-500/30 dark:text-white" 
            variant="secondary"
            onClick={handleEnroll}
          >
            Enroll Now
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleVisitCourse}
            className="dark:border-indigo-500/30 dark:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(SAMPLE_COURSES);
  
  // Filter courses based on search query and active tab
  useEffect(() => {
    let filtered = SAMPLE_COURSES;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tab
    if (activeTab === "recommended") {
      filtered = filtered.filter(course => course.isRecommended);
    } else if (activeTab !== "all") {
      filtered = filtered.filter(course => course.category.toLowerCase().includes(activeTab.toLowerCase()));
    }
    
    setFilteredCourses(filtered);
  }, [searchQuery, activeTab]);
  
  // Get unique categories for tabs
  const categories = Array.from(new Set(SAMPLE_COURSES.map(course => course.category)));
  
  return (
    <div className="min-h-screen w-full relative font-prism">
      <PrismBackground />
      <Navbar variant="home" />
      
      <main className="container mx-auto px-4 py-8 mt-24 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Courses</h1>
          <p className="text-muted-foreground max-w-3xl">
            Explore our curated collection of courses, including personalized recommendations from Loombot. 
            Enhance your skills with high-quality content from top instructors.
          </p>
        </div>
        
        {/* Search and filter section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Category tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 flex flex-wrap h-auto p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                All Courses
              </TabsTrigger>
              <TabsTrigger value="recommended" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Sparkles className="h-4 w-4 mr-1" />
                Recommended
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category.toLowerCase()}
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Course grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any courses matching your search criteria. Try adjusting your filters or search query.
            </p>
            <Button onClick={() => {setSearchQuery(""); setActiveTab("all");}}>
              View All Courses
            </Button>
          </div>
        )}
      </main>
      
      {/* Styling for animations */}
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

export default Courses;