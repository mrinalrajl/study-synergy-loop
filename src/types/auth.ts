export interface User {
  id: string;
  email: string;
  name: string;
  progress: {
    moduleId: number;
    progress: number;
    completed: boolean;
  }[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  updateProgress: (moduleId: number, progress: number, completed: boolean) => void;
  isAuthenticating: boolean;
}
