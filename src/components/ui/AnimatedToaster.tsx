import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export type AnimatedToast = {
  id: number;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
};

let toastId = 0;

export function useAnimatedToaster() {
  const [toasts, setToasts] = useState<AnimatedToast[]>([]);

  const showToast = (toast: Omit<AnimatedToast, "id">) => {
    toastId++;
    setToasts((prev) => [...prev, { ...toast, id: toastId }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3500);
  };

  return { toasts, showToast };
}

export function AnimatedToaster({ toasts }: { toasts: AnimatedToast[] }) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`rounded-xl shadow-2xl px-6 py-4 min-w-[260px] bg-white/80 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 flex items-center gap-3 backdrop-blur-lg animate-bounce-in`}
            style={{ boxShadow: "0 8px 32px 0 rgba(31,38,135,0.25)" }}
          >
            <span>
              {toast.type === "success" && <CheckCircle className="text-green-500 animate-pop" />}
              {toast.type === "error" && <XCircle className="text-red-500 animate-pop" />}
              {toast.type === "info" && <CheckCircle className="text-blue-500 animate-pop" />}
            </span>
            <div>
              <div className="font-semibold text-base text-zinc-900 dark:text-zinc-100">{toast.title}</div>
              {toast.message && <div className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{toast.message}</div>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Add to index.css:
// .animate-bounce-in { animation: bounceIn 0.7s cubic-bezier(.36,1.56,.64,1) both; }
// .animate-pop { animation: popIn 0.5s cubic-bezier(.36,1.56,.64,1) both; }
// @keyframes bounceIn { 0% { transform: translateY(-40px) scale(0.95); opacity: 0; } 60% { transform: translateY(8px) scale(1.05); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
// @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
