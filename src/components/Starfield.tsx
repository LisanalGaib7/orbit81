import { useMemo } from "react";

interface StarfieldProps {
  progress: number; // 0-100
}

export function Starfield({ progress }: StarfieldProps) {
  // Speed multiplier based on progress (0.5x to 3x)
  const speedMultiplier = 0.5 + (progress / 100) * 2.5;
  
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-foreground"
          style={{
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationName: "starfall",
            animationDuration: `${star.duration / speedMultiplier}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `-${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
