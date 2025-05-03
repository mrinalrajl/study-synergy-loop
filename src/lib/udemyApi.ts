
// Udemy Free Courses API utility
// Note: Udemy's public API requires a client ID/key for full access, but free course search works for demo purposes.
// Docs: https://www.udemy.com/developers/affiliate/

type UdemyCourse = {
  id: string;
  title: string;
  url: string;
  image: string;
  instructor: string;
  description: string;
  price: string;
  rating: number;
  enrolled: number;
  level?: string;
  category?: string;
};

export async function fetchUdemyFreeCourses(
  query: string = "python", 
  page: number = 1,
  filter: string = "price-free",
  sortBy: string = "relevance"
): Promise<UdemyCourse[]> {
  try {
    const url = `https://www.udemy.com/api-2.0/courses/?search=${encodeURIComponent(query)}&price=${filter}&page=${page}&ordering=${sortBy}&page_size=10`;
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json, text/plain, */*"
      }
    });
    
    if (!res.ok) throw new Error("Failed to fetch Udemy courses");
    const data = await res.json();
    
    // Normalize the data
    return (data.results || []).map((course: any) => ({
      id: course.id,
      title: course.title,
      url: `https://www.udemy.com${course.url}`,
      image: course.image_480x270,
      instructor: course.visible_instructors?.[0]?.display_name || "Instructor",
      description: course.headline,
      price: course.price,
      rating: course.avg_rating,
      enrolled: course.num_subscribers,
      level: course.instructional_level_simple,
      category: course.primary_subcategory?.title || course.primary_category?.title || "General",
    }));
  } catch (error) {
    console.error("Error fetching Udemy courses:", error);
    return [];
  }
}

export async function fetchTrendingTechnologies(): Promise<string[]> {
  // This would normally fetch from an API, but for demo purposes we'll return a static list
  return [
    "Python",
    "React",
    "JavaScript",
    "Data Science",
    "Machine Learning",
    "Web Development",
    "UI/UX Design",
    "Cloud Computing",
    "DevOps",
    "Blockchain"
  ];
}

export async function fetchCourseRecommendations(
  userInterests: string[] = [], 
  userLevel: string = "beginner"
): Promise<UdemyCourse[]> {
  try {
    // Default to some common topics if no interests provided
    const searchTopics = userInterests.length > 0 
      ? userInterests 
      : ["programming", "web development", "data science"];
    
    // Pick a random topic from the list
    const randomTopic = searchTopics[Math.floor(Math.random() * searchTopics.length)];
    
    // Fetch courses based on the selected topic
    return await fetchUdemyFreeCourses(randomTopic);
  } catch (error) {
    console.error("Error fetching course recommendations:", error);
    return [];
  }
}

export async function searchCourses(query: string): Promise<UdemyCourse[]> {
  if (!query || query.trim() === '') return [];
  return fetchUdemyFreeCourses(query);
}
