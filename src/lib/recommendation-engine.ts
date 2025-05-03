
import { useLocalStorage } from "@/hooks/use-local-storage";

// Types
type CourseInteraction = {
  courseId: string;
  viewCount: number;
  clickCount: number;
  enrollCount: number;
  completeCount: number;
  lastInteraction: number;
};

type UserInterest = {
  category: string;
  weight: number; // 0-100
  lastUpdated: number;
};

type UserSkill = {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastUpdated: number;
};

type UserPreferences = {
  preferredDuration: 'short' | 'medium' | 'long' | null;
  preferredLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  preferredFormat: 'video' | 'interactive' | 'text' | null;
  preferredCategories: string[];
};

type RecommendationEngineState = {
  courseInteractions: Record<string, CourseInteraction>;
  interests: Record<string, UserInterest>;
  skills: Record<string, UserSkill>;
  preferences: UserPreferences;
  viewHistory: string[]; // courseIds
};

// Constants
const RECOMMENDATIONS_STORAGE_KEY = 'learning_recommendations_data';
const MAX_HISTORY_SIZE = 100;
const INTEREST_DECAY_RATE = 0.05; // 5% decay per day of inactivity

// Custom hook for recommendation engine
export const useRecommendationEngine = () => {
  // Initialize or load state from storage
  const [recommendationData, setRecommendationData] = useLocalStorage<RecommendationEngineState>(
    RECOMMENDATIONS_STORAGE_KEY,
    {
      courseInteractions: {},
      interests: {},
      skills: {},
      preferences: {
        preferredDuration: null,
        preferredLevel: null,
        preferredFormat: null,
        preferredCategories: [],
      },
      viewHistory: [],
    }
  );

  // Record a course view
  const recordCourseView = (courseId: string) => {
    setRecommendationData(prev => {
      const interaction = prev.courseInteractions[courseId] || {
        courseId,
        viewCount: 0,
        clickCount: 0,
        enrollCount: 0,
        completeCount: 0,
        lastInteraction: Date.now(),
      };
      
      const viewHistory = [courseId, ...prev.viewHistory.filter(id => id !== courseId)].slice(0, MAX_HISTORY_SIZE);
      
      return {
        ...prev,
        courseInteractions: {
          ...prev.courseInteractions,
          [courseId]: {
            ...interaction,
            viewCount: interaction.viewCount + 1,
            lastInteraction: Date.now(),
          }
        },
        viewHistory
      };
    });
  };
  
  // Record a course click (e.g., clicked for more details)
  const recordCourseClick = (courseId: string) => {
    setRecommendationData(prev => {
      const interaction = prev.courseInteractions[courseId] || {
        courseId,
        viewCount: 0,
        clickCount: 0,
        enrollCount: 0,
        completeCount: 0,
        lastInteraction: Date.now(),
      };
      
      return {
        ...prev,
        courseInteractions: {
          ...prev.courseInteractions,
          [courseId]: {
            ...interaction,
            clickCount: interaction.clickCount + 1,
            lastInteraction: Date.now(),
          }
        }
      };
    });
  };
  
  // Record a course enrollment
  const recordCourseEnrollment = (courseId: string) => {
    setRecommendationData(prev => {
      const interaction = prev.courseInteractions[courseId] || {
        courseId,
        viewCount: 0,
        clickCount: 0,
        enrollCount: 0,
        completeCount: 0,
        lastInteraction: Date.now(),
      };
      
      return {
        ...prev,
        courseInteractions: {
          ...prev.courseInteractions,
          [courseId]: {
            ...interaction,
            enrollCount: interaction.enrollCount + 1,
            lastInteraction: Date.now(),
          }
        }
      };
    });
  };
  
  // Record a course completion
  const recordCourseCompletion = (courseId: string) => {
    setRecommendationData(prev => {
      const interaction = prev.courseInteractions[courseId] || {
        courseId,
        viewCount: 0,
        clickCount: 0,
        enrollCount: 0,
        completeCount: 0,
        lastInteraction: Date.now(),
      };
      
      return {
        ...prev,
        courseInteractions: {
          ...prev.courseInteractions,
          [courseId]: {
            ...interaction,
            completeCount: interaction.completeCount + 1,
            lastInteraction: Date.now(),
          }
        }
      };
    });
  };
  
  // Update interest in a category
  const updateInterest = (category: string, weightChange: number) => {
    setRecommendationData(prev => {
      const existingInterest = prev.interests[category] || {
        category,
        weight: 0,
        lastUpdated: Date.now(),
      };
      
      // Clamp weight between 0-100
      const newWeight = Math.max(0, Math.min(100, existingInterest.weight + weightChange));
      
      return {
        ...prev,
        interests: {
          ...prev.interests,
          [category]: {
            ...existingInterest,
            weight: newWeight,
            lastUpdated: Date.now(),
          }
        }
      };
    });
  };
  
  // Update skill level
  const updateSkill = (skillName: string, level: UserSkill['level']) => {
    setRecommendationData(prev => {
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [skillName]: {
            name: skillName,
            level,
            lastUpdated: Date.now(),
          }
        }
      };
    });
  };
  
  // Update user preferences
  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    setRecommendationData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences,
      }
    }));
  };
  
  // Get top interests
  const getTopInterests = (count = 5): UserInterest[] => {
    return Object.values(recommendationData.interests)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, count);
  };
  
  // Get all skills ordered by level
  const getSkills = (): UserSkill[] => {
    return Object.values(recommendationData.skills)
      .sort((a, b) => {
        const levelOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2, 'expert': 3 };
        return levelOrder[b.level] - levelOrder[a.level];
      });
  };
  
  // Decay interests over time
  const decayInactiveInterests = () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    setRecommendationData(prev => {
      const updatedInterests = { ...prev.interests };
      
      Object.keys(updatedInterests).forEach(category => {
        const interest = updatedInterests[category];
        const daysSinceUpdate = (now - interest.lastUpdated) / dayInMs;
        
        if (daysSinceUpdate > 1) {
          const decayFactor = Math.pow(1 - INTEREST_DECAY_RATE, daysSinceUpdate);
          updatedInterests[category] = {
            ...interest,
            weight: Math.max(0, interest.weight * decayFactor),
          };
        }
      });
      
      return {
        ...prev,
        interests: updatedInterests,
      };
    });
  };
  
  // Get recommendation score for a course based on user data
  const getRecommendationScore = (
    courseId: string,
    courseCategories: string[],
    courseLevel: string,
    courseDuration: string
  ): number => {
    const userInterests = recommendationData.interests;
    const userSkills = recommendationData.skills;
    const preferences = recommendationData.preferences;
    
    let score = 50; // Base score
    
    // Interest match
    courseCategories.forEach(category => {
      if (userInterests[category]) {
        score += (userInterests[category].weight / 10);
      }
    });
    
    // Level match
    if (preferences.preferredLevel && courseLevel === preferences.preferredLevel) {
      score += 15;
    }
    
    // Duration match
    if (preferences.preferredDuration && courseDuration === preferences.preferredDuration) {
      score += 10;
    }
    
    // Category preference match
    if (preferences.preferredCategories.some(cat => courseCategories.includes(cat))) {
      score += 20;
    }
    
    // Previously interacted with
    const interaction = recommendationData.courseInteractions[courseId];
    if (interaction) {
      if (interaction.viewCount > 0) score -= 5; // Already viewed
      if (interaction.clickCount > 0) score += 5; // Showed interest
      if (interaction.enrollCount > 0) score -= 50; // Already enrolled
      if (interaction.completeCount > 0) score -= 100; // Already completed
    }
    
    return Math.max(0, Math.min(100, score));
  };
  
  return {
    recordCourseView,
    recordCourseClick,
    recordCourseEnrollment,
    recordCourseCompletion,
    updateInterest,
    updateSkill,
    updatePreferences,
    getTopInterests,
    getSkills,
    decayInactiveInterests,
    getRecommendationScore,
    preferences: recommendationData.preferences,
    viewHistory: recommendationData.viewHistory,
  };
};

// Helper to initialize recommendation engine
export const initRecommendationEngine = () => {
  // Decay inactive interests on startup
  const recommendationData = JSON.parse(localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY) || '{}');
  if (recommendationData && recommendationData.interests) {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    let updated = false;
    
    Object.keys(recommendationData.interests).forEach(category => {
      const interest = recommendationData.interests[category];
      const daysSinceUpdate = (now - interest.lastUpdated) / dayInMs;
      
      if (daysSinceUpdate > 1) {
        const decayFactor = Math.pow(1 - INTEREST_DECAY_RATE, daysSinceUpdate);
        recommendationData.interests[category] = {
          ...interest,
          weight: Math.max(0, interest.weight * decayFactor),
        };
        updated = true;
      }
    });
    
    if (updated) {
      localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recommendationData));
    }
  }
};
