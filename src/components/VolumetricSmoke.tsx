import { useMemo, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Ground smoke - billows outward horizontally during warmup
export function GroundSmoke({ intensity = 1 }: { intensity?: number }) {
  const particles = useMemo(() => {
    const count = Math.floor(80 * intensity);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: Math.random() * 15,
      size: 8 + Math.random() * 16,
      delay: Math.random() * 0.8,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.4 + Math.random() * 0.4,
      rotation: Math.random() * 360,
    }));
  }, [intensity]);

  return (
    <div 
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[120px] overflow-hidden pointer-events-none"
      style={{ imageRendering: "pixelated" }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            bottom: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `hsl(var(--muted-foreground) / ${p.opacity})`,
            transform: `rotate(${p.rotation}deg)`,
          }}
          initial={{ 
            x: 0, 
            y: 0,
            scale: 0.5,
            opacity: 0,
          }}
          animate={{ 
            x: p.direction * (60 + p.speed * 80),
            y: -(10 + Math.random() * 20),
            scale: [0.5, 1.2, 1.8, 2.2],
            opacity: [0, p.opacity, p.opacity * 0.7, 0],
          }}
          transition={{
            duration: 2 + p.speed,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Dense base layer */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`base-${i}`}
          className="absolute rounded-sm"
          style={{
            left: `${40 + Math.random() * 20}%`,
            bottom: 0,
            width: `${12 + Math.random() * 8}px`,
            height: `${12 + Math.random() * 8}px`,
            backgroundColor: `hsl(var(--muted-foreground) / 0.5)`,
          }}
          animate={{
            x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 30],
            y: [0, -(5 + Math.random() * 10)],
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

interface SmokeParticle {
  id: number;
  spawnTime: number;
  spawnY: number; // World Y position where particle was spawned
  offsetX: number;
  vx: number; // Horizontal velocity for spreading
  vy: number; // Initial downward velocity
  size: number;
  opacity: number;
}

// Ascending smoke trail - spawns from rocket engine position
export function AscendingSmoke({ rocketY }: { rocketY: number }) {
  const [particles, setParticles] = useState<SmokeParticle[]>([]);
  const particleIdRef = useRef(0);
  const lastSpawnYRef = useRef(0);
  
  // Spawn particles as rocket moves
  useEffect(() => {
    const rocketTravel = Math.abs(rocketY);
    const spawnInterval = 8; // Spawn every 8 pixels of travel
    
    // Calculate how many particles to spawn based on distance traveled
    while (lastSpawnYRef.current < rocketTravel) {
      const spawnCount = 3 + Math.floor(Math.random() * 3); // 3-5 particles per spawn
      
      for (let i = 0; i < spawnCount; i++) {
        const newParticle: SmokeParticle = {
          id: particleIdRef.current++,
          spawnTime: Date.now(),
          spawnY: lastSpawnYRef.current,
          offsetX: (Math.random() - 0.5) * 30, // Initial spread
          vx: (Math.random() - 0.5) * 4, // Horizontal velocity: -2 to +2
          vy: 1 + Math.random() * 2, // Initial downward thrust: 1 to 3
          size: 10 + Math.random() * 14,
          opacity: 0.4 + Math.random() * 0.4, // 0.4 to 0.8 range
        };
        
        setParticles(prev => [...prev, newParticle]);
      }
      
      lastSpawnYRef.current += spawnInterval;
    }
  }, [rocketY]);
  
  // Clean up old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => now - p.spawnTime < 4000));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);
  
  // Reset on unmount or when rocket resets
  useEffect(() => {
    return () => {
      lastSpawnYRef.current = 0;
      particleIdRef.current = 0;
    };
  }, []);

  const rocketTravel = Math.abs(rocketY);
  const engineWorldY = rocketTravel; // Engine is at this Y position in world space

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ 
        imageRendering: "pixelated",
        zIndex: 50,
      }}
    >
      {/* Trail particles - each stays at its spawn position with physics */}
      {particles.map((p) => {
        const age = (Date.now() - p.spawnTime) / 1000; // Age in seconds
        const ageNormalized = Math.min(age / 4, 1); // 0 to 1 over 4 seconds
        
        // Physics: position over time
        const horizontalDrift = p.offsetX + p.vx * age * 30; // Spread outward
        const verticalDrift = p.vy * age * 15 - age * age * 8; // Down then slow rise
        
        // Size expansion: grows 2.5x over lifetime
        const scale = 1 + ageNormalized * 2.5;
        
        // Opacity fade
        const fadeOpacity = p.opacity * Math.max(0, 1 - ageNormalized * 0.9);
        
        if (fadeOpacity < 0.05) return null;
        
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              // Position: spawn point + drift
              left: `calc(50% + ${horizontalDrift}px)`,
              bottom: `calc(80px + ${p.spawnY - verticalDrift}px)`,
              width: `${p.size * scale}px`,
              height: `${p.size * scale}px`,
              backgroundColor: `hsl(var(--muted-foreground) / ${fadeOpacity})`,
              transform: 'translateX(-50%)',
            }}
          />
        );
      })}
      
      {/* Fresh smoke burst at current engine position */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const baseRadius = 5 + (i % 3) * 8;
        const randomOffset = Math.random() * 10;
        
        return (
          <motion.div
            key={`fresh-${i}`}
            className="absolute rounded-sm"
            style={{
              left: `calc(50% + ${Math.cos(angle) * baseRadius}px)`,
              bottom: `calc(80px + ${engineWorldY}px)`,
              width: `${6 + (i % 4) * 2}px`,
              height: `${6 + (i % 4) * 2}px`,
              backgroundColor: `hsl(var(--muted-foreground) / ${0.5 + (i % 3) * 0.15})`,
              transform: 'translateX(-50%)',
            }}
            animate={{
              x: [0, Math.cos(angle) * (20 + randomOffset)], // Spread outward
              y: [0, 15 + Math.random() * 25], // Push downward
              scale: [1, 1.8, 2.5],
              opacity: [0.6, 0.4, 0],
            }}
            transition={{
              duration: 0.6 + (i % 5) * 0.1,
              repeat: Infinity,
              delay: i * 0.025,
              ease: "easeOut",
            }}
          />
        );
      })}
      
      {/* Ground smoke base that persists and billows */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px]">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={`ground-persist-${i}`}
            className="absolute rounded-sm"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: `${Math.random() * 40}px`,
              width: `${14 + Math.random() * 12}px`,
              height: `${14 + Math.random() * 12}px`,
              backgroundColor: `hsl(var(--muted-foreground) / ${0.25 + Math.random() * 0.25})`,
            }}
            animate={{
              x: [(Math.random() > 0.5 ? 1 : -1) * Math.random() * 80, (Math.random() > 0.5 ? 1 : -1) * Math.random() * 140],
              y: [0, -(20 + Math.random() * 40)],
              scale: [1, 1.5, 2.2],
              opacity: [0.4, 0.3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Engine exhaust cone - pixelated fire attached to rocket
export function PixelExhaustCone({ intensity = 1 }: { intensity?: number }) {
  const flameRows = Math.floor(4 + intensity * 8);
  
  return (
    <div 
      className="flex flex-col items-center"
      style={{ imageRendering: "pixelated" }}
    >
      {Array.from({ length: flameRows }, (_, rowIndex) => {
        const rowWidth = 3 + Math.floor(rowIndex * 0.8);
        const isCore = rowIndex < 3;
        const isMid = rowIndex >= 3 && rowIndex < 6;
        
        return (
          <motion.div
            key={rowIndex}
            className="flex"
            animate={{
              opacity: [1, 0.7 + Math.random() * 0.3, 1],
              scaleX: [1, 0.9 + Math.random() * 0.2, 1],
            }}
            transition={{
              duration: 0.05 + rowIndex * 0.01,
              repeat: Infinity,
            }}
          >
            {Array.from({ length: rowWidth }, (_, colIndex) => {
              const isEdge = colIndex === 0 || colIndex === rowWidth - 1;
              
              let bgColor: string;
              if (isCore) {
                bgColor = isEdge ? "bg-yellow-300" : "bg-white";
              } else if (isMid) {
                bgColor = isEdge ? "bg-orange-500" : "bg-yellow-400";
              } else {
                bgColor = isEdge ? "bg-red-600" : "bg-orange-500";
              }
              
              return (
                <div
                  key={colIndex}
                  className={`w-1 h-1 ${bgColor}`}
                  style={{
                    opacity: 0.8 + Math.random() * 0.2,
                  }}
                />
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
}
