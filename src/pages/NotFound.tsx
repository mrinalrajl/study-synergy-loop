import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const attemptedPath = location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      attemptedPath
    );
  }, [attemptedPath]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-md w-full bg-background/50 backdrop-blur-lg rounded-xl shadow-lg border border-primary/10 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {attemptedPath && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">
              <span className="font-medium">Attempted path:</span> {attemptedPath}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            variant="default" 
            className="flex items-center gap-2"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>If you believe this is an error, please contact support.</p>
      </div>
      
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default NotFound;