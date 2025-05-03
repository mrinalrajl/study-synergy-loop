// Simple analytics service that uses Google Analytics if available
// or falls back to local storage tracking

type AnalyticsEvent = {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
};

// Local storage key for storing events when offline
const LOCAL_EVENTS_KEY = 'learning_platform_analytics_events';

// Track a user event
export const trackEvent = (category: string, action: string, label?: string, value?: number): void => {
  const event: AnalyticsEvent = {
    category,
    action,
    label,
    value,
    timestamp: Date.now()
  };

  // Log to console for development
  console.log('Analytics event:', event);

  // If Google Analytics is available, use it
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-ignore - gtag might not be defined in Window interface
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  } else {
    // Otherwise store in local storage
    storeEventLocally(event);
  }
};

// Track course engagement
export const trackCourseEngagement = (courseId: string, action: 'view' | 'enroll' | 'start' | 'complete' | 'progress'): void => {
  trackEvent('course_engagement', action, courseId);
};

// Track user learning time
export const trackLearningTime = (courseId: string, timeSpentSeconds: number): void => {
  trackEvent('learning_time', 'time_spent', courseId, timeSpentSeconds);
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number): void => {
  trackEvent('search', 'query', query, resultsCount);
};

// Track feature usage
export const trackFeatureUsage = (feature: string, action: string): void => {
  trackEvent('feature_usage', action, feature);
};

// Store events locally when offline
const storeEventLocally = (event: AnalyticsEvent): void => {
  try {
    const storedEvents = localStorage.getItem(LOCAL_EVENTS_KEY);
    const events: AnalyticsEvent[] = storedEvents ? JSON.parse(storedEvents) : [];
    events.push(event);
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to store analytics event locally:', error);
  }
};

// Sync locally stored events with server when connection is restored
export const syncOfflineEvents = (): void => {
  try {
    const storedEvents = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (storedEvents) {
      const events: AnalyticsEvent[] = JSON.parse(storedEvents);
      // TODO: Implement server sync when backend is available
      console.log('Syncing offline events:', events.length);
      // After successful sync, clear local storage
      localStorage.removeItem(LOCAL_EVENTS_KEY);
    }
  } catch (error) {
    console.error('Failed to sync offline analytics events:', error);
  }
};

// Initialize analytics
export const initAnalytics = (): void => {
  if (typeof window !== 'undefined') {
    // Listen for online status to sync events
    window.addEventListener('online', syncOfflineEvents);
  }
};
