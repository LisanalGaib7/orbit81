import { useEffect, useState } from "react";
import { Rocket, Share2, X, Trophy, Target } from "lucide-react";
import { Button } from "./ui/button";

interface MissionAccomplishedProps {
  isOpen: boolean;
  onClose: () => void;
  showModal: boolean; // Controls when the modal actually appears (after rocket animation)
}

export function MissionAccomplished({ isOpen, onClose, showModal }: MissionAccomplishedProps) {
  const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number; color: string }[]>([]);

  useEffect(() => {
    if (showModal) {
      // Generate confetti
      setConfetti(
        Array.from({ length: 60 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          color: ["gold", "orange", "yellow"][Math.floor(Math.random() * 3)],
        }))
      );
    }
  }, [showModal]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Golden confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute w-2 h-2 rotate-45"
            style={{
              left: `${c.x}%`,
              animation: `confetti-fall 4s ease-out infinite`,
              animationDelay: `${c.delay}s`,
              backgroundColor: c.color === "gold" 
                ? "hsl(45, 100%, 50%)" 
                : c.color === "orange" 
                ? "hsl(38, 92%, 50%)" 
                : "hsl(50, 100%, 60%)",
              boxShadow: `0 0 4px hsl(45, 100%, 60%)`,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div className="relative bg-gradient-to-b from-card to-background border-2 border-primary/30 rounded-3xl p-8 max-w-lg w-full mx-4 animate-scale-in shadow-2xl overflow-hidden">
        {/* Golden glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative text-center space-y-8">
          {/* Trophy Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse scale-150" />
            <div className="relative bg-gradient-to-br from-yellow-400 via-primary to-orange-500 p-5 rounded-full shadow-lg">
              <Trophy className="w-14 h-14 text-primary-foreground drop-shadow-lg" />
            </div>
            {/* Orbiting stars */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "8s" }}>
              <div className="absolute -top-2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full shadow-lg" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }}>
              <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-lg" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-primary to-orange-400">Accomplished!</span>
            </h2>
            <div className="text-muted-foreground">
              <p>You've completed all 64 goals.</p>
              <p className="text-foreground font-semibold mt-1 text-lg">Incredible achievement!</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex justify-center gap-4">
            {/* Goals Complete Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/20 rounded-2xl blur-sm group-hover:blur-md transition-all" />
              <div className="relative bg-card/80 backdrop-blur border-2 border-primary/40 rounded-2xl p-5 min-w-[130px]">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-primary to-orange-500 drop-shadow-lg">
                  64/64
                </div>
                <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Goals Complete</div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/20 rounded-2xl blur-sm group-hover:blur-md transition-all" />
              <div className="relative bg-card/80 backdrop-blur border-2 border-primary/40 rounded-2xl p-5 min-w-[130px]">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Rocket className="w-4 h-4 text-primary" />
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-primary to-orange-500 drop-shadow-lg">
                  100%
                </div>
                <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Progress</div>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <Button 
            onClick={handleShare} 
            className="w-full gap-2 bg-gradient-to-r from-primary via-yellow-500 to-primary hover:from-yellow-500 hover:via-primary hover:to-yellow-500 text-primary-foreground font-semibold py-6 text-base transition-all duration-500"
          >
            <Share2 className="w-5 h-5" />
            Share Your Achievement
          </Button>
        </div>
      </div>
    </div>
  );
}
