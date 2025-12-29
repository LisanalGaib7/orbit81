import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface PixelConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(38, 100%, 70%)",
  "hsl(45, 100%, 60%)",
  "hsl(30, 90%, 55%)",
];

export function PixelConfetti({ trigger, onComplete }: PixelConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    // Create burst of particles
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 30,
      vy: -Math.random() * 20 - 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 3 + Math.random() * 3,
    }));

    setParticles(newParticles);

    // Animate particles
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx * 0.5,
          y: p.y + p.vy * 0.5 + frame * 0.3,
          vy: p.vy + 0.5, // gravity
        }))
      );

      if (frame > 40) {
        clearInterval(interval);
        setParticles([]);
        onComplete?.();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [trigger, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 ${p.size}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
