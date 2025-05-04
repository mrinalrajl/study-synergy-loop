import React, { useEffect } from 'react';

interface PrismBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  addBodyClass?: boolean;
}

export function PrismBackground({ intensity = 'medium', addBodyClass = true }: PrismBackgroundProps) {
  useEffect(() => {
    if (addBodyClass) {
      document.body.classList.add("font-prism");
      return () => document.body.classList.remove("font-prism");
    }
  }, [addBodyClass]);

  // Adjust blur intensity based on prop
  const getBlurIntensity = () => {
    switch (intensity) {
      case 'low': return 'blur-xl';
      case 'high': return 'blur-3xl';
      default: return 'blur-2xl';
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden font-prism pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#f5d0fe] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#0f172a] animate-gradient-move transition-colors duration-700" />
      <div className={`absolute top-1/4 left-1/3 w-96 h-96 bg-[#a5b4fc]/40 dark:bg-[#334155]/40 rounded-full ${getBlurIntensity()} animate-bubble-move`} />
      <div className={`absolute top-2/3 left-2/4 w-72 h-72 bg-[#fbcfe8]/40 dark:bg-[#64748b]/40 rounded-full ${intensity === 'high' ? 'blur-3xl' : 'blur-2xl'} animate-bubble-move2`} />
      <div className={`absolute top-1/2 left-2/5 w-60 h-60 bg-[#99f6e4]/40 dark:bg-[#0ea5e9]/20 rounded-full ${intensity === 'low' ? 'blur-xl' : 'blur-2xl'} animate-bubble-move3`} />
      {/* Sunlight blue effect on bubble */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none">
        <div className="absolute w-40 h-40 left-24 top-10 bg-gradient-to-br from-blue-300/60 via-white/40 to-transparent rounded-full blur-2xl opacity-70 animate-sunlight-glow dark:from-blue-500/20 dark:via-blue-800/10 dark:opacity-40" />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Quicksand:wght@500;700&display=swap');
        .font-prism {
          font-family: 'Montserrat', 'Quicksand', 'Segoe UI', 'Arial', sans-serif;
          letter-spacing: 0.01em;
        }
        .animate-gradient-move {
          animation: gradientMove 16s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-bubble-move {
          animation: bubbleMove 12s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-40px) scale(1.13); }
        }
        .animate-bubble-move2 {
          animation: bubbleMove2 18s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove2 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(30px) scale(1.11); }
        }
        .animate-bubble-move3 {
          animation: bubbleMove3 22s cubic-bezier(.4,0,.2,1) infinite alternate;
        }
        @keyframes bubbleMove3 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.15); }
        }
        .animate-sunlight-glow {
          animation: sunlightGlow 6s ease-in-out infinite alternate;
        }
        @keyframes sunlightGlow {
          0% { opacity: 0.5; filter: blur(16px); }
          100% { opacity: 1; filter: blur(32px); }
        }
      `}</style>
    </div>
  );
}

export default PrismBackground;