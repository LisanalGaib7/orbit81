/**
 * LaunchStructure — 10-stage dramatically evolving Mechazilla-style launch tower.
 * Each stage introduces a visually distinct element with cinematic entrance animations.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import type { EvolutionStage } from "@/constants/evolutionData";

interface LaunchStructureProps {
  stage: EvolutionStage;
}

/* ── helpers ── */
const TOWER_HEIGHTS = [10, 25, 40, 50, 60, 70, 75, 80, 85, 90];
function getTowerHeight(stageId: number) {
  return TOWER_HEIGHTS[Math.min(stageId - 1, 9)] ?? 10;
}

const AMBIENT_COLORS: Record<number, string> = {
  1: "hsl(35 80% 45% / 0.08)",
  2: "hsl(35 70% 50% / 0.10)",
  3: "hsl(210 80% 55% / 0.10)",
  4: "hsl(200 90% 60% / 0.12)",
  5: "hsl(0 0% 90% / 0.08)",
  6: "hsl(25 80% 50% / 0.10)",
  7: "hsl(140 60% 45% / 0.10)",
  8: "hsl(0 70% 50% / 0.12)",
  9: "hsl(42 90% 55% / 0.15)",
  10: "hsl(15 90% 50% / 0.18)",
};

/* ═══════════════════════════════════════════
   Layer 0 — Foundation
   ═══════════════════════════════════════════ */
function FoundationLayer({ stageId }: { stageId: number }) {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full" style={{ zIndex: 1 }}>
      {/* Wide concrete ground pad */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3"
        style={{
          width: "95%",
          background: "linear-gradient(180deg, hsl(220 12% 22%), hsl(220 15% 12%))",
          borderRadius: "3px 3px 0 0",
          boxShadow: "0 2px 12px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(220 10% 30% / 0.3)",
          imageRendering: "pixelated",
        }}
      />

      {/* 4 Support pylons */}
      <AnimatePresence>
        {stageId >= 1 && (
          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-between"
            style={{ width: "80%" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-4"
                style={{
                  background: "linear-gradient(180deg, hsl(220 10% 35%), hsl(220 12% 20%))",
                  boxShadow: "1px 0 0 hsl(220 10% 40% / 0.3)",
                  imageRendering: "pixelated",
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dust particles (stage 1-2) */}
      {stageId >= 1 && stageId <= 3 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2" style={{ width: "90%" }}>
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${15 + i * 18}%`,
                bottom: 0,
                width: 2,
                height: 2,
                background: "hsl(35 40% 60% / 0.5)",
              }}
              animate={{
                y: [0, -(8 + Math.random() * 12)],
                opacity: [0.5, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Power cables (stage 3+) */}
      {stageId >= 3 && (
        <motion.div
          className="absolute bottom-3 left-1/2 -translate-x-1/2"
          style={{ width: "65%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-px"
              style={{
                left: `${20 + i * 25}%`,
                bottom: 0,
                height: `${8 + i * 3}px`,
                background: `linear-gradient(180deg, hsl(210 90% 60% / 0.7), hsl(210 80% 50% / 0.1))`,
                boxShadow: `0 0 6px hsl(210 90% 60% / 0.5)`,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            />
          ))}
          {/* Electric arc flicker */}
          <motion.div
            className="absolute w-3 h-px"
            style={{
              left: "30%",
              bottom: 8,
              background: "hsl(210 100% 70%)",
              boxShadow: "0 0 8px hsl(210 100% 70% / 0.8), 0 0 16px hsl(210 100% 60% / 0.4)",
            }}
            animate={{ opacity: [0, 1, 0, 0.8, 0], scaleX: [0.5, 1, 0.3, 1.2, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
          />
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Layer 1 — Tower Structure
   ═══════════════════════════════════════════ */
function TowerLayer({ stageId }: { stageId: number }) {
  const h = useMemo(() => getTowerHeight(stageId), [stageId]);

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2" style={{ zIndex: 2, width: "100%" }}>
      {/* ── Stage 2+: Main vertical beam ── */}
      {stageId >= 2 && (
        <motion.div
          className="absolute bottom-0"
          style={{ left: "18%", width: "10%" }}
          initial={{ height: 0 }}
          animate={{ height: `${h}px` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(90deg, hsl(220 10% 32%), hsl(220 10% 22%), hsl(220 10% 28%))",
              boxShadow: "2px 0 0 hsl(220 10% 38% / 0.4), -1px 0 0 hsl(220 10% 12%)",
              imageRendering: "pixelated",
            }}
          />
          {/* Cross-lattice bars */}
          {Array.from({ length: Math.floor(h / 10) }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-[130%] h-px"
              style={{
                bottom: `${(i + 1) * 10}px`,
                left: "-15%",
                background: "hsl(220 8% 40% / 0.6)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
            />
          ))}
          {/* Welding sparks at joints (stage 2-3) */}
          {stageId >= 2 && stageId <= 4 &&
            Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: "50%",
                  bottom: `${(i + 1) * 12}px`,
                  background: "hsl(40 100% 70%)",
                  boxShadow: "0 0 4px hsl(40 100% 60%), 0 0 8px hsl(30 100% 50% / 0.5)",
                }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  scale: [0, 1.2, 0.8, 0],
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  repeatDelay: 1.2 + i * 0.7,
                  delay: i * 0.3,
                }}
              />
            ))}
        </motion.div>
      )}

      {/* ── Stage 4: Fuel Arm ── */}
      {stageId >= 4 && (
        <motion.div
          className="absolute"
          style={{ left: "28%", bottom: `${h * 0.45}px` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div
            className="h-1.5 origin-left"
            style={{
              width: "24px",
              background: "linear-gradient(90deg, hsl(220 10% 28%), hsl(200 40% 38%))",
              boxShadow: "0 1px 2px hsl(0 0% 0% / 0.4)",
              imageRendering: "pixelated",
            }}
          />
          {/* Frost crystals at tip */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                right: `${-2 + i * 3}px`,
                top: `${-2 + i}px`,
                width: 3,
                height: 3,
                background: "hsl(200 100% 85% / 0.7)",
                boxShadow: "0 0 5px hsl(200 100% 80% / 0.6)",
              }}
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
      )}

      {/* ── Stage 5: Upper platform + nav lights ── */}
      {stageId >= 5 && (
        <motion.div
          className="absolute"
          style={{ left: "10%", bottom: `${h - 4}px` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Platform shelf */}
          <div
            style={{
              width: "32px",
              height: "3px",
              background: "linear-gradient(90deg, hsl(220 10% 28%), hsl(220 8% 35%), hsl(220 10% 25%))",
              boxShadow: "0 2px 4px hsl(0 0% 0% / 0.4)",
              imageRendering: "pixelated",
            }}
          />
          {/* Nav strobe lights at corners */}
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                top: -2,
                [i === 0 ? "left" : "right"]: -1,
                background: "hsl(0 0% 95%)",
                boxShadow: "0 0 6px hsl(0 0% 100% / 0.8), 0 0 12px hsl(0 0% 100% / 0.4)",
              }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
      )}

      {/* ── Stage 6: Mechazilla chopstick arms ── */}
      {stageId >= 6 && (
        <>
          {/* Upper arm */}
          <motion.div
            className="absolute origin-bottom-left"
            style={{ left: "28%", bottom: `${h * 0.72}px` }}
            initial={{ rotate: 90, opacity: 0 }}
            animate={{
              rotate: stageId >= 10 ? 30 : stageId >= 9 ? 50 : 70,
              opacity: 1,
            }}
            transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 12 }}
          >
            <div
              style={{
                width: "32px",
                height: "3px",
                background: "linear-gradient(90deg, hsl(220 10% 32%), hsl(220 8% 24%))",
                boxShadow: "0 1px 3px hsl(0 0% 0% / 0.5)",
                imageRendering: "pixelated",
              }}
            />
            {/* Hydraulic steam puff */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: -2,
                top: -4,
                width: 6,
                height: 6,
                background: "hsl(0 0% 80% / 0.3)",
              }}
              animate={{ scale: [0, 1.5, 2], opacity: [0.5, 0.2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
          {/* Lower arm */}
          <motion.div
            className="absolute origin-bottom-left"
            style={{ left: "28%", bottom: `${h * 0.68}px` }}
            initial={{ rotate: 90, opacity: 0 }}
            animate={{
              rotate: stageId >= 10 ? 150 : stageId >= 9 ? 130 : 110,
              opacity: 1,
            }}
            transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 12, delay: 0.1 }}
          >
            <div
              style={{
                width: "32px",
                height: "3px",
                background: "linear-gradient(90deg, hsl(220 10% 32%), hsl(220 8% 24%))",
                boxShadow: "0 1px 3px hsl(0 0% 0% / 0.5)",
                imageRendering: "pixelated",
              }}
            />
          </motion.div>
        </>
      )}

      {/* ── Stage 7: Antenna mast + radar + green beacon ── */}
      {stageId >= 7 && (
        <motion.div
          className="absolute"
          style={{ left: "16%", bottom: `${h + 2}px` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 14, delay: 0.2 }}
        >
          {/* Antenna mast */}
          <div
            className="w-1 h-4"
            style={{
              background: "hsl(220 8% 40%)",
              imageRendering: "pixelated",
            }}
          />
          {/* Radar dish */}
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2"
            style={{ width: 8, height: 8 }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "conic-gradient(from 0deg, hsl(140 60% 50% / 0.5) 0deg, transparent 60deg, transparent 360deg)",
              }}
            />
          </motion.div>
          {/* Green beacon */}
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              background: "hsl(140 70% 45%)",
              boxShadow: "0 0 8px hsl(140 70% 50% / 0.7), 0 0 16px hsl(140 60% 45% / 0.3)",
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </motion.div>
      )}

      {/* ── Stage 8: Cascading red warning lights ── */}
      {stageId >= 8 && (
        <>
          {[0.2, 0.4, 0.6, 0.85].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: "20%",
                bottom: `${h * pos}px`,
                background: "hsl(0 85% 50%)",
                boxShadow: "0 0 10px hsl(0 85% 50% / 0.8), 0 0 20px hsl(0 80% 45% / 0.3)",
              }}
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </>
      )}

      {/* ── Stage 10: Tower lean / retract ── */}
      {stageId >= 10 && (
        <motion.div
          className="absolute bottom-0"
          style={{ left: "18%", width: "10%", height: `${h}px`, transformOrigin: "bottom center" }}
          animate={{ rotate: -5, x: -4 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {/* Visual overlay to show "retracted" state */}
          <div className="w-full h-full" style={{ background: "hsl(220 10% 25% / 0.3)" }} />
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Layer 2 — Atmospheric Effects
   ═══════════════════════════════════════════ */
function AtmosphereLayer({ stageId }: { stageId: number }) {
  const h = getTowerHeight(stageId);

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Ambient glow — all stages */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "160%",
          height: `${h + 20}px`,
          background: `radial-gradient(ellipse at center bottom, ${AMBIENT_COLORS[stageId] || "transparent"}, transparent 70%)`,
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Stage 4+: Frost mist */}
      {stageId >= 4 && stageId < 8 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: "100%" }}>
          {Array.from({ length: 4 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${30 + i * 12}%`,
                bottom: `${h * 0.4}px`,
                width: 5,
                height: 5,
                background: "hsl(200 80% 80% / 0.2)",
              }}
              animate={{
                y: [0, -(6 + Math.random() * 8)],
                x: [(Math.random() - 0.5) * 6],
                opacity: [0.3, 0],
                scale: [1, 1.6],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Stage 6-7: Hydraulic steam */}
      {stageId >= 6 && stageId < 9 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: "100%" }}>
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${25 + i * 10}%`,
                bottom: `${h * 0.7}px`,
                width: 4,
                height: 4,
                background: "hsl(0 0% 70% / 0.2)",
              }}
              animate={{
                y: [0, -15],
                opacity: [0.3, 0],
                scale: [1, 2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* Stage 8+: Ground smoke */}
      {stageId >= 8 && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: "130%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 rounded-full"
              style={{
                left: `${5 + i * 12}%`,
                width: `${6 + Math.random() * 10}px`,
                height: `${6 + Math.random() * 10}px`,
                background: `hsl(220 10% ${45 + Math.random() * 20}% / ${0.12 + Math.random() * 0.12})`,
              }}
              animate={{
                y: [0, -(15 + Math.random() * 25)],
                x: [(Math.random() - 0.5) * 15],
                opacity: [0.3, 0],
                scale: [1, 2.2],
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.35,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Stage 9: Golden flood light */}
      {stageId >= 9 && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "180%",
            height: "50px",
            background: "radial-gradient(ellipse at center bottom, hsl(42 95% 55% / 0.18), transparent 70%)",
          }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* Stage 9: Ignition sparks at base */}
      {stageId >= 9 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: "60%" }}>
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-1 w-1 h-1 rounded-full"
              style={{
                left: `${10 + i * 15}%`,
                background: "hsl(35 100% 65%)",
                boxShadow: "0 0 4px hsl(35 100% 60%)",
              }}
              animate={{
                y: [0, -(5 + Math.random() * 10)],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 0.4 + Math.random() * 0.3,
                repeat: Infinity,
                repeatDelay: 0.3 + Math.random() * 0.5,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}

      {/* Stage 10: Intense ground fire + fire-orange edge glow */}
      {stageId >= 10 && (
        <>
          {/* Fire plume */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: "100%",
              height: "35px",
              background: "radial-gradient(ellipse at center bottom, hsl(20 100% 55% / 0.3), hsl(35 100% 50% / 0.15) 40%, transparent 75%)",
            }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          {/* Exhaust plume particles */}
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={`exhaust-${i}`}
              className="absolute bottom-0 rounded-full"
              style={{
                left: `${35 + Math.random() * 30}%`,
                width: 4,
                height: 4,
                background: `hsl(${20 + Math.random() * 20} 100% ${55 + Math.random() * 20}%)`,
                boxShadow: `0 0 6px hsl(25 100% 55% / 0.6)`,
              }}
              animate={{
                y: [0, -(20 + Math.random() * 30)],
                opacity: [1, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.4,
                repeat: Infinity,
                delay: i * 0.08,
              }}
            />
          ))}
          {/* Screen-edge fire-orange ambient */}
          <motion.div
            className="absolute -bottom-2 -left-4 -right-4"
            style={{
              height: "60px",
              background: "linear-gradient(180deg, transparent, hsl(15 90% 50% / 0.1) 50%, hsl(15 90% 50% / 0.2))",
              pointerEvents: "none",
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          {/* Rapid red strobes */}
          {[0, 1].map((i) => (
            <motion.div
              key={`strobe-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                bottom: "10px",
                left: `${20 + i * 60}%`,
                background: "hsl(0 100% 50%)",
                boxShadow: "0 0 12px hsl(0 100% 50% / 0.9)",
              }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
          ))}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════ */
export function LaunchStructure({ stage }: LaunchStructureProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ imageRendering: "pixelated" }}>
      <AtmosphereLayer stageId={stage.id} />
      <FoundationLayer stageId={stage.id} />
      <TowerLayer stageId={stage.id} />
    </div>
  );
}
