import { useMemo } from "react";
import { motion } from "framer-motion";

interface SmokeParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  direction: number; // -1 for left, 1 for right
  speed: number;
  opacity: number;
  rotation: number;
}

// Ground smoke - billows outward horizontally during warmup
export function GroundSmoke({ intensity = 1 }: { intensity?: number }) {
  const particles = useMemo(() => {
    const count = Math.floor(80 * intensity);
    return Array.from({ length: count }, (_, i): SmokeParticleData => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: Math.random() * 15,
      size: 8 + Math.random() * 16,
      delay: Math.random() * 0.8,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.4,
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
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
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
          className="absolute"
          style={{
            left: `${40 + Math.random() * 20}%`,
            bottom: 0,
            width: `${12 + Math.random() * 8}px`,
            height: `${12 + Math.random() * 8}px`,
            borderRadius: "50%",
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

interface TrailParticle {
  id: number;
  offsetX: number;
  size: number;
  opacity: number;
  direction: number;
  speed: number;
  spawnY: number;
}

// Ascending smoke trail - spawns from rocket engine position
export function AscendingSmoke({ rocketY }: { rocketY: number }) {
  // Generate continuous stream of smoke particles from engine
  const engineParticles = useMemo(() => {
    // Particles spawn at intervals based on rocket travel distance
    const particleCount = 100;
    return Array.from({ length: particleCount }, (_, i): TrailParticle => ({
      id: i,
      offsetX: (Math.random() - 0.5) * 40, // Random spread from center
      size: 12 + Math.random() * 16,
      opacity: 0.5 + Math.random() * 0.3,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 0.3 + Math.random() * 0.7,
      spawnY: (i / particleCount), // Normalized spawn position along trail
    }));
  }, []);

  const rocketTravel = Math.abs(rocketY);
  
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ 
        imageRendering: "pixelated",
        zIndex: 50,
      }}
    >
      {/* Smoke trail from engine - particles spawned at engine position */}
      {engineParticles.map((p) => {
        // Each particle spawns when rocket passes its spawn point
        const spawnDistance = p.spawnY * rocketTravel;
        const particleAge = (rocketTravel - spawnDistance) / (rocketTravel || 1);
        
        // Only show if rocket has passed this spawn point
        if (particleAge < 0 || particleAge > 1) return null;
        
        // Particles stay at their spawn position (world space)
        const worldY = spawnDistance;
        
        // Expansion and fade based on age
        const expansion = 1 + particleAge * 2.5;
        const fadeOpacity = Math.max(0, p.opacity * (1 - particleAge * 0.8));
        
        // Downward initial velocity then drift
        const downwardDrift = particleAge * 15;
        const sidewaysDrift = p.direction * particleAge * (30 + p.speed * 40);
        
        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `calc(50% + ${p.offsetX + sidewaysDrift}px)`,
              bottom: `calc(80px + ${worldY - downwardDrift}px)`,
              width: `${p.size * expansion}px`,
              height: `${p.size * expansion}px`,
              borderRadius: "50%",
              backgroundColor: `hsl(var(--muted-foreground) / ${fadeOpacity})`,
              transform: 'translateX(-50%)',
            }}
            initial={false}
          />
        );
      })}
      
      {/* Fresh smoke at current engine position */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 5 + Math.random() * 15;
        
        return (
          <motion.div
            key={`fresh-${i}`}
            className="absolute"
            style={{
              left: `calc(50% + ${Math.cos(angle) * radius}px)`,
              bottom: `calc(80px + ${rocketTravel + Math.sin(angle) * radius * 0.5}px)`,
              width: '8px',
              height: '8px',
              borderRadius: "50%",
              backgroundColor: `hsl(var(--muted-foreground) / 0.6)`,
              transform: 'translateX(-50%)',
            }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.6, 0.4, 0],
              y: [0, 20 + Math.random() * 30], // Downward push from engine
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.04,
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
            className="absolute"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: `${Math.random() * 40}px`,
              width: `${14 + Math.random() * 12}px`,
              height: `${14 + Math.random() * 12}px`,
              borderRadius: "50%",
              backgroundColor: `hsl(var(--muted-foreground) / ${0.25 + Math.random() * 0.25})`,
            }}
            animate={{
              x: [(Math.random() > 0.5 ? 1 : -1) * Math.random() * 60, (Math.random() > 0.5 ? 1 : -1) * Math.random() * 100],
              y: [0, -(20 + Math.random() * 40)],
              scale: [1, 1.5, 2],
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
