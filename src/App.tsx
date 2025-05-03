import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Toaster } from "@/components/ui/toaster"
import { Dashboard } from "./pages/Dashboard";
import { initFirebase } from "./lib/firebase-config";
import { initProgressTracking } from "./lib/progress-tracker";
import { initRecommendationEngine } from "./lib/recommendation-engine";
import { initNotificationScheduler } from "./lib/notification-service";
import { initAnalytics, syncOfflineEvents } from "./lib/analytics";

// Initialize all services
initFirebase();
initProgressTracking();
initRecommendationEngine();
initAnalytics();

// Set up notification scheduler
const cleanup = initNotificationScheduler();

// Add dashboard to the routes
function App() {
  // Clean up notification scheduler on unmount
  React.useEffect(() => {
    syncOfflineEvents();
    return () => {
      cleanup();
    };
  }, []);
  
  // Return of App component
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Add more routes here as needed */}
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
