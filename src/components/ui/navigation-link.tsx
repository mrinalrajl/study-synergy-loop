import * as React from "react";
import { Link, LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationLinkProps extends LinkProps {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  underlineEffect?: boolean;
  icon?: React.ReactNode;
}

const NavigationLink = React.forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ active = false, children, className, underlineEffect = true, icon, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "relative group flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all duration-300 overflow-hidden",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
          "before:translate-x-[-100%] before:skew-x-[-20deg]",
          "hover:before:translate-x-[100%] before:transition-transform before:duration-700 before:ease-out",
          "dark:before:via-white/20",
          active 
            ? "text-primary font-semibold bg-primary/5 border border-primary/20" 
            : "text-foreground/70 hover:text-foreground border border-transparent hover:border-border/50 hover:bg-accent/50",
          className
        )}
        {...props}
      >
        {icon && <span className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 relative z-10">{icon}</span>}
        <span className="relative z-10 font-medium">{children}</span>
        {underlineEffect && active && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        )}
      </Link>
    );
  }
);
NavigationLink.displayName = "NavigationLink";

export { NavigationLink };