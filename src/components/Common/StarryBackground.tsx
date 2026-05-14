import { useEffect, useState } from 'react';

export const StarryBackground = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string; opacity: number }[]>([]);

  useEffect(() => {
    // Generate static stars once on client side
    const newStars = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle 4s ease-in-out infinite`,
            animationDelay: star.delay,
          }}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent to-white opacity-0 -rotate-45" style={{ top: '10%', left: '-10%', animation: 'shootingStar 12s linear infinite' }}></div>
        <div className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent to-white opacity-0 -rotate-45" style={{ top: '25%', left: '10%', animation: 'shootingStar 15s linear infinite 4s' }}></div>
        <div className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent to-white opacity-0 -rotate-45" style={{ top: '40%', left: '-20%', animation: 'shootingStar 18s linear infinite 9s' }}></div>
      </div>
    </div>
  );
};