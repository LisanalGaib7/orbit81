import { useEffect, useState } from "react";
import { Rocket, Share2, X } from "lucide-react";
import { Button } from "./ui/button";

interface MissionAccomplishedProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MissionAccomplished({ isOpen, onClose }: MissionAccomplishedProps) {
  const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number; color: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti
      setConfetti(
        Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          color: ["primary", "accent", "destructive"][Math.floor(Math.random() * 3)],
        }))
      );
    }
  }, [isOpen]);

  const handleShare = () => {
    const text = "🚀 Mission Accomplished! I just completed all 64 goals in my Goal Matrix! #GoalMatrix #Productivity";
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} />
      
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((c) => (
          <div
            key={c.id}
            className={`absolute w-2 h-2 bg-${c.color}`}
            style={{
              left: `${c.x}%`,
              animation: `confetti-fall 3s ease-out infinite`,
              animationDelay: `${c.delay}s`,
              backgroundColor: c.color === "primary" 
                ? "hsl(var(--primary))" 
                : c.color === "accent" 
                ? "hsl(var(--accent))" 
                : "hsl(var(--destructive))",
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6">
          {/* Rocket Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-full">
              <Rocket className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Mission <span className="text-primary">Accomplished!</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              You've completed all 64 goals. Incredible achievement!
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary font-mono">64/64</div>
              <div className="text-xs text-muted-foreground">Goals Complete</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary font-mono">100%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
          </div>

          {/* Share Button */}
          <Button onClick={handleShare} className="w-full gap-2">
            <Share2 className="w-4 h-4" />
            Share Your Achievement
          </Button>
        </div>
      </div>
    </div>
  );
}
