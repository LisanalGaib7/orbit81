import { useMemo, useEffect, useState } from "react";

interface RocketLaunchSequenceProps {
  progress: number; // 0-100
}

type RocketStage = "idle" | "ignition" | "liftoff" | "orbit" | "launching";

function getStage(progress: number, isLaunching: boolean): RocketStage {
  if (isLaunching) return "launching";
  if (progress <= 20) return "idle";
  if (progress <= 50) return "ignition";
  if (progress < 100) return "liftoff";
  return "orbit";
}

// Steam particle component
function SteamParticle({ delay, left }: { delay: number; left: number }) {
  return (
    <div
      className="absolute bottom-0 rounded-full bg-muted-foreground/30"
      style={{
        left: `${left}%`,
        width: "4px",
        height: "4px",
        animation: `steam-rise 2s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// Smoke particle component  
function SmokeParticle({ delay, left, size }: { delay: number; left: number; size: number }) {
  return (
    <div
      className="absolute bottom-0 rounded-full bg-muted-foreground/40"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `smoke-billow 1.5s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// Fire particle component
function FireParticle({ delay, left, intensity }: { delay: number; left: number; intensity: number }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${left}%`,
        bottom: 0,
        width: `${4 + intensity * 4}px`,
        height: `${6 + intensity * 8}px`,
        background: `linear-gradient(to top, hsl(var(--destructive)), hsl(var(--primary)), hsl(45, 100%, 60%))`,
        animation: `fire-flicker 0.15s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: `blur(${intensity}px)`,
        opacity: 0.8 + intensity * 0.2,
      }}
    />
  );
}

// Launchpad component
function Launchpad({ stage }: { stage: RocketStage }) {
  const armRetraction = stage === "idle" ? 0 : stage === "ignition" ? 8 : 20;
  
  if (stage === "orbit") return null;
  
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 transition-all duration-1000">
      {/* Platform base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-muted rounded-sm" />
      
      {/* Gantry tower left */}
      <div 
        className="absolute bottom-2 w-1 h-16 bg-muted-foreground/60 transition-transform duration-700"
        style={{ 
          left: `${20 - armRetraction}%`,
          transform: `rotate(${armRetraction * 0.5}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* Support arm */}
        <div 
          className="absolute top-2 right-0 w-6 h-0.5 bg-muted-foreground/50 transition-transform duration-700 origin-left"
          style={{ transform: `rotate(${armRetraction * 2}deg)` }}
        />
      </div>
      
      {/* Gantry tower right */}
      <div 
        className="absolute bottom-2 w-1 h-16 bg-muted-foreground/60 transition-transform duration-700"
        style={{ 
          right: `${20 - armRetraction}%`,
          transform: `rotate(-${armRetraction * 0.5}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* Support arm */}
        <div 
          className="absolute top-2 left-0 w-6 h-0.5 bg-muted-foreground/50 transition-transform duration-700 origin-right"
          style={{ transform: `rotate(-${armRetraction * 2}deg)` }}
        />
      </div>
    </div>
  );
}

// Main rocket body
function RocketBody({ stage, progress }: { stage: RocketStage; progress: number }) {
  // Calculate vertical position based on stage
  const getVerticalOffset = () => {
    if (stage === "idle") return 0;
    if (stage === "ignition") return 4;
    if (stage === "liftoff") {
      // 51-99% maps to 10-80px
      const liftProgress = (progress - 51) / 48;
      return 10 + liftProgress * 70;
    }
    return 90; // orbit
  };

  const verticalOffset = getVerticalOffset();
  
  // Vibration intensity
  const vibrationClass = 
    stage === "idle" ? "animate-subtle-shake" :
    stage === "ignition" ? "animate-medium-shake" :
    stage === "liftoff" ? "animate-intense-shake" :
    "animate-float";

  return (
    <div 
      className={`relative transition-all duration-1000 ease-out ${vibrationClass}`}
      style={{ transform: `translateY(-${verticalOffset}px)` }}
    >
      {/* Rocket structure */}
      <div className="relative flex flex-col items-center">
        {/* Nose cone */}
        <div 
          className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-transparent transition-colors duration-500"
          style={{ 
            borderBottomColor: stage === "orbit" 
              ? "hsl(var(--primary))" 
              : "hsl(var(--muted-foreground))" 
          }}
        />
        
        {/* Body */}
        <div className="w-4 h-7 bg-secondary-foreground rounded-sm relative overflow-hidden">
          {/* Window */}
          <div 
            className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500"
            style={{
              background: stage === "orbit" 
                ? "radial-gradient(circle, hsl(200, 100%, 60%), hsl(var(--primary)))"
                : "hsl(var(--primary))",
              boxShadow: stage === "orbit" 
                ? "0 0 8px hsl(200, 100%, 60%)"
                : "none",
            }}
          />
          
          {/* Body stripe */}
          <div className="absolute bottom-1 left-0 right-0 h-1 bg-primary/30" />
        </div>
        
        {/* Fins */}
        <div className="flex justify-center -mt-1.5">
          <div className="w-0 h-0 border-t-[8px] border-r-[5px] border-transparent border-t-muted" />
          <div className="w-4 h-1.5 bg-muted" />
          <div className="w-0 h-0 border-t-[8px] border-l-[5px] border-transparent border-t-muted" />
        </div>
      </div>
    </div>
  );
}

// Exhaust effects component
function ExhaustEffects({ stage, progress }: { stage: RocketStage; progress: number }) {
  const steamParticles = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: i * 0.3,
      left: 30 + Math.random() * 40,
    })), []);

  const smokeParticles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.2,
      left: 25 + Math.random() * 50,
      size: 6 + Math.random() * 6,
    })), []);

  const fireParticles = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: i * 0.05,
      left: 35 + Math.random() * 30,
    })), []);

  const getVerticalOffset = () => {
    if (stage === "idle") return 0;
    if (stage === "ignition") return 4;
    if (stage === "liftoff") {
      const liftProgress = (progress - 51) / 48;
      return 10 + liftProgress * 70;
    }
    return 90;
  };

  const verticalOffset = getVerticalOffset();
  const flameIntensity = stage === "ignition" ? 0.5 : stage === "liftoff" ? 1 : stage === "orbit" ? 0.3 : 0;

  return (
    <div 
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-20 transition-all duration-1000"
      style={{ transform: `translateY(-${verticalOffset}px)` }}
    >
      {/* Steam puffs (idle stage) */}
      {stage === "idle" && (
        <div className="absolute bottom-0 left-0 right-0 h-12">
          {steamParticles.map((p) => (
            <SteamParticle key={p.id} delay={p.delay} left={p.left} />
          ))}
        </div>
      )}
      
      {/* Smoke (ignition & liftoff) */}
      {(stage === "ignition" || stage === "liftoff") && (
        <div className="absolute bottom-0 left-0 right-0 h-16">
          {smokeParticles.map((p) => (
            <SmokeParticle key={p.id} delay={p.delay} left={p.left} size={p.size * (stage === "liftoff" ? 1.5 : 1)} />
          ))}
        </div>
      )}
      
      {/* Fire/Flame (ignition, liftoff, orbit) */}
      {flameIntensity > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-20 flex justify-center">
          {/* Main flame cone */}
          <div 
            className="relative transition-all duration-300"
            style={{
              width: `${12 + flameIntensity * 12}px`,
              height: `${16 + flameIntensity * 24}px`,
            }}
          >
            {/* Outer flame */}
            <div 
              className="absolute inset-0 rounded-b-full transition-all duration-300"
              style={{
                background: stage === "orbit"
                  ? "linear-gradient(to bottom, hsl(200, 100%, 50%), hsl(200, 100%, 70%), transparent)"
                  : "linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--destructive)), transparent)",
                boxShadow: stage === "orbit"
                  ? "0 8px 20px hsl(200, 100%, 50% / 0.6)"
                  : `0 ${8 + flameIntensity * 8}px ${16 + flameIntensity * 16}px hsl(var(--primary) / 0.5)`,
                animation: "fire-flicker 0.1s ease-in-out infinite",
              }}
            />
            
            {/* Inner bright core */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 rounded-b-full transition-all duration-300"
              style={{
                top: 0,
                width: `${6 + flameIntensity * 4}px`,
                height: `${10 + flameIntensity * 12}px`,
                background: stage === "orbit"
                  ? "linear-gradient(to bottom, white, hsl(200, 100%, 70%))"
                  : "linear-gradient(to bottom, hsl(60, 100%, 85%), hsl(45, 100%, 60%), hsl(var(--primary)))",
                animation: "fire-flicker 0.08s ease-in-out infinite",
              }}
            />
          </div>
          
          {/* Fire particles */}
          {stage === "liftoff" && fireParticles.map((p) => (
            <FireParticle key={p.id} delay={p.delay} left={p.left} intensity={flameIntensity} />
          ))}
        </div>
      )}
    </div>
  );
}

// Mission badge for orbit
function MissionBadge({ visible }: { visible: boolean }) {
  if (!visible) return null;
  
  return (
    <div 
      className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-fade-in"
    >
      <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
        <span className="animate-pulse">🚀</span>
        <span>ORBIT ACHIEVED</span>
      </div>
    </div>
  );
}

export function RocketLaunchSequence({ progress }: RocketLaunchSequenceProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  
  // Trigger launch animation when reaching 100%
  useEffect(() => {
    if (progress === 100 && !hasLaunched) {
      // Start violent shake then launch
      setTimeout(() => {
        setIsLaunching(true);
        setHasLaunched(true);
      }, 500);
    }
  }, [progress, hasLaunched]);

  // Reset when progress drops from 100
  useEffect(() => {
    if (progress < 100) {
      setIsLaunching(false);
      setHasLaunched(false);
    }
  }, [progress]);

  const stage = getStage(progress, isLaunching);
  
  // Hide rocket after launch animation completes
  if (isLaunching) {
    return (
      <div className="relative w-24 h-32 flex items-end justify-center overflow-visible">
        <div className="animate-rocket-launch">
          {/* Launchpad structure */}
          <Launchpad stage="liftoff" />
          
          {/* Intense exhaust during launch */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-24">
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-b-full"
              style={{
                width: "24px",
                height: "48px",
                background: "linear-gradient(to bottom, hsl(60, 100%, 70%), hsl(38, 92%, 50%), hsl(0, 72%, 51%), transparent)",
                boxShadow: "0 20px 40px hsl(38, 92%, 50% / 0.8)",
                animation: "fire-flicker 0.05s ease-in-out infinite",
              }}
            />
          </div>
          
          {/* Rocket body */}
          <div className="relative z-10 mb-4 animate-intense-shake">
            <RocketBody stage="liftoff" progress={100} />
          </div>
        </div>
      </div>
    );
  }

  // After launch, show empty launchpad
  if (hasLaunched && progress === 100) {
    return (
      <div className="relative w-24 h-32 flex items-end justify-center">
        {/* Empty launchpad with smoke */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-muted rounded-sm" />
          {/* Residual smoke */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-8 opacity-50">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute bottom-0 rounded-full bg-muted-foreground/30"
                style={{
                  left: `${25 + i * 15}%`,
                  width: "8px",
                  height: "8px",
                  animation: `smoke-billow 2s ease-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-24 h-32 flex items-end justify-center">
      {/* Background glow for orbit */}
      {stage === "orbit" && (
        <div 
          className="absolute inset-0 rounded-full opacity-30 animate-pulse"
          style={{
            background: "radial-gradient(circle, hsl(200, 100%, 50%), transparent 70%)",
          }}
        />
      )}
      
      {/* Mission badge */}
      <MissionBadge visible={stage === "orbit"} />
      
      {/* Launchpad structure */}
      <Launchpad stage={stage} />
      
      {/* Exhaust effects (behind rocket) */}
      <ExhaustEffects stage={stage} progress={progress} />
      
      {/* Rocket body */}
      <div className={`relative z-10 mb-4 ${progress >= 95 ? "animate-intense-shake" : ""}`}>
        <RocketBody stage={stage} progress={progress} />
      </div>
    </div>
  );
}