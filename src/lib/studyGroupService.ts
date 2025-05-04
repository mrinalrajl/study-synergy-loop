// Types for study groups
export interface StudyGroupMember {
  id: string;
  name: string;
  joinedAt: number;
  role: 'admin' | 'member';
}

export interface StudyGroupMessage {
  id: string;
  memberId: string;
  memberName: string;
  content: string;
  timestamp: number;
}

export interface StudyGroupSession {
  id: string;
  title: string;
  description: string;
  scheduledFor: number; // timestamp
  duration: number; // minutes
  host: string; // member id
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  createdAt: number;
  members: StudyGroupMember[];
  messages: StudyGroupMessage[];
  sessions: StudyGroupSession[];
  isPublic: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  STUDY_GROUPS: 'study_groups',
  USER_GROUPS: 'user_study_groups',
  CURRENT_USER: 'current_user',
};

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Get current user info
export const getCurrentUser = (): { id: string; name: string } => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // If no user exists, create a default one
    const defaultUser = {
      id: generateId(),
      name: 'User_' + Math.floor(Math.random() * 1000),
    };
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    return defaultUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return { id: generateId(), name: 'Anonymous' };
  }
};

// Get all study groups
export const getAllStudyGroups = (): StudyGroup[] => {
  try {
    const groups = localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS);
    return groups ? JSON.parse(groups) : [];
  } catch (error) {
    console.error('Error getting study groups:', error);
    return [];
  }
};

// Get user's study groups
export const getUserStudyGroups = (): string[] => {
  try {
    const currentUser = getCurrentUser();
    const userGroups = localStorage.getItem(`${STORAGE_KEYS.USER_GROUPS}_${currentUser.id}`);
    return userGroups ? JSON.parse(userGroups) : [];
  } catch (error) {
    console.error('Error getting user study groups:', error);
    return [];
  }
};

// Create a new study group
export const createStudyGroup = (
  name: string,
  description: string,
  topic: string,
  isPublic: boolean = true
): StudyGroup => {
  try {
    const currentUser = getCurrentUser();
    const groups = getAllStudyGroups();
    
    const newGroup: StudyGroup = {
      id: generateId(),
      name,
      description,
      topic,
      createdAt: Date.now(),
      members: [
        {
          id: currentUser.id,
          name: currentUser.name,
          joinedAt: Date.now(),
          role: 'admin',
        },
      ],
      messages: [],
      sessions: [],
      isPublic,
    };
    
    // Add to all groups
    groups.push(newGroup);
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
    
    // Add to user's groups
    const userGroups = getUserStudyGroups();
    userGroups.push(newGroup.id);
    localStorage.setItem(`${STORAGE_KEYS.USER_GROUPS}_${currentUser.id}`, JSON.stringify(userGroups));
    
    return newGroup;
  } catch (error) {
    console.error('Error creating study group:', error);
    throw new Error('Failed to create study group');
  }
};

// Get a specific study group
export const getStudyGroup = (groupId: string): StudyGroup | null => {
  try {
    const groups = getAllStudyGroups();
    return groups.find(group => group.id === groupId) || null;
  } catch (error) {
    console.error('Error getting study group:', error);
    return null;
  }
};

// Join a study group
export const joinStudyGroup = (groupId: string): boolean => {
  try {
    const currentUser = getCurrentUser();
    const groups = getAllStudyGroups();
    const groupIndex = groups.findIndex(group => group.id === groupId);
    
    if (groupIndex === -1) {
      return false;
    }
    
    // Check if user is already a member
    if (groups[groupIndex].members.some(member => member.id === currentUser.id)) {
      return true;
    }
    
    // Add user to group members
    groups[groupIndex].members.push({
      id: currentUser.id,
      name: currentUser.name,
      joinedAt: Date.now(),
      role: 'member',
    });
    
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
    
    // Add to user's groups
    const userGroups = getUserStudyGroups();
    if (!userGroups.includes(groupId)) {
      userGroups.push(groupId);
      localStorage.setItem(`${STORAGE_KEYS.USER_GROUPS}_${currentUser.id}`, JSON.stringify(userGroups));
    }
    
    return true;
  } catch (error) {
    console.error('Error joining study group:', error);
    return false;
  }
};

// Leave a study group
export const leaveStudyGroup = (groupId: string): boolean => {
  try {
    const currentUser = getCurrentUser();
    const groups = getAllStudyGroups();
    const groupIndex = groups.findIndex(group => group.id === groupId);
    
    if (groupIndex === -1) {
      return false;
    }
    
    // Remove user from group members
    groups[groupIndex].members = groups[groupIndex].members.filter(
      member => member.id !== currentUser.id
    );
    
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
    
    // Remove from user's groups
    const userGroups = getUserStudyGroups().filter(id => id !== groupId);
    localStorage.setItem(`${STORAGE_KEYS.USER_GROUPS}_${currentUser.id}`, JSON.stringify(userGroups));
    
    return true;
  } catch (error) {
    console.error('Error leaving study group:', error);
    return false;
  }
};

// Send a message to a study group
export const sendGroupMessage = (groupId: string, content: string): StudyGroupMessage | null => {
  try {
    const currentUser = getCurrentUser();
    const groups = getAllStudyGroups();
    const groupIndex = groups.findIndex(group => group.id === groupId);
    
    if (groupIndex === -1) {
      return null;
    }
    
    // Check if user is a member
    if (!groups[groupIndex].members.some(member => member.id === currentUser.id)) {
      return null;
    }
    
    const newMessage: StudyGroupMessage = {
      id: generateId(),
      memberId: currentUser.id,
      memberName: currentUser.name,
      content,
      timestamp: Date.now(),
    };
    
    groups[groupIndex].messages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
    
    return newMessage;
  } catch (error) {
    console.error('Error sending group message:', error);
    return null;
  }
};

// Schedule a study session
export const scheduleStudySession = (
  groupId: string,
  title: string,
  description: string,
  scheduledFor: number,
  duration: number
): StudyGroupSession | null => {
  try {
    const currentUser = getCurrentUser();
    const groups = getAllStudyGroups();
    const groupIndex = groups.findIndex(group => group.id === groupId);
    
    if (groupIndex === -1) {
      return null;
    }
    
    // Check if user is a member
    if (!groups[groupIndex].members.some(member => member.id === currentUser.id)) {
      return null;
    }
    
    const newSession: StudyGroupSession = {
      id: generateId(),
      title,
      description,
      scheduledFor,
      duration,
      host: currentUser.id,
    };
    
    groups[groupIndex].sessions.push(newSession);
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
    
    return newSession;
  } catch (error) {
    console.error('Error scheduling study session:', error);
    return null;
  }
};

// Search for study groups
export const searchStudyGroups = (query: string): StudyGroup[] => {
  try {
    if (!query) {
      return getAllStudyGroups().filter(group => group.isPublic);
    }
    
    const groups = getAllStudyGroups();
    const lowerQuery = query.toLowerCase();
    
    return groups.filter(
      group =>
        group.isPublic &&
        (group.name.toLowerCase().includes(lowerQuery) ||
          group.description.toLowerCase().includes(lowerQuery) ||
          group.topic.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Error searching study groups:', error);
    return [];
  }
};

// Initialize with some demo groups if none exist
export const initializeStudyGroups = (): void => {
  try {
    const groups = getAllStudyGroups();
    
    if (groups.length === 0) {
      const currentUser = getCurrentUser();
      
      const demoGroups: StudyGroup[] = [
        {
          id: generateId(),
          name: 'AI & ML Study Group',
          description: 'A group for discussing artificial intelligence and machine learning concepts',
          topic: 'AI & Machine Learning',
          createdAt: Date.now(),
          members: [
            {
              id: currentUser.id,
              name: currentUser.name,
              joinedAt: Date.now(),
              role: 'member',
            },
            {
              id: 'demo1',
              name: 'AI Enthusiast',
              joinedAt: Date.now() - 86400000,
              role: 'admin',
            },
            {
              id: 'demo2',
              name: 'ML Engineer',
              joinedAt: Date.now() - 172800000,
              role: 'member',
            },
            {
              id: 'demo3',
              name: 'Data Scientist',
              joinedAt: Date.now() - 259200000,
              role: 'member',
            },
          ],
          messages: [
            {
              id: 'msg1',
              memberId: 'demo1',
              memberName: 'AI Enthusiast',
              content: 'Welcome to the AI & ML study group! Let\'s learn together.',
              timestamp: Date.now() - 86400000,
            },
            {
              id: 'msg2',
              memberId: 'demo2',
              memberName: 'ML Engineer',
              content: 'I\'m working on a neural network project. Anyone interested in collaborating?',
              timestamp: Date.now() - 43200000,
            },
          ],
          sessions: [
            {
              id: 'session1',
              title: 'Introduction to Neural Networks',
              description: 'A beginner-friendly session on neural network basics',
              scheduledFor: Date.now() + 172800000,
              duration: 60,
              host: 'demo1',
            },
          ],
          isPublic: true,
        },
        {
          id: generateId(),
          name: 'Web Development Group',
          description: 'Learn modern web development with React, Node.js, and more',
          topic: 'Web Development',
          createdAt: Date.now(),
          members: [
            {
              id: 'demo4',
              name: 'Frontend Dev',
              joinedAt: Date.now() - 86400000,
              role: 'admin',
            },
            {
              id: 'demo5',
              name: 'Backend Dev',
              joinedAt: Date.now() - 172800000,
              role: 'member',
            },
          ],
          messages: [
            {
              id: 'msg3',
              memberId: 'demo4',
              memberName: 'Frontend Dev',
              content: 'Hey everyone! What are you currently working on?',
              timestamp: Date.now() - 86400000,
            },
          ],
          sessions: [],
          isPublic: true,
        },
        {
          id: generateId(),
          name: 'Data Science Explorers',
          description: 'Exploring data science concepts, tools, and techniques',
          topic: 'Data Science',
          createdAt: Date.now(),
          members: [
            {
              id: 'demo6',
              name: 'Data Analyst',
              joinedAt: Date.now() - 86400000,
              role: 'admin',
            },
            {
              id: 'demo7',
              name: 'Statistician',
              joinedAt: Date.now() - 172800000,
              role: 'member',
            },
          ],
          messages: [],
          sessions: [
            {
              id: 'session2',
              title: 'Data Visualization Workshop',
              description: 'Learn how to create effective data visualizations',
              scheduledFor: Date.now() + 259200000,
              duration: 90,
              host: 'demo6',
            },
          ],
          isPublic: true,
        },
      ];
      
      localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(demoGroups));
      
      // Add the first group to the user's groups
      const userGroups = [demoGroups[0].id];
      localStorage.setItem(`${STORAGE_KEYS.USER_GROUPS}_${currentUser.id}`, JSON.stringify(userGroups));
    }
  } catch (error) {
    console.error('Error initializing study groups:', error);
  }
};

// Call initialization when the service is imported
initializeStudyGroups();