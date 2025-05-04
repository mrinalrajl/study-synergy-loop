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
          "relative group flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-300",
          active ? "text-primary font-medium" : "text-foreground/80 hover:text-primary",
          className
        )}
        {...props}
      >
        {icon && <span className="transition-transform group-hover:scale-110">{icon}</span>}
        <span>{children}</span>
        {underlineEffect && (
          <span 
            className={cn(
              "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
              active && "w-full"
            )}
          />
        )}
      </Link>
    );
  }
);
NavigationLink.displayName = "NavigationLink";

export { NavigationLink };