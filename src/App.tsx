import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";
import { UserProfile } from "./components/UserProfile";
import LearningDashboard from "./components/LearningDashboard";
import InputAnimationDemoPage from "./pages/InputAnimationDemoPage";
import { GroqLoadingIndicator } from "./components/GroqLoadingIndicator";
import PrismBackground from "./components/PrismBackground";
import { Loombot } from "./components/Loombot";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

// Add a class to the document for smooth theme transitions
const ThemeTransitionRoot = () => {
  useEffect(() => {
    // Add transition class to html element for smoother theme changes
    document.documentElement.classList.add('theme-transition');
    
    // Clean up function
    return () => {
      document.documentElement.classList.remove('theme-transition');
    };
  }, []);
  
  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/learning-dashboard" element={
        <ProtectedRoute>
          <LearningDashboard />
        </ProtectedRoute>
      } />
      <Route path="/input-animation-demo" element={<InputAnimationDemoPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeTransitionRoot />
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              {/* Enhanced PrismBackground with medium intensity for better visual effect */}
              <PrismBackground />
              <Toaster />
              <Sonner />
              <AppRoutes />
              <GroqLoadingIndicator variant="overlay" text="Groq is processing your request..." />
              <Loombot />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;