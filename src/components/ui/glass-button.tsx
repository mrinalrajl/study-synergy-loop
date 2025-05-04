import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-background/70 backdrop-blur-md border border-border/30 shadow-sm hover:bg-background/90 hover:shadow-md",
        primary: "bg-primary/80 backdrop-blur-md text-primary-foreground border border-primary/30 shadow-sm hover:bg-primary/90 hover:shadow-md",
        secondary: "bg-secondary/80 backdrop-blur-md text-secondary-foreground border border-secondary/30 shadow-sm hover:bg-secondary/90 hover:shadow-md",
        accent: "bg-accent/80 backdrop-blur-md text-accent-foreground border border-accent/30 shadow-sm hover:bg-accent/90 hover:shadow-md",
        ghost: "hover:bg-background/50 hover:backdrop-blur-md",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };