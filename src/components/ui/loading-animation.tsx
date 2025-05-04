import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  text?: string;
}

export const LoadingAnimation = ({
  size = "md",
  color = "currentColor",
  className,
  text = "Thinking..."
}: LoadingAnimationProps) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const dotSize = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("flex items-center justify-center gap-2", sizeMap[size])}>
        <motion.div
          className={cn("rounded-full", dotSize[size])}
          style={{ backgroundColor: color }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        />
        <motion.div
          className={cn("rounded-full", dotSize[size])}
          style={{ backgroundColor: color }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.2, ease: "easeInOut" }}
        />
        <motion.div
          className={cn("rounded-full", dotSize[size])}
          style={{ backgroundColor: color }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.4, ease: "easeInOut" }}
        />
      </div>
      {text && <p className="text-sm text-muted-foreground mt-2">{text}</p>}
    </div>
  );
};

export const PulsingDots = ({
  size = "md",
  color = "currentColor",
  className,
}: Omit<LoadingAnimationProps, "text">) => {
  const dotSize = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <motion.div
        className={cn("rounded-full", dotSize[size])}
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
      />
      <motion.div
        className={cn("rounded-full", dotSize[size])}
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.2, ease: "easeInOut" }}
      />
      <motion.div
        className={cn("rounded-full", dotSize[size])}
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
};

export const TypingIndicator = ({
  className,
  text = "Groq is thinking...",
}: {
  className?: string;
  text?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-2 p-2 rounded-lg bg-secondary/20", className)}>
      <PulsingDots size="sm" color="currentColor" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
};