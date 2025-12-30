import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { PixelRocketBody } from "./PixelRocketBody";
import { GroundSmoke, AscendingSmoke } from "./VolumetricSmoke";

interface RocketLaunchSequenceProps {
  progress: number; // 0-100
  onLaunchStart?: () => void;
}

type RocketStage = 
  | "idle"           // 0-15%: Idle on launchpad with subtle vibration
  | "venting"        // 16-30%: Gantry arms retract, steam/venting effects
  | "ignition"       // 31-45%: Engine ignition, hovers slightly
  | "ascent-slow"    // 46-60%: Slow ascent, stars scroll
  | "ascent-fast"    // 61-80%: Acceleration phase, larger flame
  | "orbit"          // 81-99%: High-altitude orbit, hull glow
  | "launching"      // 100%: Grand cinematic launch
  | "struggle"       // Launch phase internal
  | "ascending";     // Launch phase internal

function getStage(progress: number, isLaunching: boolean): RocketStage {
  if (isLaunching) return "launching";
  if (progress <= 15) return "idle";
  if (progress <= 30) return "venting";
  if (progress <= 45) return "ignition";
  if (progress <= 60) return "ascent-slow";
  if (progress <= 80) return "ascent-fast";
  if (progress < 100) return "orbit";
  return "orbit";
}

// Steam particle component
function SteamParticle({ delay, left }: { delay: number; left: number }) {
  return (
    <div
      className="absolute bottom-0 rounded-sm bg-muted-foreground/30"
      style={{
        left: `${left}%`,
        width: "4px",
        height: "4px",
        animation: `steam-rise 2s ease-out infinite`,
        animationDelay: `${delay}s`,
        imageRendering: "pixelated",
      }}
    />
  );
}

// Smoke particle component  
function SmokeParticle({ delay, left, size }: { delay: number; left: number; size: number }) {
  return (
    <div
      className="absolute bottom-0 rounded-sm bg-muted-foreground/40"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `smoke-billow 1.5s ease-out infinite`,
        animationDelay: `${delay}s`,
        imageRendering: "pixelated",
      }}
    />
  );
}

// Fire particle component
function FireParticle({ delay, left, intensity }: { delay: number; left: number; intensity: number }) {
  return (
    <div
      className="absolute rounded-sm"
      style={{
        left: `${left}%`,
        bottom: 0,
        width: `${4 + intensity * 4}px`,
        height: `${6 + intensity * 8}px`,
        background: `linear-gradient(to top, hsl(var(--destructive)), hsl(var(--primary)), hsl(45, 100%, 60%))`,
        animation: `fire-flicker 0.15s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.8 + intensity * 0.2,
        imageRendering: "pixelated",
      }}
    />
  );
}

// Launchpad component with 7-stage gantry logic
function Launchpad({ stage }: { stage: RocketStage }) {
  // Gantry arm retraction based on 7-stage logic
  const getArmRetraction = () => {
    switch (stage) {
      case "idle": return 0;
      case "venting": return 8;  // Arms start retracting
      case "ignition": return 16;
      case "ascent-slow": return 24;
      default: return 30; // Fully retracted
    }
  };
  
  const armRetraction = getArmRetraction();
  
  // Hide launchpad for high stages
  if (stage === "orbit" || stage === "ascent-fast" || stage === "launching" || stage === "ascending") return null;
  
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

// Main rocket body (legacy) - updated for 7-stage logic
function RocketBody({ stage, progress }: { stage: RocketStage; progress: number }) {
  const getVerticalOffset = () => {
    switch (stage) {
      case "idle": return 0;
      case "venting": return 0;
      case "ignition": return 6;
      case "ascent-slow": return 15 + ((progress - 46) / 14) * 25;
      case "ascent-fast": return 40 + ((progress - 61) / 19) * 40;
      case "orbit": return 90;
      default: return 0;
    }
  };

  const verticalOffset = getVerticalOffset();
  const vibrationClass = 
    stage === "idle" ? "animate-subtle-shake" :
    stage === "venting" ? "animate-subtle-shake" :
    stage === "ignition" ? "animate-medium-shake" :
    (stage === "ascent-slow" || stage === "ascent-fast") ? "animate-intense-shake" :
    "animate-float";

  return (
    <div 
      className={`relative transition-all duration-1000 ease-out ${vibrationClass}`}
      style={{ 
        transform: `translateY(-${verticalOffset}px)`,
        imageRendering: "pixelated",
      }}
    >
      <div className="relative flex flex-col items-center">
        <div 
          className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-transparent transition-colors duration-500"
          style={{ 
            borderBottomColor: stage === "orbit" 
              ? "hsl(var(--primary))" 
              : "hsl(var(--muted-foreground))" 
          }}
        />
        <div className="w-4 h-7 bg-secondary-foreground rounded-sm relative overflow-hidden">
          <div 
            className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-sm transition-all duration-500"
            style={{
              background: stage === "orbit" 
                ? "radial-gradient(circle, hsl(200, 100%, 60%), hsl(var(--primary)))"
                : "hsl(var(--primary))",
              boxShadow: stage === "orbit" 
                ? "0 0 8px hsl(200, 100%, 60%)"
                : "none",
            }}
          />
          <div className="absolute bottom-1 left-0 right-0 h-1 bg-primary/30" />
        </div>
        <div className="flex justify-center -mt-1.5">
          <div className="w-0 h-0 border-t-[8px] border-r-[5px] border-transparent border-t-muted" />
          <div className="w-4 h-1.5 bg-muted" />
          <div className="w-0 h-0 border-t-[8px] border-l-[5px] border-transparent border-t-muted" />
        </div>
      </div>
    </div>
  );
}

// Exhaust effects component with 7-stage logic
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

  // 7-stage vertical offset logic
  const getVerticalOffset = () => {
    switch (stage) {
      case "idle": return 0;
      case "venting": return 0;
      case "ignition": return 6; // Hovers slightly
      case "ascent-slow": return 15 + ((progress - 46) / 14) * 25; // Slow rise
      case "ascent-fast": return 40 + ((progress - 61) / 19) * 40; // Faster rise
      case "orbit": return 90;
      default: return 0;
    }
  };

  // 7-stage flame intensity
  const getFlameIntensity = () => {
    switch (stage) {
      case "idle": return 0;
      case "venting": return 0;
      case "ignition": return 0.5;
      case "ascent-slow": return 0.65;
      case "ascent-fast": return 0.9; // Larger flame
      case "orbit": return 0.4;
      default: return 0;
    }
  };

  const verticalOffset = getVerticalOffset();
  const flameIntensity = getFlameIntensity();
  const showSteam = stage === "idle" || stage === "venting";
  const showSmoke = stage === "venting" || stage === "ignition" || stage === "ascent-slow" || stage === "ascent-fast";

  return (
    <div 
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-20 transition-all duration-1000"
      style={{ 
        transform: `translateY(-${verticalOffset}px)`,
        imageRendering: "pixelated",
      }}
    >
      {showSteam && (
        <div className="absolute bottom-0 left-0 right-0 h-12">
          {steamParticles.map((p) => (
            <SteamParticle key={p.id} delay={p.delay} left={p.left} />
          ))}
        </div>
      )}
      
      {showSmoke && (
        <div className="absolute bottom-0 left-0 right-0 h-16">
          {smokeParticles.map((p) => (
            <SmokeParticle 
              key={p.id} 
              delay={p.delay} 
              left={p.left} 
              size={p.size * (stage === "ascent-fast" ? 1.8 : stage === "ascent-slow" ? 1.4 : 1)} 
            />
          ))}
        </div>
      )}
      
      {flameIntensity > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-20 flex justify-center">
          <div 
            className="relative transition-all duration-300"
            style={{
              width: `${12 + flameIntensity * 14}px`,
              height: `${16 + flameIntensity * 28}px`,
            }}
          >
            <div 
              className="absolute inset-0 rounded-b-sm transition-all duration-300"
              style={{
                background: stage === "orbit"
                  ? "linear-gradient(to bottom, hsl(200, 100%, 50%), hsl(200, 100%, 70%), transparent)"
                  : "linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--destructive)), transparent)",
                boxShadow: stage === "orbit"
                  ? "0 8px 20px hsl(200, 100%, 50% / 0.6)"
                  : `0 ${8 + flameIntensity * 10}px ${16 + flameIntensity * 20}px hsl(var(--primary) / 0.5)`,
                animation: "fire-flicker 0.1s ease-in-out infinite",
              }}
            />
            <div 
              className="absolute left-1/2 -translate-x-1/2 rounded-b-sm transition-all duration-300"
              style={{
                top: 0,
                width: `${6 + flameIntensity * 5}px`,
                height: `${10 + flameIntensity * 14}px`,
                background: stage === "orbit"
                  ? "linear-gradient(to bottom, white, hsl(200, 100%, 70%))"
                  : "linear-gradient(to bottom, hsl(60, 100%, 85%), hsl(45, 100%, 60%), hsl(var(--primary)))",
                animation: "fire-flicker 0.08s ease-in-out infinite",
              }}
            />
          </div>
          {(stage === "ascent-slow" || stage === "ascent-fast") && fireParticles.map((p) => (
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
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-fade-in">
      <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-sm shadow-lg flex items-center gap-1">
        <span className="animate-pulse">🚀</span>
        <span>ORBIT ACHIEVED</span>
      </div>
    </div>
  );
}

export function RocketLaunchSequence({ progress, onLaunchStart }: RocketLaunchSequenceProps) {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [showRocket, setShowRocket] = useState(true);
  const [launchPhase, setLaunchPhase] = useState<"idle" | "struggle" | "liftoff" | "ascending" | "exited">("idle");
  const [showFlash, setShowFlash] = useState(false);
  const rocketY = useMotionValue(0);
  const [currentRocketY, setCurrentRocketY] = useState(0);
  
  // Track rocket Y for smoke trail
  useEffect(() => {
    const unsubscribe = rocketY.on("change", (latest) => {
      setCurrentRocketY(latest);
    });
    return () => unsubscribe();
  }, [rocketY]);
  
  // Trigger ultra-cinematic launch sequence when reaching 100%
  useEffect(() => {
    if (progress === 100 && !hasLaunched) {
      setHasLaunched(true);
      
      // Phase 1: Immediate Ignition (0s) - Instant feedback with slight lift
      setLaunchPhase("struggle");
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
      
      // Immediate slight lift (5-10px) to confirm ignition
      animate(rocketY, -8, {
        duration: 0.8,
        ease: "easeOut",
      });
      
      // Phase 2: Main liftoff at 1.5s (shortened from 3s)
      setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
        setLaunchPhase("liftoff");
      }, 1500);
      
      // Phase 3: Ascending (1.7s - 6s) - Visible movement then accelerate
      setTimeout(() => {
        setLaunchPhase("ascending");
        // Animate rocket with adjusted curve - starts faster but keeps epic scale
        animate(rocketY, -2500, {
          duration: 4.3,
          ease: [0.45, 0, 0.15, 1], // Starts faster, still accelerates
        });
      }, 1700);
      
      // Phase 4: Fireworks start at 5.5s (rocket almost gone)
      setTimeout(() => {
        onLaunchStart?.();
      }, 5500);
      
      // Phase 5: Rocket fully exits at 6.0s
      setTimeout(() => {
        setShowRocket(false);
        setLaunchPhase("exited");
      }, 6000);
    }
  }, [progress, hasLaunched, onLaunchStart, rocketY]);

  // Reset when progress drops from 100
  useEffect(() => {
    if (progress < 100) {
      setHasLaunched(false);
      setShowRocket(true);
      setLaunchPhase("idle");
      setShowFlash(false);
      rocketY.set(0);
      setCurrentRocketY(0);
    }
  }, [progress, rocketY]);

  const stage = getStage(progress, launchPhase === "ascending");
  
  // After launch, show empty launchpad
  if (!showRocket && progress === 100) {
    return (
      <div className="relative w-24 h-32 flex items-end justify-center">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-muted rounded-sm" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-8 opacity-50">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute bottom-0 rounded-sm bg-muted-foreground/30"
                style={{
                  left: `${25 + i * 15}%`,
                  width: "8px",
                  height: "8px",
                  animation: `smoke-billow 2s ease-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  imageRendering: "pixelated",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Determine shake intensity based on phase - SUBTLE rumble
  const getShakeClass = () => {
    if (launchPhase === "struggle") return "animate-engine-rumble";
    if (launchPhase === "liftoff" || launchPhase === "ascending") return "animate-liftoff-shake";
    return "";
  };

  return (
    <>
      {/* Volumetric smoke effects */}
      {launchPhase === "struggle" && <GroundSmoke intensity={1} />}
      {launchPhase === "ascending" && <AscendingSmoke rocketY={currentRocketY} />}
      
      <div 
        className={`relative w-24 h-32 flex items-end justify-center ${getShakeClass()}`} 
        style={{ 
          overflow: launchPhase === "ascending" ? 'visible' : 'hidden',
          imageRendering: "pixelated",
        }}
      >
        {/* Liftoff Flash */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              className="fixed inset-0 z-[200] bg-white pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {launchPhase === "ascending" ? (
            <motion.div
              key="launching-rocket"
              className="absolute z-[100]"
              style={{ y: rocketY }}
            >
              {/* Pixel Rocket body with attached exhaust */}
              <motion.div 
                className="relative z-10"
                animate={{ 
                  x: [-0.5, 0.5, -0.3, 0.3, 0],
                  y: [-0.3, 0.3, -0.2, 0.2, 0],
                }}
                transition={{ duration: 0.04, repeat: Infinity }}
                style={{ imageRendering: "pixelated" }}
              >
                <PixelRocketBody stage="ascending" showExhaust exhaustIntensity={1} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="stationary-rocket">
              {/* Background glow for orbit (81-99%) - hull glow effect */}
              {stage === "orbit" && (
                <div 
                  className="absolute inset-0 rounded-sm opacity-40 animate-pulse"
                  style={{
                    background: "radial-gradient(circle, hsl(200, 100%, 60%), hsl(280, 80%, 50%) 50%, transparent 70%)",
                    filter: "blur(2px)",
                  }}
                />
              )}
              
              {/* Mission badge */}
              <MissionBadge visible={stage === "orbit"} />
              
              {/* Launchpad structure */}
              <Launchpad stage={launchPhase === "struggle" || launchPhase === "liftoff" ? "ascending" : stage} />
              
              {/* Struggle/Liftoff phase - pixel rocket with attached exhaust */}
              {(launchPhase === "struggle" || launchPhase === "liftoff") ? (
                <div className="relative z-10 mb-4">
                  <motion.div
                    animate={{ 
                      x: [-0.8, 0.8, -0.5, 0.5, 0],
                      y: [-0.4, 0.4, -0.3, 0.3, 0],
                    }}
                    transition={{ duration: 0.025, repeat: Infinity }}
                    style={{ imageRendering: "pixelated" }}
                  >
                    <PixelRocketBody 
                      stage="struggle" 
                      showExhaust 
                      exhaustIntensity={launchPhase === "liftoff" ? 1 : 0.85} 
                    />
                  </motion.div>
                </div>
              ) : (
                <>
                  <ExhaustEffects stage={stage} progress={progress} />
                  {/* Rocket body with 7-stage visual logic */}
                  <div 
                    className={`relative z-10 mb-4 ${stage === "orbit" ? "animate-subtle-shake" : ""}`}
                    style={{ imageRendering: "pixelated" }}
                  >
                    <PixelRocketBody 
                      stage={stage as any} 
                      showExhaust={stage === "ignition" || stage === "ascent-slow" || stage === "ascent-fast" || stage === "orbit"} 
                      exhaustIntensity={
                        stage === "orbit" ? 0.4 : 
                        stage === "ascent-fast" ? 0.85 :
                        stage === "ascent-slow" ? 0.65 : 
                        stage === "ignition" ? 0.5 : 0
                      }
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
