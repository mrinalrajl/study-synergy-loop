
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Optional: play a sound when theme changes
    const audio = new Audio();
    audio.volume = 0.2;
    audio.src = newTheme === "dark" 
      ? "data:audio/mp3;base64,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" 
      : "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAADAAYGBgYGBgYGBgYGBgYGBgYGBgfX19fX19fX19fX19fX19fX19mpqampqampqampqampqampqavr6+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7+/v7+//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAWgAAAAAAAAMADuFwD2AAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    audio.play();
  };

  if (!mounted) {
    return (
      <div className="w-14 h-7 flex items-center justify-between p-1 rounded-full bg-background/50 border border-input">
        <div className="w-5 h-5"></div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-14 h-7 flex items-center justify-between p-1 rounded-full transition-colors ${
        theme === 'dark' 
          ? 'bg-slate-700 border-slate-600' 
          : 'bg-amber-100 border-amber-200'
      } border glass-btn-strong`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          theme === 'dark' ? 'bg-slate-800 ml-auto' : 'bg-amber-300'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="h-3 w-3 text-white" />
        ) : (
          <Sun className="h-3 w-3 text-amber-700" />
        )}
      </motion.div>
    </button>
  );
}
