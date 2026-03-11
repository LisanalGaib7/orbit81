/**
 * LaunchStructure — 3-layer SVG/CSS Mechazilla-style launch tower
 * that evolves visually based on evolution stage (1-11).
 *
 * Layers:
 *  - Layer 0: Foundation (ground, cables, base)
 *  - Layer 1: Tower (vertical structure, arms, antennas)
 *  - Layer 2: Atmospheric effects (smoke, sparks, warning lights)
 */

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import type { EvolutionStage } from "@/constants/evolutionData";

interface LaunchStructureProps {
  stage: EvolutionStage;
}

// Foundation ground layer
function FoundationLayer({ stageId }: { stageId: number }) {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full" style={{ zIndex: 1 }}>
      {/* Ground plate */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2"
        style={{
          width: "90%",
          background: "linear-gradient(180deg, hsl(220 12% 18%), hsl(220 15% 10%))",
          borderRadius: "2px 2px 0 0",
          boxShadow: "0 2px 8px hsl(0 0% 0% / 0.5)",
          imageRendering: "pixelated",
        }}
      />

      {/* Base supports */}
      {stageId >= 1 && (
        <AnimatePresence>
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-between"
            style={{ width: "70%" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-1.5 h-3 bg-muted-foreground/50" style={{ imageRendering: "pixelated" }} />
            <div className="w-1.5 h-3 bg-muted-foreground/50" style={{ imageRendering: "pixelated" }} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Power cables (stage 3+) */}
      {stageId >= 3 && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2"
          style={{ width: "60%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Cable lines */}
          <div className="flex justify-between">
            <div
              className="w-px h-6"
              style={{
                background: "linear-gradient(180deg, hsl(200 80% 50% / 0.6), hsl(200 80% 50% / 0.1))",
                boxShadow: "0 0 4px hsl(200 80% 50% / 0.4)",
              }}
            />
            <div
              className="w-px h-5"
              style={{
                background: "linear-gradient(180deg, hsl(200 80% 50% / 0.4), hsl(200 80% 50% / 0.1))",
                boxShadow: "0 0 3px hsl(200 80% 50% / 0.3)",
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Tower structure layer
function TowerLayer({ stageId }: { stageId: number }) {
  const towerHeight = useMemo(() => {
    if (stageId <= 1) return 20;
    if (stageId <= 2) return 50;
    if (stageId <= 4) return 65;
    return 80;
  }, [stageId]);

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{ zIndex: 2, width: "100%" }}>
      {/* Main tower vertical beam (stage 2+) */}
      {stageId >= 2 && (
        <motion.div
          className="absolute bottom-0 flex justify-center"
          style={{ left: "18%", width: "8%" }}
          initial={{ height: 0 }}
          animate={{ height: `${towerHeight}px` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(90deg, hsl(220 10% 30%), hsl(220 10% 22%), hsl(220 10% 28%))",
              boxShadow: "1px 0 0 hsl(220 10% 35% / 0.4), -1px 0 0 hsl(220 10% 15%)",
              imageRendering: "pixelated",
            }}
          />
          {/* Lattice marks */}
          {stageId >= 3 &&
            Array.from({ length: Math.floor(towerHeight / 12) }, (_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-muted-foreground/30"
                style={{ bottom: `${(i + 1) * 12}px` }}
              />
            ))}
        </motion.div>
      )}

      {/* Fuel Arms (stage 4+) */}
      {stageId >= 4 && (
        <motion.div
          className="absolute"
          style={{ left: "26%", bottom: `${towerHeight * 0.5}px` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className="h-1 origin-left"
            style={{
              width: "20px",
              background: "linear-gradient(90deg, hsl(220 10% 28%), hsl(200 30% 35%))",
              boxShadow: "0 1px 0 hsl(0 0% 0% / 0.3)",
              imageRendering: "pixelated",
            }}
          />
          {/* Frost indicator */}
          <div
            className="absolute top-0 right-0 w-1 h-1 rounded-full"
            style={{
              background: "hsl(200 100% 80%)",
              boxShadow: "0 0 4px hsl(200 100% 70% / 0.6)",
            }}
          />
        </motion.div>
      )}

      {/* Catching Arms / Mechazilla chopsticks (stage 6+) */}
      {stageId >= 6 && (
        <>
          <motion.div
            className="absolute origin-bottom-left"
            style={{
              left: "26%",
              bottom: `${towerHeight * 0.75}px`,
            }}
            initial={{ rotate: 90, opacity: 0 }}
            animate={{
              rotate: stageId >= 9 ? 55 : stageId >= 10 ? 30 : 70,
              opacity: 1,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="h-[2px]"
              style={{
                width: "28px",
                background: "linear-gradient(90deg, hsl(220 10% 30%), hsl(220 8% 25%))",
                boxShadow: "0 1px 2px hsl(0 0% 0% / 0.4)",
                imageRendering: "pixelated",
              }}
            />
          </motion.div>
          <motion.div
            className="absolute origin-bottom-left"
            style={{
              left: "26%",
              bottom: `${towerHeight * 0.72}px`,
            }}
            initial={{ rotate: 90, opacity: 0 }}
            animate={{
              rotate: stageId >= 9 ? 125 : stageId >= 10 ? 150 : 110,
              opacity: 1,
            }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <div
              className="h-[2px]"
              style={{
                width: "28px",
                background: "linear-gradient(90deg, hsl(220 10% 30%), hsl(220 8% 25%))",
                boxShadow: "0 1px 2px hsl(0 0% 0% / 0.4)",
                imageRendering: "pixelated",
              }}
            />
          </motion.div>
        </>
      )}

      {/* Antenna / Radar (stage 7+) */}
      {stageId >= 7 && (
        <motion.div
          className="absolute"
          style={{ left: "16%", bottom: `${towerHeight + 2}px` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
        >
          <div className="w-1 h-3 bg-muted-foreground/60" style={{ imageRendering: "pixelated" }} />
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
            style={{
              background: "hsl(120 60% 40% / 0.6)",
              boxShadow: "0 0 6px hsl(120 60% 50% / 0.5)",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      )}

      {/* Warning lights (stage 8+) */}
      {stageId >= 8 && (
        <>
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: "20%",
              bottom: `${towerHeight * 0.3}px`,
              background: "hsl(0 80% 50%)",
              boxShadow: "0 0 8px hsl(0 80% 50% / 0.7)",
            }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: "20%",
              bottom: `${towerHeight * 0.6}px`,
              background: "hsl(0 80% 50%)",
              boxShadow: "0 0 8px hsl(0 80% 50% / 0.7)",
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
        </>
      )}
    </div>
  );
}

// Atmospheric effects layer
function AtmosphereLayer({ stageId }: { stageId: number }) {
  if (stageId < 8) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base ground smoke */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: "120%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${10 + i * 15}%`,
              width: `${8 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 8}px`,
              borderRadius: "50%",
              background: `hsl(220 10% ${40 + Math.random() * 20}% / ${0.15 + Math.random() * 0.15})`,
              imageRendering: "pixelated",
            }}
            animate={{
              y: [0, -(10 + Math.random() * 20)],
              x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20],
              opacity: [0.3, 0],
              scale: [1, 1.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      {/* Golden flood light (stage 9+) */}
      {stageId >= 9 && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "140%",
            height: "30px",
            background:
              "radial-gradient(ellipse at center bottom, hsl(38 92% 50% / 0.12), transparent 70%)",
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

export function LaunchStructure({ stage }: LaunchStructureProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ imageRendering: "pixelated" }}
    >
      <AtmosphereLayer stageId={stage.id} />
      <FoundationLayer stageId={stage.id} />
      <TowerLayer stageId={stage.id} />
    </div>
  );
}
