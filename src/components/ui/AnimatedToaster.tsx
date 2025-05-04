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
    <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-6 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`rounded-2xl shadow-2xl px-8 py-5 min-w-[320px] bg-gradient-to-br from-[#e0e7ff]/90 via-[#f0fdfa]/90 to-[#f5d0fe]/90 dark:from-[#23272f]/90 dark:via-[#18181b]/90 dark:to-[#0f172a]/90 border border-zinc-200 dark:border-zinc-700 flex items-center gap-4 backdrop-blur-2xl animate-bounce-in font-prism relative overflow-hidden`}
            style={{ boxShadow: "0 12px 48px 0 rgba(31,38,135,0.25)" }}
          >
            {/* Water bubble effect */}
            <span className="absolute -top-8 -left-8 w-24 h-24 bg-[#a5b4fc]/30 dark:bg-[#334155]/30 rounded-full blur-2xl animate-bubble-move" />
            <span className="absolute -bottom-8 -right-8 w-20 h-20 bg-[#fbcfe8]/30 dark:bg-[#64748b]/30 rounded-full blur-2xl animate-bubble-move2" />
            <span>
              {toast.type === "success" && <CheckCircle className="text-green-500 animate-pop" />}
              {toast.type === "error" && <XCircle className="text-red-500 animate-pop" />}
              {toast.type === "info" && <CheckCircle className="text-blue-500 animate-pop" />}
            </span>
            <div>
              <div className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 font-prism drop-shadow-sm">{toast.title}</div>
              {toast.message && <div className="text-base text-zinc-600 dark:text-zinc-300 mt-1 font-prism">{toast.message}</div>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <style>{`
        .font-prism {
          font-family: 'Montserrat', 'Quicksand', 'Segoe UI', 'Arial', sans-serif;
          letter-spacing: 0.01em;
        }
        .animate-bounce-in { animation: bounceIn 0.9s cubic-bezier(.36,1.56,.64,1) both; }
        .animate-pop { animation: popIn 0.6s cubic-bezier(.36,1.56,.64,1) both; }
        @keyframes bounceIn { 0% { transform: translateY(-60px) scale(0.92); opacity: 0; } 60% { transform: translateY(12px) scale(1.05); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-bubble-move {
          animation: bubbleMove 14s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.08); }
        }
        .animate-bubble-move2 {
          animation: bubbleMove2 18s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove2 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(16px) scale(1.06); }
        }
      `}</style>
    </div>
  );
}
