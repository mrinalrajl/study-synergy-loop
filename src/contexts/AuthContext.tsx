import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, AuthContextType } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved user session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user session when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const updateProgress = (moduleId: number, progress: number, completed: boolean) => {
    if (!user) return;

    setUser(currentUser => {
      if (!currentUser) return null;

      const updatedProgress = [...currentUser.progress];
      const existingProgressIndex = updatedProgress.findIndex(p => p.moduleId === moduleId);

      if (existingProgressIndex >= 0) {
        updatedProgress[existingProgressIndex] = { moduleId, progress, completed };
      } else {
        updatedProgress.push({ moduleId, progress, completed });
      }

      return {
        ...currentUser,
        progress: updatedProgress
      };
    });
  };

  const login = async (email: string, password: string) => {
    try {
      setIsAuthenticating(true);
      // Simulating authentication with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid credentials');
      }

      const mockUser: User = {
        id: "1",
        email,
        name: "Test User",
        progress: [
          { moduleId: 1, progress: 100, completed: true },
          { moduleId: 2, progress: 60, completed: false },
          { moduleId: 3, progress: 0, completed: false },
        ],
      };
      setUser(mockUser);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    try {
      setIsAuthenticating(true);
      // Simulating API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid email or password too short');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        progress: [
          { moduleId: 1, progress: 0, completed: false },
          { moduleId: 2, progress: 0, completed: false },
          { moduleId: 3, progress: 0, completed: false },
        ],
      };
      setUser(newUser);
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "Successfully logged out.",
    });
    navigate("/login");
  };

  if (isLoading) {
    return null; // or a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProgress, isAuthenticating }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
