
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
  login: (email: string, password: string) => void;
  signup: (email: string, name: string, password: string) => void;
  logout: () => void;
}
