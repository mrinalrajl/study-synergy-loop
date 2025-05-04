import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface NavbarProps {
  variant: "home" | "profile";
}

export function Navbar({ variant }: NavbarProps) {
  return (
    <nav className="w-full bg-background/80 backdrop-blur border-b border-border/30 shadow-sm fixed top-0 left-0 z-50 font-prism transition-colors duration-500">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" alt="Logo" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="font-extrabold text-3xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-prism drop-shadow-md">Study Synergy Loop</span>
        </div>
        <div className="flex gap-8 items-center text-lg font-semibold font-prism">
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
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
