import { memo, useMemo } from "react";

interface StarfieldProps {
  progress: number; // 0-100
}

export const Starfield = memo(function Starfield({ progress }: StarfieldProps) {
  // progress가 바뀔 때마다 speedMultiplier만 바뀌고 stars 배열은 고정
  const speedMultiplier = 0.5 + (progress / 100) * 2.5;

  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 10,
      baseDuration: 8 + Math.random() * 8, // speedMultiplier와 분리
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, []); // 마운트 시 1회만 생성

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
            animationDuration: `${star.baseDuration / speedMultiplier}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `-${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
});
