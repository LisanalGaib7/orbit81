/**
 * RocketLaunchSequence — Animated rocket with 6 pre-launch stages + launch.
 *
 * WHY: Encapsulates all rocket animation state (pre-launch stages,
 * countdown, ignition, liftoff, ascending) so the parent only needs
 * to pass `progress` (0-100) and an `onLaunchStart` callback.
 *
 * Stage definitions are sourced from constants/missionData.ts.
 */

import { useMemo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { PixelRocketBody } from "./PixelRocketBody";
import { GroundSmoke, AscendingSmoke } from "./VolumetricSmoke";
import {
  ROCKET_BODY_HEIGHT,
  ROCKET_BODY_WIDTH,
  ROCKET_NOZZLE_ANCHOR_STYLE,
} from "./rocketEngineGeometry";
import { getPreLaunchStage, type PreLaunchStage, type LaunchPhase } from "@/constants/missionData";

interface RocketLaunchSequenceProps {
  progress: number; // 0-100
  onLaunchStart?: () => void;
  ignitionBurst?: number; // increments when a checkbox is checked
}

// Steam particle component - round pixel particles
function SteamParticle({ delay, left }: { delay: number; left: number }) {
  return (
    <div
      className="absolute bg-muted-foreground/30"
      style={{
        left: `${left}%`,
        bottom: 0,
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        animation: `steam-rise 2s ease-out infinite`,
        animationDelay: `${delay}s`,
        imageRendering: "pixelated",
      }}
    />
  );
}

// Smoke particle component - ROUND pixels
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
      case "systems-on": return 12;
      case "fueling": return 18;
      case "engine-test": return 22;
      case "power-up": return 26;
      case "high-tension": return 30;
      default: return 0;
    }
  };
  
  const armOpening = getArmOpening();
  
  if (isLaunching) return null;
  
  return (
    <div 
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 transition-all duration-1000" 
      style={{ zIndex: 1, imageRendering: "pixelated" }}
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-muted rounded-sm" />
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

// Pre-launch exhaust effects
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
      size: 6 + Math.random() * 6,
    })), []);

  const sparkParticles = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: i * 0.08,
      left: 40 + Math.random() * 20,
    })), []);

  const showSteam = stage === "systems-on";
  const showSmoke = stage === "power-up" || stage === "high-tension";
  const showSparks = stage === "engine-test";
  const smokeIntensity = stage === "high-tension" ? 1.5 : 1;

  return (
    <div 
      className="absolute left-1/2 -translate-x-1/2 w-20 h-16 pointer-events-none"
      style={{ bottom: '-12px', imageRendering: "pixelated", zIndex: 0 }}
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
            <SmokeParticle key={p.id} delay={p.delay} left={p.left} size={p.size * smokeIntensity} />
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

// Blue energy glow for fueling stage
function FuelingGlow({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 3, imageRendering: "pixelated" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, hsl(200, 100%, 60% / 0.4), transparent 70%)",
          filter: "blur(3px)",
        }}
      />
    </motion.div>
  );
}

// High tension flickering engine light
function HighTensionFlicker({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...ROCKET_NOZZLE_ANCHOR_STYLE,
        zIndex: 1,
        imageRendering: "pixelated",
      }}
    >
      <motion.div
        style={{
          width: "4px",
          height: "6px",
          marginLeft: "-2px",
          borderRadius: "999px 999px 55% 55%",
          transformOrigin: "top center",
          background: "linear-gradient(to bottom, hsl(45, 100%, 60%), hsl(25, 100%, 50%), hsl(0, 80%, 50%))",
          boxShadow: "0 4px 16px hsl(30, 100%, 50% / 0.8)",
        }}
        animate={{
          opacity: [0.45, 1, 0.65, 1, 0.35, 0.9],
          scaleX: [0.9, 1.1, 0.95, 1.05, 0.9, 1],
          scaleY: [0.85, 1.25, 0.95, 1.15, 0.9, 1.05],
        }}
        transition={{ duration: 0.15, repeat: Infinity }}
      />
    </div>
  );
}

// Checkbox ignition burst
function CheckIgnitionBurst({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...ROCKET_NOZZLE_ANCHOR_STYLE,
        zIndex: 5,
        imageRendering: "pixelated",
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: "3px",
            height: "3px",
            marginLeft: "-1.5px",
            borderRadius: "50%",
            background: i % 2 === 0 ? "hsl(30, 100%, 55%)" : "hsl(45, 100%, 65%)",
            zIndex: 3,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 40,
            y: [0, 8 + Math.random() * 16],
            opacity: [1, 0.8, 0],
            scale: [1, 0.6, 0.2],
          }}
          transition={{ duration: 0.4 + Math.random() * 0.3, delay: Math.random() * 0.15, ease: "easeOut" }}
        />
      ))}

      <motion.div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: "14px",
          height: "18px",
          marginLeft: "-7px",
          borderRadius: "50% 50% 40% 40%",
          transformOrigin: "top center",
          background: "linear-gradient(to bottom, hsl(45, 100%, 70%), hsl(30, 100%, 55%), hsl(15, 90%, 45%))",
          boxShadow: "0 4px 12px hsl(30, 100%, 50% / 0.6)",
          zIndex: 2,
        }}
        initial={{ opacity: 0, scaleX: 0.45, scaleY: 0.35 }}
        animate={{
          opacity: [0, 1, 0.8, 0],
          scaleX: [0.45, 1.15, 1, 0.55],
          scaleY: [0.35, 1.2, 1.05, 0.6],
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {Array.from({ length: 8 }, (_, i) => {
        const size = 6 + Math.random() * 6;

        return (
          <motion.div
            key={`smoke-${i}`}
            className="absolute"
            style={{
              left: 0,
              top: "2px",
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `${-size / 2}px`,
              borderRadius: "50%",
              backgroundColor: "hsl(var(--muted-foreground) / 0.35)",
              zIndex: 1,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
            animate={{
              x: (Math.random() - 0.5) * 50,
              y: [0, 5 + Math.random() * 15],
              opacity: [0, 0.4, 0.2, 0],
              scale: [0.5, 1.3, 1.8],
            }}
            transition={{ duration: 0.8 + Math.random() * 0.4, delay: 0.15 + Math.random() * 0.2, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function RocketLaunchSequence({ progress, onLaunchStart, ignitionBurst = 0 }: RocketLaunchSequenceProps) {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [showRocket, setShowRocket] = useState(true);
  const [launchPhase, setLaunchPhase] = useState<LaunchPhase>("idle");
  const [showFlash, setShowFlash] = useState(false);
  const rocketY = useMotionValue(0);
  const [currentRocketY, setCurrentRocketY] = useState(0);
  const [burstActive, setBurstActive] = useState(false);
  const [burstShake, setBurstShake] = useState(false);
  const prevBurstRef = useRef(ignitionBurst);
  
  // Trigger burst animation when ignitionBurst increments
  useEffect(() => {
    if (ignitionBurst > 0 && ignitionBurst !== prevBurstRef.current && progress < 100) {
      prevBurstRef.current = ignitionBurst;
      setBurstActive(true);
      setBurstShake(true);
      setTimeout(() => setBurstShake(false), 500);
      setTimeout(() => setBurstActive(false), 800);
    }
  }, [ignitionBurst, progress]);
  
  useEffect(() => {
    const unsubscribe = rocketY.on("change", (latest) => { setCurrentRocketY(latest); });
    return () => unsubscribe();
  }, [rocketY]);
  
  const preLaunchStage = getPreLaunchStage(progress);
  
  const getVibrationClass = () => {
    if (progress === 100) return "";
    switch (preLaunchStage) {
      case "idle": return "animate-subtle-shake";
      case "systems-on":
      case "fueling": return "";
      case "engine-test": return "animate-subtle-shake";
      case "power-up": return "animate-medium-shake";
      case "high-tension": return "animate-intense-shake";
      default: return "";
    }
  };
  
  // 100% Grand Finale Launch Sequence
  useEffect(() => {
    if (progress === 100 && !hasLaunched) {
      setHasLaunched(true);
      setLaunchPhase("countdown");
      
      setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 150);
        setLaunchPhase("ignition");
        animate(rocketY, -8, { duration: 0.8, ease: "easeOut" });
      }, 2400);
      
      setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
        setLaunchPhase("liftoff");
        animate(rocketY, -60, { duration: 3, ease: "easeInOut" });
      }, 3200);
      
      setTimeout(() => {
        setLaunchPhase("ascending");
        animate(rocketY, -2500, { duration: 3, ease: [0.4, 0, 0.2, 1] });
      }, 6200);
      
      setTimeout(() => { onLaunchStart?.(); }, 8500);
      
      setTimeout(() => {
        setShowRocket(false);
        setLaunchPhase("exited");
      }, 9200);
    }
  }, [progress, hasLaunched, onLaunchStart, rocketY]);

  // Reset when progress drops below 100
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
      <div className="relative w-24 h-32 flex items-end justify-center" style={{ imageRendering: "pixelated" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-muted rounded-sm" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-8 opacity-50">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-muted-foreground/30"
                style={{
                  left: `${25 + i * 15}%`, width: "6px", height: "6px", borderRadius: "50%",
                  animation: `smoke-billow 2s ease-out infinite`, animationDelay: `${i * 0.3}s`,
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
    if (launchPhase === "countdown") return "animate-subtle-shake";
    if (launchPhase === "ignition") return "animate-engine-rumble";
    if (launchPhase === "liftoff" || launchPhase === "ascending") return "animate-liftoff-shake";
    return "";
  };

  return (
    <>
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

      {launchPhase === "ignition" && <GroundSmoke intensity={1} />}
      {launchPhase === "ascending" && <AscendingSmoke rocketY={currentRocketY} />}
      
      <div 
        className={`relative flex items-end justify-center ${isLaunching ? getLaunchShakeClass() : getVibrationClass()}`}
        style={{ width: '96px', height: '140px', imageRendering: "pixelated" }}
      >
        <Launchpad stage={preLaunchStage} isLaunching={isLaunching} />
        
        <AnimatePresence>
          {launchPhase === "ascending" ? (
            <motion.div
              key="rocket-assembly-ascending"
              className="absolute"
              style={{ y: rocketY, bottom: '16px', left: '50%', x: '-50%', zIndex: 10 }}
            >
              <div
                className="relative"
                style={{
                  width: `${ROCKET_BODY_WIDTH}px`,
                  height: `${ROCKET_BODY_HEIGHT}px`,
                  imageRendering: "pixelated",
                }}
              >
                <motion.div 
                  className="relative w-full h-full" style={{ zIndex: 2 }}
                  animate={{ x: [-0.5, 0.5, -0.3, 0.3, 0], y: [-0.3, 0.3, -0.2, 0.2, 0] }}
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
              style={{ y: rocketY, bottom: '16px', left: '50%', x: '-50%', zIndex: 10 }}
            >
              <div
                className="relative"
                style={{
                  width: `${ROCKET_BODY_WIDTH}px`,
                  height: `${ROCKET_BODY_HEIGHT}px`,
                  imageRendering: "pixelated",
                }}
              >
                <CountdownDisplay phase={launchPhase} />
                <FuelingGlow active={preLaunchStage === "fueling" && !isLaunching} />
                
                {(launchPhase === "ignition" || launchPhase === "liftoff") ? (
                  <motion.div
                    className="relative w-full h-full" style={{ zIndex: 2 }}
                    animate={{ x: [-0.8, 0.8, -0.5, 0.5, 0], y: [-0.4, 0.4, -0.3, 0.3, 0] }}
                    transition={{ duration: 0.025, repeat: Infinity }}
                  >
                    <PixelRocketBody stage="struggle" showExhaust exhaustIntensity={launchPhase === "liftoff" ? 1 : 0.85} />
                  </motion.div>
                ) : burstShake ? (
                  <motion.div
                    className="relative w-full h-full" style={{ zIndex: 2 }}
                    animate={{ x: [-1, 1, -0.6, 0.6, 0], y: [-0.5, 0.5, -0.3, 0.3, 0] }}
                    transition={{ duration: 0.05, repeat: Infinity }}
                  >
                    <PixelRocketBody 
                      stage="idle" 
                      showExhaust={preLaunchStage === "engine-test" || preLaunchStage === "power-up"}
                      exhaustIntensity={preLaunchStage === "power-up" ? 0.3 : preLaunchStage === "engine-test" ? 0.15 : 0}
                    />
                    <HighTensionFlicker active={preLaunchStage === "high-tension"} />
                    <AnimatePresence>
                      {burstActive && <CheckIgnitionBurst active={burstActive} />}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <div className="relative w-full h-full" style={{ zIndex: 2 }}>
                    <PixelRocketBody 
                      stage="idle" 
                      showExhaust={preLaunchStage === "engine-test" || preLaunchStage === "power-up"}
                      exhaustIntensity={preLaunchStage === "power-up" ? 0.3 : preLaunchStage === "engine-test" ? 0.15 : 0}
                    />
                    <HighTensionFlicker active={preLaunchStage === "high-tension"} />
                    <AnimatePresence>
                      {burstActive && <CheckIgnitionBurst active={burstActive} />}
                    </AnimatePresence>
                  </div>
                )}
                
                {!isLaunching && <PreLaunchEffects stage={preLaunchStage} />}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
