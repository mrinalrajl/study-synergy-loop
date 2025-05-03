
// Progress tracker for monitoring user learning progress

type CourseProgress = {
  courseId: string;
  title: string;
  progress: number; // 0-100
  lastAccessed: number; // timestamp
  completed: boolean;
  timeSpent: number; // in seconds
  modules?: {
    id: string;
    title: string;
    completed: boolean;
    timeSpent: number;
  }[];
};

type UserSkill = {
  name: string;
  level: number; // 1-5
  lastUpdated: number; // timestamp
};

const STORAGE_KEYS = {
  COURSE_PROGRESS: 'course_progress',
  USER_SKILLS: 'user_skills',
  ENROLLED_COURSES: 'enrolled_courses',
};

// Safely get from storage with a fallback
const safeGetFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return fallback;
  }
};

// Get all courses progress
export const getAllCoursesProgress = (): Record<string, CourseProgress> => {
  return safeGetFromStorage(STORAGE_KEYS.COURSE_PROGRESS, {});
};

// Get progress for a specific course
export const getCourseProgress = (courseId: string): CourseProgress | null => {
  const allProgress = getAllCoursesProgress();
  return allProgress[courseId] || null;
};

// Update course progress
export const updateCourseProgress = (
  courseId: string,
  title: string,
  updates: Partial<CourseProgress>
): void => {
  try {
    const allProgress = getAllCoursesProgress();
    
    // If course doesn't exist, create it
    if (!allProgress[courseId]) {
      allProgress[courseId] = {
        courseId,
        title,
        progress: 0,
        lastAccessed: Date.now(),
        completed: false,
        timeSpent: 0,
        modules: [],
      };
    }
    
    // Update with new values
    allProgress[courseId] = {
      ...allProgress[courseId],
      ...updates,
      lastAccessed: Date.now(), // Always update last accessed
    };
    
    localStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(allProgress));
    
  } catch (error) {
    console.error('Error updating course progress:', error);
  }
};

// Mark course as completed
export const markCourseCompleted = (courseId: string): void => {
  const course = getCourseProgress(courseId);
  if (course) {
    updateCourseProgress(courseId, course.title, {
      progress: 100,
      completed: true,
    });
  }
};

// Get user skills
export const getUserSkills = (): UserSkill[] => {
  return safeGetFromStorage(STORAGE_KEYS.USER_SKILLS, []);
};

// Update user skill
export const updateUserSkill = (skillName: string, level: number): void => {
  try {
    const skills = getUserSkills();
    const existingSkillIndex = skills.findIndex(s => s.name === skillName);
    
    if (existingSkillIndex >= 0) {
      // Update existing skill
      skills[existingSkillIndex] = {
        ...skills[existingSkillIndex],
        level,
        lastUpdated: Date.now(),
      };
    } else {
      // Add new skill
      skills.push({
        name: skillName,
        level,
        lastUpdated: Date.now(),
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.USER_SKILLS, JSON.stringify(skills));
    
  } catch (error) {
    console.error('Error updating user skill:', error);
  }
};

// Get enrolled courses
export const getEnrolledCourses = (): string[] => {
  return safeGetFromStorage(STORAGE_KEYS.ENROLLED_COURSES, []);
};

// Enroll in a course
export const enrollInCourse = (courseId: string, courseTitle: string): void => {
  try {
    const enrolledCourses = getEnrolledCourses();
    
    if (!enrolledCourses.includes(courseId)) {
      enrolledCourses.push(courseId);
      localStorage.setItem(STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(enrolledCourses));
      
      // Initialize course progress
      updateCourseProgress(courseId, courseTitle, {
        progress: 0,
        completed: false,
      });
    }
    
  } catch (error) {
    console.error('Error enrolling in course:', error);
  }
};

// Track time spent on a course
export const trackTimeSpent = (courseId: string, seconds: number): void => {
  const course = getCourseProgress(courseId);
  if (course) {
    updateCourseProgress(courseId, course.title, {
      timeSpent: (course.timeSpent || 0) + seconds,
    });
  }
};

// Get total learning time across all courses
export const getTotalLearningTime = (): number => {
  const allProgress = getAllCoursesProgress();
  return Object.values(allProgress).reduce((total, course) => {
    return total + (course.timeSpent || 0);
  }, 0);
};

// Get learning streak (consecutive days)
export const getLearningStreak = (): number => {
  // This is a simplified implementation
  // A more sophisticated implementation would track daily learning activity
  return safeGetFromStorage('learning_streak', 0);
};

// Update learning streak
export const updateLearningStreak = (): void => {
  try {
    const lastActivity = safeGetFromStorage('last_learning_activity', 0);
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = today - 86400000; // 24 hours in milliseconds
    
    if (lastActivity >= yesterday && lastActivity < today) {
      // User was active yesterday, increment streak
      const currentStreak = getLearningStreak();
      localStorage.setItem('learning_streak', JSON.stringify(currentStreak + 1));
    } else if (lastActivity < yesterday) {
      // User wasn't active yesterday, reset streak
      localStorage.setItem('learning_streak', JSON.stringify(1));
    }
    
    // Update last activity to today
    localStorage.setItem('last_learning_activity', JSON.stringify(today));
    
  } catch (error) {
    console.error('Error updating learning streak:', error);
  }
};

// Get recommended courses based on user's learning history
export const getRecommendedCourseIds = (): string[] => {
  return safeGetFromStorage('recommended_courses', []);
};

// Set recommended courses
export const setRecommendedCourseIds = (courseIds: string[]): void => {
  try {
    localStorage.setItem('recommended_courses', JSON.stringify(courseIds));
  } catch (error) {
    console.error('Error setting recommended courses:', error);
  }
};
