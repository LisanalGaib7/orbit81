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
import { getPreLaunchStage, type PreLaunchStage, type LaunchPhase } from "@/constants/missionData";

interface RocketLaunchSequenceProps {
  progress: number;
  onLaunchStart: () => void;
}

export function RocketLaunchSequence({ progress, onLaunchStart }: RocketLaunchSequenceProps) {
  const [launchPhase, setLaunchPhase] = useState<LaunchPhase>("prelaunch");
  const [currentStage, setCurrentStage] = useState<PreLaunchStage>(getPreLaunchStage(0));
  const [countdown, setCountdown] = useState(5);
  const [showAscendingSmoke, setShowAscendingSmoke] = useState(false);
  const rocketY = useMotionValue(0);
  const smokeOpacity = useMotionValue(0);
  const smokeScale = useMotionValue(0.5);
  const rocketRef = useRef<HTMLDivElement>(null);

  // Determine current stage based on progress
  useEffect(() => {
    const stage = getPreLaunchStage(progress);
    setCurrentStage(stage);
  }, [progress]);

  // Launch sequence trigger
  useEffect(() => {
    if (progress >= 100 && launchPhase === "prelaunch") {
      setLaunchPhase("countdown");
    }
  }, [progress, launchPhase]);

  // Countdown sequence
  useEffect(() => {
    if (launchPhase === "countdown") {
      const intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setLaunchPhase("ignition");
      }, 5000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [launchPhase]);

  // Ignition and liftoff
  useEffect(() => {
    if (launchPhase === "ignition") {
      setTimeout(() => {
        setLaunchPhase("liftoff");
        onLaunchStart();
      }, 1000);
    }
  }, [launchPhase, onLaunchStart]);

  // Ascending animation
  useEffect(() => {
    if (launchPhase === "ascending") {
      setShowAscendingSmoke(true);

      // Calculate the ascent distance based on the viewport height
      const viewportHeight = window.innerHeight;
      const rocketHeight = rocketRef.current?.offsetHeight || 100; // Use a default if ref is not yet available
      const ascentDistance = -(viewportHeight * 0.9 + rocketHeight); // Ascend out of view

      animate(rocketY, ascentDistance, {
        duration: 5,
        ease: "easeOut",
      });
      animate(smokeOpacity, [0, 0.8, 0], { duration: 5 });
      animate(smokeScale, [0.5, 1.2, 1.5], { duration: 5 });

      // Reset after ascent
      return () => {
        rocketY.set(0);
        smokeOpacity.set(0);
        smokeScale.set(0.5);
        setShowAscendingSmoke(false);
        setLaunchPhase("prelaunch");
      };
    }
  }, [launchPhase, rocketY, smokeOpacity, smokeScale]);

  // Trigger ascending after liftoff
  useEffect(() => {
    if (launchPhase === "liftoff") {
      setTimeout(() => {
        setLaunchPhase("ascending");
      }, 500);
    }
  }, [launchPhase]);

  const renderOverlay = useMemo(() => {
    if (launchPhase === "countdown") {
      return (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-8xl font-bold text-primary"
          style={{ fontFamily: "var(--font-data)", textShadow: "4px 4px 0px #000000" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {countdown}
        </motion.div>
      );
    }

    if (launchPhase === "ignition") {
      return (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-red-500"
          style={{ fontFamily: "var(--font-data)", textShadow: "4px 4px 0px #000000" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          IGNITION
        </motion.div>
      );
    }

    return null;
  }, [launchPhase, countdown]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Rocket with smoke */}
      <motion.div
        ref={rocketRef}
        className="relative flex flex-col items-center justify-end"
        style={{ y: rocketY }}
      >
        <AnimatePresence>{showAscendingSmoke && <AscendingSmoke opacity={smokeOpacity} scale={smokeScale} />}</AnimatePresence>

        <PixelRocketBody stage={currentStage.name} />

        <AnimatePresence>
          {launchPhase !== "ascending" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GroundSmoke />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlay (countdown, ignition) */}
      <AnimatePresence>{renderOverlay}</AnimatePresence>
    </div>
  );
}
