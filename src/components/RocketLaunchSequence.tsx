import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { PixelRocketBody } from "./PixelRocketBody";
import { GroundSmoke, AscendingSmoke } from "./VolumetricSmoke";

interface RocketLaunchSequenceProps {
  progress: number; // 0-100
  onLaunchStart?: () => void;
}

// Pre-launch stages (0-99%) - rocket stays grounded
type PreLaunchStage = 
  | "idle"           // 0-15%: Idle on gantry, no movement
  | "venting"        // 16-30%: Gantry arms open, white steam
  | "fuel-sequence"  // 31-45%: Blue energy glow on rocket body
  | "engine-test"    // 46-60%: Small flickering orange sparks
  | "pre-ignition"   // 61-80%: Screen shake, more smoke
  | "high-tension";  // 81-99%: Heavy smoke, intense flicker, rapid vibration

// Launch stages (100%)
type LaunchPhase = "idle" | "ignition" | "liftoff" | "ascending" | "exited";

function getPreLaunchStage(progress: number): PreLaunchStage {
  if (progress <= 15) return "idle";
  if (progress <= 30) return "venting";
  if (progress <= 45) return "fuel-sequence";
  if (progress <= 60) return "engine-test";
  if (progress <= 80) return "pre-ignition";
  return "high-tension";
}

// Steam particle component - round particles
function SteamParticle({ delay, left }: { delay: number; left: number }) {
  return (
    <div
      className="absolute bg-muted-foreground/30"
      style={{
        left: `${left}%`,
        bottom: 0,
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        animation: `steam-rise 2s ease-out infinite`,
        animationDelay: `${delay}s`,
        imageRendering: "pixelated",
      }}
    />
  );
}

// Smoke particle component - ROUND particles (border-radius: 50%)
function SmokeParticle({ delay, left, size }: { delay: number; left: number; size: number }) {
  return (
    <div
      className="absolute bg-muted-foreground/40"
      style={{
        left: `${left}%`,
        bottom: 0,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        animation: `smoke-billow 1.5s ease-out infinite`,
        animationDelay: `${delay}s`,
        imageRendering: "pixelated",
      }}
    />
  );
}

// Orange spark particle for engine test phase
function SparkParticle({ delay, left }: { delay: number; left: number }) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${left}%`,
        bottom: 0,
        width: "3px",
        height: "4px",
        borderRadius: "50%",
        background: "linear-gradient(to top, hsl(30, 100%, 50%), hsl(45, 100%, 60%))",
        imageRendering: "pixelated",
      }}
      animate={{
        y: [0, -8, -12],
        opacity: [0.9, 0.6, 0],
        scale: [1, 0.8, 0.5],
      }}
      transition={{
        duration: 0.3,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 0.2 + Math.random() * 0.3,
      }}
    />
  );
}

// Launchpad component with gantry arms
function Launchpad({ stage, isLaunching }: { stage: PreLaunchStage; isLaunching: boolean }) {
  const getArmOpening = () => {
    if (isLaunching) return 30;
    switch (stage) {
      case "idle": return 0;
      case "venting": return 12;
      case "fuel-sequence": return 18;
      case "engine-test": return 22;
      case "pre-ignition": return 26;
      case "high-tension": return 30;
      default: return 0;
    }
  };
  
  const armOpening = getArmOpening();
  
  if (isLaunching) return null;
  
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 transition-all duration-1000" style={{ zIndex: 1 }}>
      {/* Platform base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-muted rounded-sm" />
      
      {/* Gantry tower left */}
      <div 
        className="absolute bottom-2 w-1 h-16 bg-muted-foreground/60 transition-transform duration-700"
        style={{ 
          left: `${20 - armOpening}%`,
          transform: `rotate(${armOpening * 0.5}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div 
          className="absolute top-2 right-0 w-6 h-0.5 bg-muted-foreground/50 transition-transform duration-700 origin-left"
          style={{ transform: `rotate(${armOpening * 2}deg)` }}
        />
      </div>
      
      {/* Gantry tower right */}
      <div 
        className="absolute bottom-2 w-1 h-16 bg-muted-foreground/60 transition-transform duration-700"
        style={{ 
          right: `${20 - armOpening}%`,
          transform: `rotate(-${armOpening * 0.5}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div 
          className="absolute top-2 left-0 w-6 h-0.5 bg-muted-foreground/50 transition-transform duration-700 origin-right"
          style={{ transform: `rotate(-${armOpening * 2}deg)` }}
        />
      </div>
    </div>
  );
}

// Pre-launch exhaust effects - positioned relative to Rocket-Assembly
function PreLaunchEffects({ stage }: { stage: PreLaunchStage }) {
  const steamParticles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.25,
      left: 30 + Math.random() * 40,
    })), []);

  const smokeParticles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.15,
      left: 25 + Math.random() * 50,
      size: 8 + Math.random() * 8,
    })), []);

  const sparkParticles = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: i * 0.08,
      left: 40 + Math.random() * 20,
    })), []);

  const showSteam = stage === "venting";
  const showSmoke = stage === "pre-ignition" || stage === "high-tension";
  const showSparks = stage === "engine-test";
  const smokeIntensity = stage === "high-tension" ? 2 : 1;

  return (
    <div 
      className="absolute left-1/2 -translate-x-1/2 w-20 h-20 pointer-events-none"
      style={{ 
        bottom: '-16px', // Position below rocket nozzle
        imageRendering: "pixelated",
        zIndex: 0,
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
              size={p.size * smokeIntensity}
            />
          ))}
        </div>
      )}
      
      {showSparks && (
        <div className="absolute bottom-0 left-0 right-0 h-12 flex justify-center">
          {sparkParticles.map((p) => (
            <SparkParticle key={p.id} delay={p.delay} left={p.left} />
          ))}
        </div>
      )}
    </div>
  );
}

// Blue energy glow for fuel sequence stage
function FuelSequenceGlow({ active }: { active: boolean }) {
  if (!active) return null;
  
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 3 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, hsl(200, 100%, 60% / 0.3), transparent 70%)",
          filter: "blur(4px)",
        }}
      />
    </motion.div>
  );
}

// High tension flickering engine light
function HighTensionFlicker({ active }: { active: boolean }) {
  if (!active) return null;
  
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2"
      style={{ bottom: '-8px', zIndex: 1 }}
      animate={{
        opacity: [0.4, 1, 0.6, 1, 0.3, 0.9],
        scale: [0.8, 1.2, 0.9, 1.1, 0.85, 1],
      }}
      transition={{ duration: 0.2, repeat: Infinity }}
    >
      <div 
        className="w-4 h-6"
        style={{
          borderRadius: "50%",
          background: "linear-gradient(to bottom, hsl(45, 100%, 60%), hsl(25, 100%, 50%), hsl(0, 80%, 50%))",
          boxShadow: "0 4px 20px hsl(30, 100%, 50% / 0.8)",
        }}
      />
    </motion.div>
  );
}

// Countdown display component
function CountdownDisplay({ phase }: { phase: LaunchPhase }) {
  const [count, setCount] = useState(3);
  
  useEffect(() => {
    if (phase === "ignition") {
      setCount(3);
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [phase]);
  
  if (phase !== "ignition" || count === 0) return null;
  
  return (
    <div 
      className="absolute left-[-40px] top-1/2 -translate-y-1/2 font-mono text-3xl font-bold text-primary"
      style={{ 
        imageRendering: "pixelated",
        textShadow: "0 0 10px hsl(var(--primary) / 0.5)",
        zIndex: 10,
      }}
    >
      {count}
    </div>
  );
}

export function RocketLaunchSequence({ progress, onLaunchStart }: RocketLaunchSequenceProps) {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [showRocket, setShowRocket] = useState(true);
  const [launchPhase, setLaunchPhase] = useState<LaunchPhase>("idle");
  const [showFlash, setShowFlash] = useState(false);
  const rocketY = useMotionValue(0);
  const [currentRocketY, setCurrentRocketY] = useState(0);
  
  useEffect(() => {
    const unsubscribe = rocketY.on("change", (latest) => {
      setCurrentRocketY(latest);
    });
    return () => unsubscribe();
  }, [rocketY]);
  
  const preLaunchStage = getPreLaunchStage(progress);
  
  const getVibrationClass = () => {
    if (progress === 100) return "";
    switch (preLaunchStage) {
      case "idle":
      case "venting":
      case "fuel-sequence":
        return "";
      case "engine-test":
        return "animate-subtle-shake";
      case "pre-ignition":
        return "animate-medium-shake";
      case "high-tension":
        return "animate-intense-shake";
      default:
        return "";
    }
  };
  
  useEffect(() => {
    if (progress === 100 && !hasLaunched) {
      setHasLaunched(true);
      
      setLaunchPhase("ignition");
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
      
      animate(rocketY, -8, {
        duration: 0.8,
        ease: "easeOut",
      });
      
      setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
        setLaunchPhase("liftoff");
      }, 1500);
      
      setTimeout(() => {
        setLaunchPhase("ascending");
        animate(rocketY, -2500, {
          duration: 4.3,
          ease: [0.45, 0, 0.15, 1],
        });
      }, 1700);
      
      setTimeout(() => {
        onLaunchStart?.();
      }, 5500);
      
      setTimeout(() => {
        setShowRocket(false);
        setLaunchPhase("exited");
      }, 6000);
    }
  }, [progress, hasLaunched, onLaunchStart, rocketY]);

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

  const isLaunching = launchPhase !== "idle";
  
  // After launch, show empty launchpad with residual smoke
  if (!showRocket && progress === 100) {
    return (
      <div className="relative w-24 h-32 flex items-end justify-center">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-muted rounded-sm" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-8 opacity-50">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-muted-foreground/30"
                style={{
                  left: `${25 + i * 15}%`,
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
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
  
  const getLaunchShakeClass = () => {
    if (launchPhase === "ignition") return "animate-engine-rumble";
    if (launchPhase === "liftoff" || launchPhase === "ascending") return "animate-liftoff-shake";
    return "";
  };

  return (
    <>
      {/* Flash effect */}
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

      {/* Volumetric smoke effects during launch */}
      {launchPhase === "ignition" && <GroundSmoke intensity={1} />}
      {launchPhase === "ascending" && <AscendingSmoke rocketY={currentRocketY} />}
      
      {/* Main container with shake */}
      <div 
        className={`relative flex items-end justify-center ${isLaunching ? getLaunchShakeClass() : getVibrationClass()}`}
        style={{ 
          width: '96px',
          height: '140px',
          imageRendering: "pixelated",
        }}
      >
        {/* ROCKET-ASSEMBLY: Contains rocket + flame + effects, moves as one unit */}
        <AnimatePresence>
          {launchPhase === "ascending" ? (
            <motion.div
              key="rocket-assembly-ascending"
              className="absolute"
              style={{ 
                y: rocketY,
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
              }}
            >
              {/* Rocket Assembly wrapper */}
              <div className="relative" style={{ imageRendering: "pixelated" }}>
                {/* Rocket Body - z-index 2 */}
                <motion.div 
                  className="relative"
                  style={{ zIndex: 2 }}
                  animate={{ 
                    x: [-0.5, 0.5, -0.3, 0.3, 0],
                    y: [-0.3, 0.3, -0.2, 0.2, 0],
                  }}
                  transition={{ duration: 0.04, repeat: Infinity }}
                >
                  <PixelRocketBody stage="ascending" showExhaust exhaustIntensity={1} />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rocket-assembly-grounded"
              className="absolute"
              style={{ 
                y: rocketY,
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {/* Launchpad structure - positioned below assembly */}
              <Launchpad stage={preLaunchStage} isLaunching={isLaunching} />
              
              {/* Rocket Assembly wrapper - position: relative */}
              <div className="relative" style={{ imageRendering: "pixelated" }}>
                {/* Countdown display - positioned left of rocket */}
                <CountdownDisplay phase={launchPhase} />
                
                {/* Blue energy glow for fuel sequence */}
                <FuelSequenceGlow active={preLaunchStage === "fuel-sequence" && !isLaunching} />
                
                {/* Rocket Body - z-index 2 */}
                {(launchPhase === "ignition" || launchPhase === "liftoff") ? (
                  <motion.div
                    className="relative"
                    style={{ zIndex: 2 }}
                    animate={{ 
                      x: [-0.8, 0.8, -0.5, 0.5, 0],
                      y: [-0.4, 0.4, -0.3, 0.3, 0],
                    }}
                    transition={{ duration: 0.025, repeat: Infinity }}
                  >
                    <PixelRocketBody 
                      stage="struggle" 
                      showExhaust 
                      exhaustIntensity={launchPhase === "liftoff" ? 1 : 0.85} 
                    />
                  </motion.div>
                ) : (
                  <div className="relative" style={{ zIndex: 2 }}>
                    <PixelRocketBody 
                      stage="idle" 
                      showExhaust={preLaunchStage === "engine-test" || preLaunchStage === "pre-ignition"}
                      exhaustIntensity={
                        preLaunchStage === "pre-ignition" ? 0.3 :
                        preLaunchStage === "engine-test" ? 0.15 : 0
                      }
                    />
                  </div>
                )}
                
                {/* Pre-launch effects (steam, smoke, sparks) - positioned below rocket */}
                {!isLaunching && <PreLaunchEffects stage={preLaunchStage} />}
                
                {/* High tension flickering engine - positioned at nozzle */}
                <HighTensionFlicker active={preLaunchStage === "high-tension" && !isLaunching} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
