import { useEffect, useState, useMemo } from "react";

interface FireworkProps {
  id: number;
  x: number;
  y: number;
  delay: number;
  color: string;
  size: number;
}

function Firework({ x, y, delay, color, size }: Omit<FireworkProps, "id">) {
  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * 360,
      distance: size + Math.random() * size,
    })), [size]);

  return (
    <div 
      className="absolute"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        animation: `firework-burst 1.5s ease-out forwards`,
        animationDelay: `${delay}s`,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
            transform: `rotate(${p.angle}deg) translateY(-${p.distance}px)`,
            animation: `firework-particle 1.5s ease-out forwards`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
      {/* Central burst */}
      <div 
        className="absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle, white, ${color}, transparent)`,
          animation: `firework-core 0.5s ease-out forwards`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

interface DeepSpaceFireworksProps {
  active: boolean;
}

export function DeepSpaceFireworks({ active }: DeepSpaceFireworksProps) {
  const [fireworks, setFireworks] = useState<FireworkProps[]>([]);

  useEffect(() => {
    if (active) {
      const colors = [
        "hsl(38, 92%, 50%)", // gold
        "hsl(0, 72%, 51%)",  // red
        "hsl(200, 100%, 50%)", // blue
        "hsl(280, 80%, 60%)", // purple
        "hsl(120, 60%, 50%)", // green
      ];

      // Create staggered fireworks
      const newFireworks: FireworkProps[] = [];
      for (let i = 0; i < 15; i++) {
        newFireworks.push({
          id: i,
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 60,
          delay: i * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 30 + Math.random() * 40,
        });
      }
      setFireworks(newFireworks);
    } else {
      setFireworks([]);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {/* Deep space gradient overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "radial-gradient(ellipse at center, hsl(260, 50%, 10%) 0%, hsl(220, 40%, 5%) 100%)",
          opacity: 0.9,
        }}
      />
      
      {/* Fireworks */}
      {fireworks.map((fw) => (
        <Firework
          key={fw.id}
          x={fw.x}
          y={fw.y}
          delay={fw.delay}
          color={fw.color}
          size={fw.size}
        />
      ))}

      {/* Shimmer overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 0%, hsl(38, 92%, 50% / 0.05) 50%, transparent 100%)",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />
    </div>
  );
}