
export interface UserProgress {
  moduleId: number;
  progress: number;
  completed: boolean;
}

export interface UserProfile {
  bio?: string;
  avatar?: string;
  goal?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    calendar: boolean;
  };
  visibility?: string;
  weeklyTarget?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  progress: UserProgress[];
  profile?: UserProfile;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  updateProgress: (moduleId: number, progress: number, completed: boolean) => void;
  updateUserProfile?: (profile: UserProfile) => void;
  isAuthenticating: boolean;
}
