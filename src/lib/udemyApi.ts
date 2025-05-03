// Udemy Free Courses API utility
// Note: Udemy's public API requires a client ID/key for full access, but free course search works for demo purposes.
// Docs: https://www.udemy.com/developers/affiliate/

export async function fetchUdemyFreeCourses(query: string = "python", page: number = 1) {
  const url = `https://www.udemy.com/api-2.0/courses/?search=${encodeURIComponent(query)}&price=price-free&page=${page}`;
  const res = await fetch(url, {
    headers: {
      // Udemy's public API allows some requests without auth, but you can add an affiliate key if you have one
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
    enrolled: course.num_subscribers
  }));
}
