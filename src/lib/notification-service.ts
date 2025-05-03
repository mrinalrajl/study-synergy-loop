
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

export type Notification = {
  id: string;
  type: 'reminder' | 'deadline' | 'achievement' | 'recommendation' | 'update';
  title: string;
  message: string;
  timestamp: number; // Unix timestamp
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  courseId?: string;
  actionUrl?: string;
  icon?: string;
};

// Local storage key for storing notifications
const NOTIFICATIONS_KEY = 'learning_platform_notifications';
const NOTIFICATION_SETTINGS_KEY = 'learning_platform_notification_settings';

// Default notification settings
const DEFAULT_NOTIFICATION_SETTINGS = {
  email: false,
  push: false,
  inApp: true,
  reminderFrequency: 'daily', // 'daily' | 'weekly' | 'none'
  courseUpdates: true,
  deadlineReminders: true,
  recommendationAlerts: true,
  achievementNotifications: true,
};

// Get all notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>(NOTIFICATIONS_KEY, []);
  const [settings, setSettings] = useLocalStorage(NOTIFICATION_SETTINGS_KEY, DEFAULT_NOTIFICATION_SETTINGS);
  const { toast } = useToast();

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for new notifications if in-app notifications are enabled
    if (settings.inApp) {
      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000,
      });
    }

    return newNotification;
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Update notification settings
  const updateSettings = (newSettings: Partial<typeof DEFAULT_NOTIFICATION_SETTINGS>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Create a reminder notification
  const createCourseReminder = (courseId: string, courseName: string) => {
    if (settings.deadlineReminders) {
      addNotification({
        type: 'reminder',
        title: 'Course Reminder',
        message: `Continue learning "${courseName}"`,
        priority: 'medium',
        courseId,
        actionUrl: `/course/${courseId}`,
        icon: 'clock',
      });
    }
  };

  // Create a deadline notification
  const createDeadlineAlert = (courseId: string, courseName: string, dueDate: Date) => {
    if (settings.deadlineReminders) {
      const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      addNotification({
        type: 'deadline',
        title: 'Upcoming Deadline',
        message: `"${courseName}" has a deadline in ${daysUntilDue} days`,
        priority: daysUntilDue <= 2 ? 'high' : 'medium',
        courseId,
        actionUrl: `/course/${courseId}`,
        icon: 'calendar',
      });
    }
  };

  // Create a course recommendation
  const createRecommendation = (courseId: string, courseName: string, reason: string) => {
    if (settings.recommendationAlerts) {
      addNotification({
        type: 'recommendation',
        title: 'Recommended Course',
        message: `We think you might like "${courseName}" - ${reason}`,
        priority: 'low',
        courseId,
        actionUrl: `/course/${courseId}`,
        icon: 'star',
      });
    }
  };

  // Create an achievement notification
  const createAchievementNotification = (achievementName: string, description: string) => {
    if (settings.achievementNotifications) {
      addNotification({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `${achievementName}: ${description}`,
        priority: 'medium',
        icon: 'award',
      });
    }
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    createCourseReminder,
    createDeadlineAlert,
    createRecommendation,
    createAchievementNotification,
  };
};

// Schedule notification checks
export const initNotificationScheduler = (checkIntervalMinutes = 60) => {
  // Check for due notifications immediately
  checkForDueNotifications();
  
  // Then set up interval
  const intervalId = setInterval(checkForDueNotifications, checkIntervalMinutes * 60 * 1000);
  
  return () => clearInterval(intervalId);
};

// Check for notifications that should be triggered
const checkForDueNotifications = () => {
  try {
    // Get enrolled courses from localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
    const lastActivity = JSON.parse(localStorage.getItem('last_course_activity') || '{}');
    
    // Current timestamp
    const now = Date.now();
    
    // Check for inactive courses (no activity in the last 3 days)
    enrolledCourses.forEach((courseId: string) => {
      const lastActiveTime = lastActivity[courseId] || 0;
      const daysSinceActive = (now - lastActiveTime) / (1000 * 60 * 60 * 24);
      
      if (daysSinceActive > 3) {
        // This would be handled by the hook in a component
        // createCourseReminder(courseId, "Your Course");
        console.log("Would create reminder for course:", courseId);
      }
    });
    
  } catch (error) {
    console.error("Error checking for due notifications:", error);
  }
};
