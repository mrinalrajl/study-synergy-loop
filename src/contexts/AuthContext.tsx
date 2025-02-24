
import { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthContextType } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = (email: string, password: string) => {
    // Simulating authentication
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
  };

  const signup = (email: string, name: string, password: string) => {
    // Simulating user creation
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
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "Successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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
