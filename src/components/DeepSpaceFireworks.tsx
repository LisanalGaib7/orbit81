import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Single firework burst with ring expansion + trailing particles ── */

interface BurstProps {
  x: number;
  y: number;
  delay: number;
  color: string;
  accent: string;
  size: number;
}

function CinematicBurst({ x, y, delay, color, accent, size }: BurstProps) {
  const particleCount = 24;
  const trailCount = 8;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const dist = size * (0.7 + Math.random() * 0.6);
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          dur: 1.2 + Math.random() * 0.6,
          s: 2 + Math.random() * 3,
        };
      }),
    [size],
  );

  const trails = useMemo(
    () =>
      Array.from({ length: trailCount }, (_, i) => {
        const angle = (i / trailCount) * Math.PI * 2 + Math.random() * 0.3;
        const dist = size * (1.1 + Math.random() * 0.4);
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          dur: 1.6 + Math.random() * 0.5,
        };
      }),
    [size],
  );

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {/* Expanding ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          border: `1.5px solid ${color}`,
          boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
          x: "-50%",
          y: "-50%",
        }}
        initial={{ width: 0, height: 0, opacity: 0.9 }}
        animate={{ width: size * 2.5, height: size * 2.5, opacity: 0 }}
        transition={{ delay, duration: 1.4, ease: "easeOut" }}
      />

      {/* Core flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle, white 0%, ${color} 40%, transparent 70%)`,
          x: "-50%",
          y: "-50%",
        }}
        initial={{ width: 8, height: 8, opacity: 1 }}
        animate={{ width: 30, height: 30, opacity: 0 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
      />

      {/* Main particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.s,
            height: p.s,
            background: p.id % 3 === 0 ? accent : color,
            boxShadow: `0 0 ${p.s * 2}px ${color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.2 }}
          transition={{ delay, duration: p.dur, ease: "easeOut" }}
        />
      ))}

      {/* Falling trails (gravity sparkles) */}
      {trails.map((t) => (
        <motion.div
          key={`t-${t.id}`}
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
          }}
          initial={{ x: 0, y: 0, opacity: 0.8 }}
          animate={{
            x: t.dx * 0.8,
            y: [t.dy * 0.3, t.dy * 0.3 + 60],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            delay: delay + 0.6,
            duration: t.dur,
            ease: "easeIn",
          }}
        />
      ))}
    </motion.div>
  );
}

/* ── Shooting star accent ── */

function ShootingStar({ delay }: { delay: number }) {
  const startX = Math.random() * 60 + 20;
  const startY = Math.random() * 30;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 3,
        height: 3,
        background: "hsl(45, 100%, 90%)",
        boxShadow: "0 0 8px hsl(45, 100%, 80%), 0 0 20px hsl(45, 100%, 60%)",
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ opacity: [0, 1, 0], x: 120, y: 80 }}
      transition={{ delay, duration: 0.8, ease: "easeIn" }}
    />
  );
}

/* ── Main component ── */

interface DeepSpaceFireworksProps {
  active: boolean;
}

const PALETTES: [string, string][] = [
  ["hsl(38, 92%, 55%)", "hsl(45, 100%, 80%)"],    // gold
  ["hsl(350, 75%, 55%)", "hsl(10, 90%, 75%)"],     // rose
  ["hsl(200, 90%, 55%)", "hsl(190, 100%, 80%)"],   // cyan
  ["hsl(270, 70%, 60%)", "hsl(290, 80%, 80%)"],    // violet
  ["hsl(160, 70%, 50%)", "hsl(140, 80%, 75%)"],    // emerald
  ["hsl(25, 95%, 55%)", "hsl(40, 100%, 75%)"],     // amber
];

export function DeepSpaceFireworks({ active }: DeepSpaceFireworksProps) {
  const [bursts, setBursts] = useState<(BurstProps & { id: number })[]>([]);
  const [stars, setStars] = useState<{ id: number; delay: number }[]>([]);

  useEffect(() => {
    if (!active) {
      setBursts([]);
      setStars([]);
      return;
    }

    const newBursts = Array.from({ length: 18 }, (_, i) => {
      const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      return {
        id: i,
        x: 8 + Math.random() * 84,
        y: 8 + Math.random() * 55,
        delay: i * 0.35 + Math.random() * 0.15,
        color: pal[0],
        accent: pal[1],
        size: 35 + Math.random() * 50,
      };
    });

    const newStars = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: 1 + i * 1.2,
    }));

    setBursts(newBursts);
    setStars(newStars);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {/* Deep space backdrop with cinematic vignette */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          background: `
            radial-gradient(ellipse at 50% 40%, hsl(260, 40%, 8%) 0%, hsl(220, 50%, 3%) 60%, hsl(0, 0%, 0%) 100%)
          `,
        }}
      />

      {/* Subtle nebula glow */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.5, duration: 2 }}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, hsl(270, 60%, 30% / 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, hsl(200, 70%, 30% / 0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* Firework bursts */}
      <AnimatePresence>
        {bursts.map((b) => (
          <CinematicBurst
            key={b.id}
            x={b.x}
            y={b.y}
            delay={b.delay}
            color={b.color}
            accent={b.accent}
            size={b.size}
          />
        ))}
      </AnimatePresence>

      {/* Shooting stars */}
      {stars.map((s) => (
        <ShootingStar key={s.id} delay={s.delay} />
      ))}

      {/* Ambient light wash that pulses */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.06, 0.02, 0.05, 0] }}
        transition={{ delay: 1, duration: 6, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(38, 92%, 50% / 0.12) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
