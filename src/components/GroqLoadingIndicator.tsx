import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGroqStore } from "@/lib/groqClient";
import { TypingIndicator, LoadingAnimation } from "@/components/ui/loading-animation";

interface GroqLoadingIndicatorProps {
  variant?: "minimal" | "full" | "overlay";
  text?: string;
  className?: string;
}

export const GroqLoadingIndicator: React.FC<GroqLoadingIndicatorProps> = ({
  variant = "minimal",
  text = "Groq is thinking...",
  className = "",
}) => {
  const { isLoading } = useGroqStore();

  if (!isLoading) return null;

  if (variant === "minimal") {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={className}
          >
            <TypingIndicator text={text} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (variant === "full") {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex flex-col items-center justify-center p-6 ${className}`}
          >
            <LoadingAnimation size="lg" text={text} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Overlay variant
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-card p-8 rounded-xl shadow-lg border border-border"
          >
            <LoadingAnimation size="lg" text={text} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};