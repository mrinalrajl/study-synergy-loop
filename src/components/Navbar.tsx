import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/glass-button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { BookUser, Bell, Search, LogOut, Menu, Home, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav className={`w-full backdrop-blur fixed top-0 left-0 z-50 font-prism transition-all duration-500 ${
      scrolled 
        ? "bg-background/90 shadow-md border-b border-border/30" 
        : "bg-background/70 border-b border-border/10"
    }`}>
      <div className="w-full flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 lg:py-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" alt="Logo" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-prism drop-shadow-md">Study Synergy Loop</span>
            {user && variant === "home" && (
              <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {user.name}!</p>
            )}
          </div>
        </div>
        
        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex gap-8 items-center text-lg font-semibold font-prism">
          {variant === "home" ? (
            <>
              <NavigationLink to="/" active={variant === "home"} icon={<Home size={18} />}>
                Home
              </NavigationLink>
              <NavigationLink to="/learning-dashboard" icon={<LayoutDashboard size={18} />}>
                Dashboard
              </NavigationLink>
              <NavigationLink to="/profile" icon={<User size={18} />}>
                Profile
              </NavigationLink>
            </>
          ) : (
            <>
              <NavigationLink to="/profile" active={variant === "profile"} icon={<User size={18} />}>
                Profile
              </NavigationLink>
              <NavigationLink to="/learning-dashboard" icon={<LayoutDashboard size={18} />}>
                Dashboard
              </NavigationLink>
              <NavigationLink to="/" icon={<Home size={18} />}>
                Home
              </NavigationLink>
            </>
          )}
        </div>

        {/* Center Section with Search Bar - Desktop */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-8">
          {variant === "home" && onSearchChange && (
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="text" 
                placeholder="Search for courses..." 
                className="pl-12 py-6 h-12 bg-background/50 border-primary/10 focus:border-primary/30 rounded-xl shadow-sm focus:shadow-md transition-all"
                value={searchQuery}
                onChange={onSearchChange}
              />
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden glass-btn-strong text-zinc-700 dark:text-white hover:bg-primary/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Mobile Search Toggle */}
          {variant === "home" && onSearchChange && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden glass-btn-strong text-zinc-700 dark:text-white hover:bg-primary/10"
              onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {/* Notification Bell */}
          {variant === "home" && (
            <GlassButton 
              variant="ghost" 
              size="icon" 
              className="relative text-zinc-700 dark:text-white hover:bg-primary/10 transition-all"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background"></span>
            </GlassButton>
          )}
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Sign Out Button */}
          {logout && (
            <GlassButton
              onClick={logout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Sign out</span>
            </GlassButton>
          )}
        </div>
      </div>
      
      {/* Mobile Search - only visible when toggled */}
      {variant === "home" && mobileSearchVisible && onSearchChange && (
        <div className="md:hidden p-5 bg-background/80 backdrop-blur-md border-t border-primary/10 animate-fade-down">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search for courses..." 
              className="pl-12 py-6 h-12 bg-background/50 border-primary/10 focus:border-primary/30 rounded-xl"
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
        </div>
      )}
      
      {/* Mobile Navigation - Slide down menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-primary/10 animate-fade-down shadow-lg">
          <div className="flex flex-col py-4 px-6 space-y-4">
            {variant === "home" ? (
              <>
                <NavigationLink to="/" active={true} underlineEffect={false} icon={<Home size={18} />} className="py-3 px-4 hover:bg-primary/10 rounded-lg">
                  Home
                </NavigationLink>
                <NavigationLink to="/learning-dashboard" underlineEffect={false} icon={<LayoutDashboard size={18} />} className="py-3 px-4 hover:bg-primary/10 rounded-lg">
                  Dashboard
                </NavigationLink>
                <NavigationLink to="/profile" underlineEffect={false} icon={<User size={18} />} className="py-3 px-4 hover:bg-primary/10 rounded-lg">
                  Profile
                </NavigationLink>
              </>
            ) : (
              <>
                <NavigationLink to="/" underlineEffect={false} icon={<Home size={18} />} className="py-3 px-4 hover:bg-primary/10 rounded-lg">
                  Home
                </NavigationLink>
                <NavigationLink to="/learning-dashboard" underlineEffect={false} icon={<LayoutDashboard size={18} />} className="py-3 px-4 hover:bg-primary/10 rounded-lg">
                  Dashboard
                </NavigationLink>
                <NavigationLink to="/profile" active={true} underlineEffect={false} icon={<User size={18} />} className="py-3 px-4 hover:bg-primary/10 rounded-lg">
                  Profile
                </NavigationLink>
              </>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fade-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-down {
          animation: fade-down 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
}