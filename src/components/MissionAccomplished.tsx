import { useEffect, useState } from "react";
import { Rocket, Share2, X, Trophy, Target } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface MissionAccomplishedProps {
  isOpen: boolean;
  onClose: () => void;
  showModal: boolean;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}{suffix}</>;
}

/* Floating golden motes behind the modal */
function GoldenMotes() {
  const motes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 4,
    dur: 4 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {motes.map((m) => (
        <motion.div
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.x}%`,
            width: m.size,
            height: m.size,
            background: "hsl(45, 100%, 70%)",
            boxShadow: "0 0 6px hsl(45, 100%, 60%)",
          }}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "-10%", opacity: [0, 0.8, 0.6, 0] }}
          transition={{
            delay: m.delay,
            duration: m.dur,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

export function MissionAccomplished({ isOpen, onClose, showModal }: MissionAccomplishedProps) {
  const handleShare = () => {
    const text = "🚀 Mission Accomplished! I just completed all 64 goals in my Goal Matrix! #GoalMatrix #Productivity";
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  if (!isOpen || !showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Cinematic backdrop */}
        <motion.div
          className="absolute inset-0"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: "radial-gradient(ellipse at 50% 40%, hsl(220, 30%, 8% / 0.92) 0%, hsl(220, 20%, 4% / 0.96) 100%)",
            backdropFilter: "blur(16px) saturate(1.2)",
          }}
        />

        {/* Golden motes */}
        <GoldenMotes />

        {/* Modal */}
        <motion.div
          className="relative rounded-3xl p-8 max-w-lg w-full mx-4 overflow-hidden"
          style={{
            background: "linear-gradient(170deg, hsl(220, 18%, 12%) 0%, hsl(220, 20%, 7%) 100%)",
            border: "1px solid hsl(38, 60%, 30% / 0.4)",
            boxShadow: `
              0 0 80px hsl(38, 92%, 50% / 0.08),
              0 25px 60px hsl(220, 30%, 4% / 0.7),
              inset 0 1px 0 hsl(38, 60%, 50% / 0.15)
            `,
          }}
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {/* Top highlight line */}
          <motion.div
            className="absolute top-0 left-[10%] right-[10%] h-px"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(38, 92%, 50% / 0.5), transparent)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative text-center space-y-7">
            {/* Trophy */}
            <motion.div
              className="relative inline-flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", damping: 12 }}
            >
              {/* Pulsing halo */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 120,
                  height: 120,
                  background: "radial-gradient(circle, hsl(38, 92%, 50% / 0.15) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div
                className="relative p-5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, hsl(45, 100%, 55%), hsl(38, 92%, 45%), hsl(25, 90%, 40%))",
                  boxShadow: "0 4px 20px hsl(38, 92%, 50% / 0.4), inset 0 -2px 6px hsl(25, 80%, 30% / 0.3)",
                }}
              >
                <Trophy className="w-12 h-12 text-primary-foreground drop-shadow-lg" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Mission{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(135deg, hsl(45, 100%, 65%), hsl(38, 92%, 50%), hsl(25, 90%, 50%))",
                  }}
                >
                  Accomplished!
                </span>
              </h2>
              <p className="text-muted-foreground text-sm">
                You've completed all 64 goals.
              </p>
              <motion.p
                className="text-foreground font-semibold text-lg"
                style={{
                  textShadow: "0 0 24px hsl(38, 92%, 50% / 0.5)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Incredible achievement!
              </motion.p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {[
                { icon: Target, label: "Goals Complete", value: 64, suffix: "/64" },
                { icon: Rocket, label: "Progress", value: 100, suffix: "%" },
              ].map((stat, i) => (
                <div key={i} className="relative group">
                  <div
                    className="relative rounded-2xl p-5 min-w-[130px]"
                    style={{
                      background: "hsl(220, 18%, 10%)",
                      border: "1px solid hsl(38, 50%, 30% / 0.3)",
                      boxShadow: "inset 0 1px 0 hsl(38, 50%, 50% / 0.08)",
                    }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-4 h-4 text-primary/70" />
                    </div>
                    <div
                      className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text"
                      style={{
                        backgroundImage: "linear-gradient(180deg, hsl(45, 100%, 70%), hsl(38, 92%, 50%), hsl(25, 85%, 45%))",
                      }}
                    >
                      <AnimatedCounter value={stat.value} />{stat.suffix}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Share Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Button
                onClick={handleShare}
                className="w-full gap-2 text-primary-foreground font-semibold py-6 text-base transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, hsl(38, 92%, 50%), hsl(30, 90%, 45%))",
                  boxShadow: "0 4px 20px hsl(38, 92%, 50% / 0.3)",
                }}
              >
                <Share2 className="w-5 h-5" />
                Share Your Achievement
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
