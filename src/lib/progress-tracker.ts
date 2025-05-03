
import { useLocalStorage } from "@/hooks/use-local-storage";
import { trackCourseEngagement, trackLearningTime } from './analytics';

// Types
export type CourseProgress = {
  courseId: string;
  courseName: string;
  startDate: number;
  lastActiveDate: number;
  progress: number; // 0 to 100
  totalTimeSeconds: number;
  completedModules: string[];
  totalModules: number;
};

type ProgressTrackerState = {
  courses: Record<string, CourseProgress>;
  totalLearningTimeSeconds: number;
  weeklyGoalHours: number;
  weeklyProgress: Record<string, number>; // Day of week -> seconds
};

// Constants
const PROGRESS_STORAGE_KEY = 'learning_progress_data';
const ACTIVITY_INTERVAL = 30000; // 30 seconds

// Custom hook for tracking user progress
export const useProgressTracker = () => {
  const [progressData, setProgressData] = useLocalStorage<ProgressTrackerState>(PROGRESS_STORAGE_KEY, {
    courses: {},
    totalLearningTimeSeconds: 0,
    weeklyGoalHours: 5,
    weeklyProgress: {},
  });

  // Start tracking time for a course
  const startTrackingTime = (courseId: string, courseName: string, totalModules: number) => {
    const now = Date.now();
    
    // Create or update course entry
    setProgressData(prev => {
      const existingCourse = prev.courses[courseId];
      
      return {
        ...prev,
        courses: {
          ...prev.courses,
          [courseId]: existingCourse || {
            courseId,
            courseName,
            startDate: now,
            lastActiveDate: now,
            progress: 0,
            totalTimeSeconds: 0,
            completedModules: [],
            totalModules
          }
        }
      };
    });
    
    // Track engagement event
    const isNewEnrollment = !progressData.courses[courseId];
    if (isNewEnrollment) {
      trackCourseEngagement(courseId, 'enroll');
    }
    trackCourseEngagement(courseId, 'start');
    
    // Return a function to stop tracking
    return () => {
      stopTrackingTime(courseId);
    };
  };
  
  // Record time spent on a course
  const recordTimeSpent = (courseId: string, timeSpentSeconds: number) => {
    setProgressData(prev => {
      const course = prev.courses[courseId];
      if (!course) return prev;
      
      const now = Date.now();
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      // Update weekly progress
      const todaysProgress = prev.weeklyProgress[today] || 0;
      
      return {
        ...prev,
        totalLearningTimeSeconds: prev.totalLearningTimeSeconds + timeSpentSeconds,
        courses: {
          ...prev.courses,
          [courseId]: {
            ...course,
            lastActiveDate: now,
            totalTimeSeconds: course.totalTimeSeconds + timeSpentSeconds
          }
        },
        weeklyProgress: {
          ...prev.weeklyProgress,
          [today]: todaysProgress + timeSpentSeconds
        }
      };
    });
    
    // Track analytics
    trackLearningTime(courseId, timeSpentSeconds);
  };
  
  // Stop tracking time for a course
  const stopTrackingTime = (courseId: string) => {
    const course = progressData.courses[courseId];
    if (course) {
      // Nothing to do here as we're just stopping the tracking
      // This method would be more useful if we had an active timer
      trackCourseEngagement(courseId, 'pause');
    }
  };
  
  // Mark a module as completed
  const completeModule = (courseId: string, moduleId: string) => {
    setProgressData(prev => {
      const course = prev.courses[courseId];
      if (!course) return prev;
      
      // Check if already completed
      if (course.completedModules.includes(moduleId)) {
        return prev;
      }
      
      const completedModules = [...course.completedModules, moduleId];
      const progress = Math.round((completedModules.length / course.totalModules) * 100);
      const isFullyCompleted = progress === 100;
      
      return {
        ...prev,
        courses: {
          ...prev.courses,
          [courseId]: {
            ...course,
            completedModules,
            progress,
            lastActiveDate: Date.now()
          }
        }
      };
    });
    
    // Track the progress event
    trackCourseEngagement(courseId, 'progress');
    
    // If course is completed, track that too
    const updatedCourse = progressData.courses[courseId];
    if (updatedCourse && updatedCourse.progress === 100) {
      trackCourseEngagement(courseId, 'complete');
    }
  };
  
  // Set weekly learning goal in hours
  const setWeeklyGoal = (hours: number) => {
    if (hours < 0) hours = 0;
    
    setProgressData(prev => ({
      ...prev,
      weeklyGoalHours: hours
    }));
  };
  
  // Calculate weekly progress percentage
  const getWeeklyProgressPercent = (): number => {
    const weeklyTotalSeconds = Object.values(progressData.weeklyProgress).reduce((sum, day) => sum + day, 0);
    const weeklyGoalSeconds = progressData.weeklyGoalHours * 3600;
    return weeklyGoalSeconds > 0 ? Math.min(100, Math.round((weeklyTotalSeconds / weeklyGoalSeconds) * 100)) : 0;
  };
  
  // Get all course progress data
  const getAllCoursesProgress = (): CourseProgress[] => {
    return Object.values(progressData.courses).sort((a, b) => b.lastActiveDate - a.lastActiveDate);
  };
  
  // Get progress for a specific course
  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return progressData.courses[courseId] || null;
  };
  
  // Reset weekly progress
  const resetWeeklyProgress = () => {
    setProgressData(prev => ({
      ...prev,
      weeklyProgress: {}
    }));
  };
  
  return {
    startTrackingTime,
    recordTimeSpent,
    stopTrackingTime,
    completeModule,
    setWeeklyGoal,
    getWeeklyProgressPercent,
    getAllCoursesProgress,
    getCourseProgress,
    resetWeeklyProgress,
    weeklyGoalHours: progressData.weeklyGoalHours,
    totalLearningTime: progressData.totalLearningTimeSeconds,
    weeklyProgress: progressData.weeklyProgress,
  };
};

// Helper to initialize weekly progress tracking
export const initProgressTracking = () => {
  // Check if we need to reset the weekly progress
  const lastResetKey = 'last_weekly_progress_reset';
  const now = new Date();
  const lastReset = localStorage.getItem(lastResetKey) ? new Date(localStorage.getItem(lastResetKey)!) : null;
  
  // Reset weekly progress if it's been more than a week or there's no last reset
  if (!lastReset || (now.getTime() - lastReset.getTime()) > 7 * 24 * 60 * 60 * 1000) {
    const progressData = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '{}');
    if (progressData) {
      progressData.weeklyProgress = {};
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
    }
    localStorage.setItem(lastResetKey, now.toISOString());
  }
};
