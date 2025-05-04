import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookUser, Bell, Search, LogOut, Copy } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  variant: "home" | "profile";
  user?: {
    name?: string;
    [key: string]: any;
  };
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPersonalized?: boolean;
  togglePersonalized?: () => void;
  logout?: () => void;
  removeDuplicates?: () => void;
}

export function Navbar({ 
  variant, 
  user, 
  searchQuery = "", 
  onSearchChange, 
  showPersonalized = false, 
  togglePersonalized, 
  logout,
  removeDuplicates
}: NavbarProps) {
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  return (
    <nav className="w-full bg-background/80 backdrop-blur border-b border-border/30 shadow-sm fixed top-0 left-0 z-50 font-prism transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" alt="Logo" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-prism drop-shadow-md">Study Synergy Loop</span>
            {user && variant === "home" && (
              <p className="text-xs text-muted-foreground">Welcome back, {user.name}!</p>
            )}
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 items-center text-lg font-semibold font-prism">
          {variant === "home" ? (
            <>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/learning-dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
              <Link to="/learning-dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            </>
          )}
        </div>
        
        {/* Search Bar - Desktop */}
        {variant === "home" && onSearchChange && (
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search for courses..." 
                className="pl-10 bg-background/50 border-primary/10 focus:border-primary/30"
                value={searchQuery}
                onChange={onSearchChange}
              />
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle */}
          {variant === "home" && onSearchChange && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden glass-btn-strong text-zinc-700 dark:text-white"
              onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {/* Notification Bell */}
          {variant === "home" && (
            <Button variant="ghost" size="icon" className="relative glass-btn-strong text-zinc-700 dark:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          )}
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Personalize Learning Button */}
          {variant === "home" && togglePersonalized && (
            <Button 
              className="glass-btn-strong text-zinc-700 dark:text-white hidden sm:flex"
              title="Begin your learning journey"
              onClick={togglePersonalized}
            >
              {showPersonalized ? "Browse Courses" : "Personalize Learning"}
            </Button>
          )}
          
          {/* User Profile */}
          {user && (
            <Link to="/profile" className="text-muted-foreground hover:text-foreground">
              <Button variant="ghost" size="icon" className="glass-btn-strong text-zinc-700 dark:text-white">
                <span className="sr-only">Profile</span>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {user?.name?.[0] || "U"}
                </div>
              </Button>
            </Link>
          )}
          
          {/* Sign Out Button */}
          {logout && (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Search - only visible when toggled */}
      {variant === "home" && mobileSearchVisible && onSearchChange && (
        <div className="md:hidden p-4 bg-background/30 border-t border-primary/10">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search for courses..." 
              className="pl-10 bg-background/50 border-primary/10 focus:border-primary/30"
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
        </div>
      )}
      
      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-center border-t border-primary/10 py-2">
        <div className="flex gap-6 items-center text-sm font-medium">
          {variant === "home" ? (
            <>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/learning-dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/learning-dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}