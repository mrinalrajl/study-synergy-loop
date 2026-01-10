import { useEffect, useState } from 'react';

const ShootingStarsAuth = () => {
  const [stars, setStars] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const starArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`
    }));
    setStars(starArray);
  }, []);

  return (
    <div className="shooting-stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        />
      ))}
      <style>{`
        .shooting-stars-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .shooting-star {
          position: absolute;
          top: -5px;
          width: 2px;
          height: 2px;
          background: linear-gradient(90deg, #fff, transparent);
          border-radius: 50%;
          box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.8);
          animation: shoot linear infinite;
        }
        .shooting-star::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent);
        }
        @keyframes shoot {
          0% {
            transform: translateY(0) translateX(0) rotate(-45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(100vh) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ShootingStarsAuth;
