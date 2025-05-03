
/**
 * Environment configuration settings for the application
 */

export const ENV = {
  // Default API endpoints
  API: {
    UDEMY: "https://www.udemy.com/api-2.0",
    GEMINI: "/api/gemini", // Proxy endpoint for Gemini API
  },

  // Feature flags
  FEATURES: {
    ENABLE_AI_RECOMMENDATIONS: true,
    ENABLE_PROGRESS_TRACKING: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_SKILL_TRACKING: true,
  },

  // Application settings
  APP: {
    NAME: "Learning Path AI",
    VERSION: "1.0.0",
    STORAGE_PREFIX: "learning_path_",
    DEFAULT_SEARCH_LIMIT: 10,
  },
  
  // Learning settings
  LEARNING: {
    STREAK_THRESHOLD_SECONDS: 300, // 5 minutes minimum to count as learning activity
    INACTIVITY_RESET_DAYS: 2, // Reset streak after 2 days of inactivity
    MIN_COURSE_COMPLETION: 80, // Minimum percentage to mark course as completed
  }
};

// Development settings overrides
if (process.env.NODE_ENV === 'development') {
  ENV.API.UDEMY = "https://www.udemy.com/api-2.0"; // Use the same for development
}

export default ENV;
