import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/glass-button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { BookUser, Bell, Search, LogOut, Menu, Home, LayoutDashboard, User, BookOpen } from "lucide-react";
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
    <nav className={`w-full fixed top-0 left-0 z-50 font-prism transition-all duration-500 px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Back Button */}
        <button onClick={() => window.history.back()} className="ios-nav-button" title="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        {/* Main Navigation Bar */}
        <div className="flex-1 ios-nav-bar">
          <div className="flex items-center justify-between px-4 h-full gap-2">
            {/* Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white/90 hover:text-white transition-colors p-2"
                title="Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="5" width="18" height="4" rx="1"/>
                  <rect x="3" y="11" width="18" height="2" rx="1"/>
                  <rect x="3" y="15" width="18" height="2" rx="1"/>
                </svg>
              </button>
              
              {mobileMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 ios-dropdown">
                  <Link to="/" className="ios-menu-item" onClick={() => setMobileMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    Home
                  </Link>
                  <Link to="/courses" className="ios-menu-item" onClick={() => setMobileMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    Courses
                  </Link>
                  <Link to="/learning-dashboard" className="ios-menu-item" onClick={() => setMobileMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="ios-menu-item" onClick={() => setMobileMenuOpen(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </Link>
                </div>
              )}
            </div>
            
            {/* Brand/Title */}
            <Link to="/" className="flex-1 text-center px-2">
              <span className="text-white text-base sm:text-xl font-semibold tracking-tight truncate block">Study Synergy Loop</span>
            </Link>
            
            {/* Theme Toggle & Logout */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {logout && (
                <button 
                  onClick={logout}
                  className="text-white/90 hover:text-white transition-colors p-2"
                  title="Sign out"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* More Button */}
        {/* <button className="ios-nav-button" title="More options">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
          </svg>
        </button> */}
      </div>
      
      <style>{`
        .ios-nav-bar {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          height: 56px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        
        .ios-nav-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        
        .ios-nav-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }
        
        .ios-nav-button:active {
          transform: scale(0.95);
        }
        
        .ios-dropdown {
          background: rgba(30, 30, 30, 0.95);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 0.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .ios-menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        
        .ios-menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </nav>
  );
}